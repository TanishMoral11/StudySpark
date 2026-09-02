import type { StudySet, Flashcard, QuizQuestion } from '../types/study';

/**
 * Validates that an arbitrary object conforms to the StudySet schema and business rules.
 */
export function validateStudySet(data: unknown): StudySet {
  if (!data || typeof data !== 'object') {
    throw new Error('AI returned invalid data format');
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.title !== 'string' || obj.title.trim().length === 0) {
    throw new Error('Study set title is missing or empty');
  }

  if (!Array.isArray(obj.flashcards) || obj.flashcards.length < 5) {
    throw new Error('Study set must contain at least 5 flashcards');
  }

  if (!Array.isArray(obj.quiz) || obj.quiz.length < 5) {
    throw new Error('Study set must contain at least 5 quiz questions');
  }

  const validatedCards: Flashcard[] = obj.flashcards.map((fc, index) => {
    if (!fc || typeof fc !== 'object') {
      throw new Error(`Flashcard ${index + 1} is invalid`);
    }
    const card = fc as Record<string, unknown>;
    if (typeof card.id !== 'string' || typeof card.question !== 'string' || typeof card.answer !== 'string') {
      throw new Error(`Flashcard ${index + 1} has missing fields`);
    }
    if (!card.question.trim() || !card.answer.trim()) {
      throw new Error(`Flashcard ${index + 1} question or answer is empty`);
    }
    return {
      id: card.id || `fc-${index + 1}`,
      question: card.question.trim(),
      answer: card.answer.trim(),
    };
  });

  const validatedQuiz: QuizQuestion[] = obj.quiz.map((q, index) => {
    if (!q || typeof q !== 'object') {
      throw new Error(`Quiz question ${index + 1} is invalid`);
    }
    const item = q as Record<string, unknown>;
    if (
      typeof item.id !== 'string' ||
      typeof item.question !== 'string' ||
      !Array.isArray(item.options) ||
      typeof item.correctIndex !== 'number' ||
      typeof item.explanation !== 'string'
    ) {
      throw new Error(`Quiz question ${index + 1} has missing fields`);
    }

    if (item.options.length !== 4) {
      throw new Error(`Quiz question ${index + 1} must have exactly 4 options`);
    }

    if (item.options.some((opt) => typeof opt !== 'string' || !opt.trim())) {
      throw new Error(`Quiz question ${index + 1} has empty options`);
    }

    if (item.correctIndex < 0 || item.correctIndex > 3 || !Number.isInteger(item.correctIndex)) {
      throw new Error(`Quiz question ${index + 1} correctIndex must be between 0 and 3`);
    }

    return {
      id: item.id || `q-${index + 1}`,
      question: item.question.trim(),
      options: item.options.map((opt: string) => opt.trim()),
      correctIndex: item.correctIndex,
      explanation: item.explanation.trim(),
    };
  });

  return {
    title: obj.title.trim(),
    flashcards: validatedCards,
    quiz: validatedQuiz,
  };
}
