import React, { useState, useEffect } from 'react';
import { Search, X, MessageSquare, Mail, Link as LinkIcon, Smartphone } from 'lucide-react';
import Button from '../ui/Button';
import HighlightText from '../ui/HighlightText';
import { ALL_RISK_WORDS } from '../../constants/riskWords';
import { useAnalysisStore } from '../../store/analysisStore';

const MessageInput = ({ onAnalyze }) => {
  const { inputText, messageType, setInput, status } = useAnalysisStore();
  const [localText, setLocalText] = useState(inputText);
  const maxLength = 5000;

  useEffect(() => {
    setLocalText(inputText);
  }, [inputText]);

  const handleTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxLength) {
      setLocalText(text);
      setInput(text, messageType);
    }
  };

  const handleTypeChange = (e) => {
    setInput(localText, e.target.value);
  };

  const handleSubmit = () => {
    if (localText.trim()) {
      onAnalyze(localText, messageType);
    }
  };

  const clearText = () => {
    setLocalText('');
    setInput('', messageType);
  };

  const isLoading = status === 'scanning';

  return (
    <div className="bg-white rounded-xl shadow-lg border border-border p-6 w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <MessageSquare className="text-secondary" />
          Cek Pesan Mencurigakan
        </h2>
        
        <div className="flex items-center gap-2">
          <label htmlFor="msgType" className="text-sm font-medium text-muted">Sumber:</label>
          <div className="relative">
            <select
              id="msgType"
              value={messageType}
              onChange={handleTypeChange}
              className="appearance-none bg-background border border-border rounded-lg pl-8 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="SMS">SMS</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Email">Email</option>
              <option value="URL">Link / URL</option>
            </select>
            <div className="absolute left-2.5 top-2.5 text-muted pointer-events-none">
              {messageType === 'SMS' && <Smartphone size={16} />}
              {messageType === 'WhatsApp' && <MessageSquare size={16} />}
              {messageType === 'Email' && <Mail size={16} />}
              {messageType === 'URL' && <LinkIcon size={16} />}
            </div>
          </div>
        </div>
      </div>

      <div className="relative mb-6">
        {/* We use a visually hidden textarea over a rendered div to allow highlighting */}
        <div className="relative border-2 border-slate-200 rounded-xl focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary transition-all bg-white min-h-[160px]">
          
          <div className="absolute inset-0 p-4 pointer-events-none overflow-hidden">
             {localText ? (
                <HighlightText text={localText} riskWords={ALL_RISK_WORDS} />
             ) : (
                <span className="text-slate-400">Paste pesan mencurigakan di sini... Bisa berupa SMS, pesan WhatsApp, email, atau link.</span>
             )}
          </div>
          
          <textarea
            value={localText}
            onChange={handleTextChange}
            className="w-full min-h-[160px] p-4 bg-transparent text-transparent caret-primary resize-none outline-none z-10 relative font-inherit"
            spellCheck="false"
          />

          {localText && (
            <button
              onClick={clearText}
              className="absolute top-2 right-2 p-1 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 hover:text-slate-700 z-20"
              title="Bersihkan teks"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <div className={`text-right text-xs mt-1 font-medium ${localText.length > 4500 ? 'text-danger' : 'text-muted'}`}>
          {localText.length} / {maxLength}
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          size="lg" 
          onClick={handleSubmit} 
          disabled={!localText.trim() || isLoading}
          loading={isLoading}
          icon={Search}
          className="w-full sm:w-auto min-w-[240px] shadow-md hover:shadow-lg transform transition-transform hover:-translate-y-0.5"
        >
          {isLoading ? 'Menganalisis...' : 'Analisis Sekarang'}
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
