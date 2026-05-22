import os
import pandas as pd

XLSX_PATH = os.path.join(os.path.dirname(__file__), "..", "backend", "data", "Dataset_AntiPhishing_CIMB_Capstone.xlsx")
JS_OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "frontend", "src", "constants", "riskWords.js")

def main():
    if not os.path.exists(XLSX_PATH):
        print(f"Error: Excel file not found at {XLSX_PATH}")
        return

    try:
        df = pd.read_excel(XLSX_PATH, sheet_name="Kata_Kunci_Risiko")
    except Exception as e:
        print(f"Error reading Excel sheet: {str(e)}")
        return

    risk_words_id = {}
    risk_word_weights = {}

    for _, row in df.iterrows():
        keyword = str(row.get("Kata / Frasa", "")).strip().lower()
        if not keyword or keyword == "nan":
            continue
            
        category = str(row.get("Kategori", "")).strip().upper().replace(" ", "_").replace("-", "_")
        try:
            weight = int(row.get("Bobot Risiko (1-5)", 3))
        except:
            weight = 3

        if category not in risk_words_id:
            risk_words_id[category] = []
            
        if keyword not in risk_words_id[category]:
            risk_words_id[category].append(keyword)
            
        risk_word_weights[keyword] = weight

    os.makedirs(os.path.dirname(JS_OUTPUT_PATH), exist_ok=True)
    
    with open(JS_OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write("// Auto-generated — jangan edit manual\n\n")
        f.write("export const RISK_WORDS_ID = {\n")
        for cat, words in risk_words_id.items():
            words_str = ", ".join([f'"{w}"' for w in words])
            f.write(f"  {cat}: [{words_str}],\n")
        f.write("};\n\n")
        
        f.write("export const ALL_RISK_WORDS = [\n")
        f.write("  ...Object.values(RISK_WORDS_ID).flat()\n")
        f.write("];\n\n")
        
        f.write("export const RISK_WORD_WEIGHTS = {\n")
        for kw, weight in risk_word_weights.items():
            f.write(f'  "{kw}": {weight},\n')
        f.write("};\n")

    total_keywords = sum(len(words) for words in risk_words_id.values())
    print(f"Generated riskWords.js — {total_keywords} keywords")

if __name__ == "__main__":
    main()
