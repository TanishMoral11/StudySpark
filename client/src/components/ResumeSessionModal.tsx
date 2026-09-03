import React from 'react';
import type { SavedSession } from '../types/study';

interface ResumeSessionModalProps {
  session: SavedSession;
  onResume: () => void;
  onDelete: () => void;
}

export const ResumeSessionModal: React.FC<ResumeSessionModalProps> = ({
  session,
  onResume,
  onDelete,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl p-6 md:p-8 max-w-md w-full border border-indigo-500/30 shadow-2xl animate-fadeIn">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
          <span>📂</span> Resume Previous Session?
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">
          You have a saved study session:
        </p>
        <p className="text-base font-semibold text-indigo-700 dark:text-indigo-300 mb-4 bg-indigo-50 dark:bg-indigo-950/40 p-3 rounded-xl border border-indigo-200 dark:border-indigo-800/40">
          "{session.title}"
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onResume}
            className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs md:text-sm bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md"
          >
            Resume Session
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="py-2.5 px-4 rounded-xl font-semibold text-xs md:text-sm bg-slate-200 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-700 dark:text-slate-400 hover:text-rose-700 dark:hover:text-rose-300 border border-slate-300 dark:border-slate-700 transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
