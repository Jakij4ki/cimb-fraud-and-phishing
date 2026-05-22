import os
import json
import logging
import torch
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, classification_report
from transformers import (
    AutoTokenizer, 
    AutoModelForSequenceClassification, 
    TrainingArguments, 
    Trainer
)
from datasets import Dataset

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

def compute_metrics(pred):
    labels = pred.label_ids
    preds = pred.predictions.argmax(-1)
    precision, recall, f1, _ = precision_recall_fscore_support(labels, preds, average="weighted")
    acc = accuracy_score(labels, preds)
    return {
        "accuracy": acc,
        "f1": f1,
        "precision": precision,
        "recall": recall
    }

def main():
    # Load Data
    data_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'nlp_dataset_BAHASA_ID_only.csv')
    model_dir = os.path.join(os.path.dirname(__file__), 'model', 'indobert-phishing')
    
    logger.info(f"Loading dataset from {data_path}")
    if not os.path.exists(data_path):
        logger.error(f"Dataset not found at {data_path}")
        return

    df = pd.read_csv(data_path)
    
    # Stratified split: Train 70%, Val 15%, Test 15%
    train_texts, temp_texts, train_labels, temp_labels = train_test_split(
        df['text'].tolist(), df['label'].tolist(),
        test_size=0.3, random_state=42, stratify=df['label']
    )
    val_texts, test_texts, val_labels, test_labels = train_test_split(
        temp_texts, temp_labels,
        test_size=0.5, random_state=42, stratify=temp_labels
    )
    
    logger.info(f"Dataset split: Train={len(train_texts)}, Val={len(val_texts)}, Test={len(test_texts)}")

    model_name = "indolem/indobert-base-uncased"
    logger.info(f"Loading tokenizer: {model_name}")
    tokenizer = AutoTokenizer.from_pretrained(model_name)

    def tokenize_function(examples):
        return tokenizer(examples['text'], padding="max_length", truncation=True, max_length=128)

    train_dataset = Dataset.from_dict({'text': train_texts, 'label': train_labels})
    val_dataset = Dataset.from_dict({'text': val_texts, 'label': val_labels})
    test_dataset = Dataset.from_dict({'text': test_texts, 'label': test_labels})

    train_dataset = train_dataset.map(tokenize_function, batched=True)
    val_dataset = val_dataset.map(tokenize_function, batched=True)
    test_dataset = test_dataset.map(tokenize_function, batched=True)

    logger.info("Loading model...")
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    logger.info(f"Using device: {device}")
    
    model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)
    model.to(device)

    training_args = TrainingArguments(
        output_dir=model_dir,
        num_train_epochs=3,
        per_device_train_batch_size=16,
        per_device_eval_batch_size=32,
        learning_rate=2e-5,
        weight_decay=0.01,
        evaluation_strategy="epoch",
        save_strategy="epoch",
        load_best_model_at_end=True,
        metric_for_best_model="f1",
        logging_steps=50,
        report_to="none"
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        compute_metrics=compute_metrics
    )

    logger.info("Starting training...")
    trainer.train()

    logger.info("Evaluating on test set...")
    test_results = trainer.predict(test_dataset)
    
    # Print classification report
    preds = test_results.predictions.argmax(-1)
    report = classification_report(test_labels, preds, target_names=["ham", "phishing"])
    logger.info("\n" + report)

    logger.info(f"Saving model and tokenizer to {model_dir}")
    model.save_pretrained(model_dir)
    tokenizer.save_pretrained(model_dir)

    results_file = os.path.join(os.path.dirname(__file__), 'model', 'eval_results_nlp.json')
    os.makedirs(os.path.dirname(results_file), exist_ok=True)
    with open(results_file, 'w') as f:
        json.dump(test_results.metrics, f, indent=4)
    logger.info(f"Evaluation results saved to {results_file}")

if __name__ == "__main__":
    main()
