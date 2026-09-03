import { useState, useCallback, useEffect } from 'react';
import type { QuizQuestion, QuizState, StudySet } from '../types/study';

/**
 * Randomly shuffles the order of quiz questions AND randomly shuffles the 4 options
 * inside each question while updating correctIndex so correctness is preserved.
 */
export function shuffleQuizQuestions(questions: QuizQuestion[]): QuizQuestion[] {
  const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);

  return shuffledQuestions.map((q) => {
    const correctAnswerText = q.options[q.correctIndex];
    const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
    const newCorrectIndex = shuffledOptions.indexOf(correctAnswerText);

    return {
      ...q,
      options: shuffledOptions,
      correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0,
    };
  });
}

export function useQuiz(
  studySet: StudySet | null,
  setStudySet: React.Dispatch<React.SetStateAction<StudySet | null>>
) {
  const [quizState, setQuizState] = useState<QuizState>({
    answers: [],
    currentQuestion: 0,
    completed: false,
  });

  const [retestMode, setRetestMode] = useState(false);

  // Sync quizState whenever studySet changes
  useEffect(() => {
    if (studySet) {
      setQuizState({
        answers: studySet.quiz.map(() => ({
          selectedOption: null,
          submitted: false,
          isCorrect: false,
        })),
        currentQuestion: 0,
        completed: false,
      });
      setRetestMode(false);
    }
  }, [studySet]);

  const selectOption = useCallback((optionIndex: number) => {
    setQuizState((prev) => {
      const updatedAnswers = [...prev.answers];
      updatedAnswers[prev.currentQuestion] = {
        ...updatedAnswers[prev.currentQuestion],
        selectedOption: optionIndex,
      };
      return { ...prev, answers: updatedAnswers };
    });
  }, []);

  const clearOption = useCallback(() => {
    setQuizState((prev) => {
      const updatedAnswers = [...prev.answers];
      updatedAnswers[prev.currentQuestion] = {
        ...updatedAnswers[prev.currentQuestion],
        selectedOption: null,
      };
      return { ...prev, answers: updatedAnswers };
    });
  }, []);

  const submitAnswer = useCallback(() => {
    if (!studySet) return;
    const currentQIndex = quizState.currentQuestion;
    const currentAns = quizState.answers[currentQIndex];

    if (currentAns.selectedOption === null) return;

    const correctIndex = studySet.quiz[currentQIndex].correctIndex;
    const isCorrect = currentAns.selectedOption === correctIndex;

    setQuizState((prev) => {
      const updatedAnswers = [...prev.answers];
      updatedAnswers[currentQIndex] = {
        ...updatedAnswers[currentQIndex],
        submitted: true,
        isCorrect,
      };
      return { ...prev, answers: updatedAnswers };
    });
  }, [studySet, quizState.currentQuestion, quizState.answers]);

  const nextQuestion = useCallback(() => {
    if (!studySet) return;
    if (quizState.currentQuestion + 1 >= studySet.quiz.length) {
      setQuizState((prev) => ({ ...prev, completed: true }));
    } else {
      setQuizState((prev) => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }));
    }
  }, [studySet, quizState.currentQuestion]);

  const retestIncorrect = useCallback(() => {
    if (!studySet) return;
    const incorrectIndices = quizState.answers
      .map((ans, idx) => (!ans.isCorrect ? idx : null))
      .filter((val): val is number => val !== null);

    if (incorrectIndices.length === 0) return;

    const incorrectQuestions = incorrectIndices.map((i) => studySet.quiz[i]);
    const jumbledRetest = shuffleQuizQuestions(incorrectQuestions);

    setStudySet({
      ...studySet,
      quiz: jumbledRetest,
    });
    setRetestMode(true);
  }, [studySet, quizState.answers, setStudySet]);

  const restartQuiz = useCallback(() => {
    if (!studySet) return;
    const jumbledQuiz = shuffleQuizQuestions(studySet.quiz);

    setStudySet({
      ...studySet,
      quiz: jumbledQuiz,
    });

    setQuizState({
      answers: jumbledQuiz.map(() => ({
        selectedOption: null,
        submitted: false,
        isCorrect: false,
      })),
      currentQuestion: 0,
      completed: false,
    });
  }, [studySet, setStudySet]);

  const score = quizState.answers.filter((a) => a.isCorrect).length;
  const totalQuestions = studySet?.quiz.length || 0;

  return {
    quizState,
    retestMode,
    score,
    totalQuestions,
    selectOption,
    clearOption,
    submitAnswer,
    nextQuestion,
    retestIncorrect,
    restartQuiz,
  };
}
