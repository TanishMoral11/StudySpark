import React from 'react';

/**
 * EmptyState Component
 * Displays an engaging feature showcase hero card when no study set has been generated yet.
 * Welcomes the user and highlights key application capabilities (Flashcards, Quizzes, Smart Retesting).
 */
export const EmptyState: React.FC = () => {
  return (
    <div className="w-full glass-card rounded-2xl p-8 md:p-12 text-center border border-slate-200 dark:border-slate-800/80 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900/60 dark:to-slate-950/80 shadow-xl my-6">
      <div className="w-20 h-20 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
        🧠
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3 tracking-tight">
        Turn Notes Into Interactive Knowledge
      </h2>

      <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed mb-6">
        Paste your lecture notes, article excerpts, or revision topics above. StudySpark AI instantly converts them into active recall flashcards and interactive quizzes.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto pt-4 border-t border-slate-200 dark:border-slate-800/60 text-left">
        <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
          <span className="text-lg">🎴</span>
          <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">Smart Flashcards</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">3D flip cards for active recall testing</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
          <span className="text-lg">🎯</span>
          <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">Interactive Quiz</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Multiple choice with instant explanations</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
          <span className="text-lg">🔄</span>
          <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">Smart Retest</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Retests only your incorrect answers</p>
        </div>
      </div>
    </div>
  );
};
