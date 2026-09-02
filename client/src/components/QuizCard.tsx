import React from 'react';

interface QuizCardProps {
  question: string;
  options: string[];
  selectedOption: number | null;
  submitted: boolean;
  correctIndex: number;
  explanation: string;
  onSelect: (index: number) => void;
  onSubmit: () => void;
  onClear?: () => void;
  onNext?: () => void;
  isLastQuestion?: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  options,
  selectedOption,
  submitted,
  correctIndex,
  explanation,
  onSelect,
  onSubmit,
  onClear,
  onNext,
  isLastQuestion = false,
}) => {
  const isCorrect = selectedOption === correctIndex;

  return (
    <div className="w-full glass-card rounded-2xl p-6 md:p-8 shadow-xl">
      <h3 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6 leading-relaxed">
        {question}
      </h3>

      {/* Options List */}
      <div className="space-y-3 mb-6">
        {options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isThisCorrect = idx === correctIndex;

          let btnStyle = 'border-slate-300 dark:border-slate-700/60 bg-slate-100/80 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-800/80 hover:border-slate-400 dark:hover:border-slate-600';

          if (isSelected && !submitted) {
            btnStyle = 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-950 dark:text-indigo-100 ring-2 ring-indigo-500/50';
          } else if (submitted) {
            if (isThisCorrect) {
              btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/50';
            } else if (isSelected && !isCorrect) {
              btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-950 dark:text-rose-100 ring-2 ring-rose-500/50';
            } else {
              btnStyle = 'border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/30 text-slate-400 dark:text-slate-500 opacity-60';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={submitted}
              onClick={() => onSelect(idx)}
              className={`w-full min-h-[52px] p-4 rounded-xl text-left border transition-all flex items-start gap-3.5 ${btnStyle}`}
            >
              <span className={`w-6 h-6 rounded-full border text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                submitted && isThisCorrect
                  ? 'border-emerald-500 bg-emerald-500 text-white dark:text-slate-950'
                  : submitted && isSelected && !isCorrect
                  ? 'border-rose-500 bg-rose-500 text-white'
                  : isSelected
                  ? 'border-indigo-500 bg-indigo-500 text-white'
                  : 'border-slate-400 dark:border-slate-600 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                {submitted && isThisCorrect ? '✓' : submitted && isSelected && !isCorrect ? '✕' : String.fromCharCode(65 + idx)}
              </span>

              <span className="text-sm md:text-base leading-snug font-normal flex-1">
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {/* Explanation Banner */}
      {submitted && (
        <div className={`p-4 rounded-xl mb-6 border ${
          isCorrect
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/50 text-rose-900 dark:text-rose-200'
        }`}>
          <div className="flex items-center gap-2 font-semibold text-sm mb-1">
            <span>{isCorrect ? '🎉 Correct!' : '❌ Incorrect'}</span>
          </div>
          <p className="text-xs md:text-sm leading-relaxed opacity-90">
            {explanation}
          </p>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-2">
        {/* Left Side: Grey Clear Answer Button (only visible when answer is selected and before submission) */}
        <div>
          {!submitted && selectedOption !== null && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="px-4 py-2.5 rounded-xl font-semibold text-xs md:text-sm transition-all bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <span>✕ Clear Selection</span>
            </button>
          )}
        </div>

        {/* Right Side: Submit / Next Button */}
        <div>
          {!submitted ? (
            <button
              type="button"
              disabled={selectedOption === null}
              onClick={onSubmit}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                selectedOption === null
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-300 dark:border-slate-700/40'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
              }`}
            >
              Submit Answer
            </button>
          ) : (
            onNext && (
              <button
                type="button"
                onClick={onNext}
                className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
              >
                <span>{isLastQuestion ? 'View Results' : 'Next Question'}</span>
                <span>→</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
