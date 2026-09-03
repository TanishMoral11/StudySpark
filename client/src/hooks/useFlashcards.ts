import { useState, useEffect, useCallback } from 'react';

export function useFlashcards(totalCards: number, isEnabled: boolean) {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const nextCard = useCallback(() => {
    if (totalCards === 0) return;
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % totalCards);
  }, [totalCards]);

  const prevCard = useCallback(() => {
    if (totalCards === 0) return;
    setIsFlipped(false);
    setCurrentCard((prev) => (prev - 1 + totalCards) % totalCards);
  }, [totalCards]);

  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const resetFlashcards = useCallback(() => {
    setCurrentCard(0);
    setIsFlipped(false);
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (isEnabled && totalCards > 0) {
        if (e.key === 'ArrowRight') nextCard();
        if (e.key === 'ArrowLeft') prevCard();
        if (e.key === ' ') {
          e.preventDefault();
          toggleFlip();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEnabled, totalCards, nextCard, prevCard, toggleFlip]);

  return {
    currentCard,
    isFlipped,
    nextCard,
    prevCard,
    toggleFlip,
    resetFlashcards,
  };
}
