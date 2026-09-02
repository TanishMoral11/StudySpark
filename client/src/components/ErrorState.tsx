import React from 'react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Couldn't generate study material",
  message,
  onRetry,
}) => {
  return (
    <div role="alert" className="w-full glass-card rounded-2xl p-6 md:p-8 border border-rose-300 dark:border-rose-500/30 bg-gradient-to-br from-rose-50/80 via-white to-rose-50/50 dark:from-slate-900/90 dark:via-rose-950/20 dark:to-slate-900/90 text-center shadow-xl mb-8 animate-fadeIn">
      <div className="w-16 h-16 bg-rose-100 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
        ⚠️
      </div>

      <h3 className="text-lg md:text-xl font-bold text-rose-900 dark:text-rose-200 mb-2">
        {title}
      </h3>

      <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6 leading-relaxed">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 mx-auto active:scale-95"
      >
        <span>🔄 Try Again</span>
      </button>
    </div>
  );
};
