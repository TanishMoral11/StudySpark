import React from 'react';

interface InputPanelProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  onGenerate: () => void;
  loading: boolean;
}

const MAX_CHARS = 25000;

const EXAMPLE_PROMPTS = [
  "DBMS",
  "Operating Systems",
  "Binary Tree",
  "Photosynthesis & Plant Biology",
];

export const InputPanel: React.FC<InputPanelProps> = ({
  notes,
  onNotesChange,
  onGenerate,
  loading,
}) => {
  const charCount = notes.length;
  const isExceeded = charCount > MAX_CHARS;
  const isValid = notes.trim().length > 0 && !isExceeded;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (isValid && !loading) {
        onGenerate();
      }
    }
  };

  return (
    <div className="w-full glass-card rounded-2xl p-5 md:p-6 mb-8 transition-all">
      <div className="flex items-center justify-between mb-3">
        <label htmlFor="notes-input" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <span>📝</span> Study Notes or Academic Topic
        </label>
        {notes && (
          <button
            type="button"
            onClick={() => onNotesChange('')}
            disabled={loading}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors px-2 py-1 rounded bg-slate-200/80 dark:bg-slate-800/50"
          >
            Clear text
          </button>
        )}
      </div>

      <div className="relative">
        <textarea
          id="notes-input"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder="Enter study notes or topic (e.g. DBMS, Binary Tree, Operating Systems)..."
          rows={4}
          className={`w-full bg-white dark:bg-slate-900/60 border rounded-xl p-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm md:text-base leading-relaxed resize-y min-h-[120px] ${
            isExceeded
              ? 'border-rose-500 dark:border-rose-500 ring-1 ring-rose-500/50'
              : 'border-slate-300 dark:border-slate-700/60'
          }`}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mt-2 text-xs">
        <span
          className={`font-medium ${
            isExceeded
              ? 'text-rose-600 dark:text-rose-400 font-semibold'
              : isValid
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {isExceeded ? (
            <span>⚠️ Input limit exceeded ({charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}). Please reduce your input length.</span>
          ) : (
            <span>
              {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters {isValid ? '✓' : ''}
            </span>
          )}
        </span>
        <span className="text-slate-500 dark:text-slate-500 hidden sm:inline shrink-0">Press Ctrl+Enter to generate</span>
      </div>

      {/* Example Prompt Chips */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/60">
        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Try an example topic:</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              disabled={loading}
              onClick={() => onNotesChange(prompt)}
              className="text-xs bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40 rounded-lg px-3 py-1.5 transition-all text-left truncate max-w-full font-medium"
            >
              💡 {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        type="button"
        onClick={onGenerate}
        disabled={!isValid || loading}
        className={`w-full mt-5 py-3.5 px-6 rounded-xl font-semibold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
          !isValid || loading
            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-300 dark:border-slate-700/40'
            : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 active:scale-[0.99] shadow-indigo-500/20'
        }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Generating Study Material...</span>
          </>
        ) : (
          <>
            <span>✨ Generate Quiz & Flashcards</span>
          </>
        )}
      </button>
    </div>
  );
};
