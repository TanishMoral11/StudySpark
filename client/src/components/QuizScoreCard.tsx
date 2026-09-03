import React from 'react';

interface QuizScoreCardProps {
  score: number;
  totalQuestions: number;
  onRetestIncorrect: () => void;
  onRestartQuiz: () => void;
}

export const QuizScoreCard: React.FC<QuizScoreCardProps> = ({
  score,
  totalQuestions,
  onRetestIncorrect,
  onRestartQuiz,
}) => {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const hasIncorrect = score < totalQuestions;

  return (
    <div className="glass-card rounded-2xl p-8 md:p-12 text-center shadow-2xl animate-fadeIn">
      <div className="w-20 h-20 bg-indigo-500/10 border border-indigo-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
        🏆
      </div>

      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
        Quiz Complete!
      </h3>

      <p className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-6">
        {score} / {totalQuestions} Correct ({percentage}%)
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
        {hasIncorrect && (
          <button
            type="button"
            onClick={onRetestIncorrect}
            className="px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg transition-all"
          >
            🔄 Retest Incorrect Questions ({totalQuestions - score})
          </button>
        )}

        <button
          type="button"
          onClick={onRestartQuiz}
          className="px-6 py-3 rounded-xl font-semibold text-sm bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-all flex items-center justify-center gap-2"
        >
          <span>Restart Quiz</span>
        </button>
      </div>
    </div>
  );
};
