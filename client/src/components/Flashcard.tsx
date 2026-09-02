import React from 'react';

interface FlashcardProps {
  question: string;
  answer: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({
  question,
  answer,
  isFlipped,
  onFlip,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onFlip();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onFlip}
      onKeyDown={handleKeyDown}
      aria-label={`Flashcard: ${question}. Press space or click to ${isFlipped ? 'hide' : 'reveal'} answer.`}
      className="perspective-1000 w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-2xl select-none"
    >
      <div
        className={`relative w-full min-h-[260px] md:min-h-[300px] transition-transform duration-500 transform-style-3d rounded-2xl ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Card Front (Question) */}
        <div className="absolute inset-0 backface-hidden glass-card rounded-2xl p-6 md:p-8 flex flex-col justify-between border border-indigo-200 dark:border-indigo-500/20 bg-gradient-to-br from-white via-indigo-50/50 to-white dark:from-slate-900/90 dark:to-indigo-950/40 shadow-xl">
          <div className="flex justify-between items-center text-xs font-semibold text-indigo-700 dark:text-indigo-400">
            <span className="bg-indigo-100 dark:bg-indigo-900/50 px-2.5 py-1 rounded-full border border-indigo-300 dark:border-indigo-700/40">QUESTION</span>
            <span className="text-slate-500 dark:text-slate-400">Tap to flip 🔄</span>
          </div>

          <div className="my-auto text-center py-4">
            <h3 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
              {question}
            </h3>
          </div>

          <div className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
            Click card or press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded border border-slate-300 dark:border-slate-700">Space</kbd> to reveal answer
          </div>
        </div>

        {/* Card Back (Answer) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 glass-card rounded-2xl p-6 md:p-8 flex flex-col justify-between border border-purple-200 dark:border-purple-500/30 bg-gradient-to-br from-white via-purple-50/50 to-white dark:from-slate-900/95 dark:via-purple-950/40 dark:to-slate-900/95 shadow-xl">
          <div className="flex justify-between items-center text-xs font-semibold text-purple-700 dark:text-purple-400">
            <span className="bg-purple-100 dark:bg-purple-900/50 px-2.5 py-1 rounded-full border border-purple-300 dark:border-purple-700/40">ANSWER</span>
            <span className="text-slate-500 dark:text-slate-400">Tap to flip 🔄</span>
          </div>

          <div className="my-auto text-center py-4">
            <p className="text-base md:text-lg text-purple-950 dark:text-purple-100 leading-relaxed font-normal">
              {answer}
            </p>
          </div>

          <div className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
            Click card to return to question
          </div>
        </div>
      </div>
    </div>
  );
};
