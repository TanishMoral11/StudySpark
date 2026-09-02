import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="w-full glass-card rounded-2xl p-6 md:p-8 animate-pulse border border-slate-200 dark:border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3"></div>
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-20"></div>
      </div>

      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full w-full"></div>

      <div className="h-64 bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center animate-spin">
          <span className="text-xl">⚡</span>
        </div>
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2"></div>
        <div className="h-4 bg-slate-200/80 dark:bg-slate-800/60 rounded-md w-2/3"></div>
      </div>

      <div className="flex justify-between items-center pt-2">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-28"></div>
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-28"></div>
      </div>
    </div>
  );
};
