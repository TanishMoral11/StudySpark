import React, { useState, useEffect } from 'react';
import { useGenerate } from '../hooks/useGenerate';
import { useTheme } from '../hooks/useTheme';
import { useFlashcards } from '../hooks/useFlashcards';
import { useQuiz } from '../hooks/useQuiz';
import { InputPanel } from '../components/InputPanel';
import { Flashcard } from '../components/Flashcard';
import { QuizCard } from '../components/QuizCard';
import { QuizScoreCard } from '../components/QuizScoreCard';
import { ResumeSessionModal } from '../components/ResumeSessionModal';
import { ProgressBar } from '../components/ProgressBar';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import type { ViewMode, SavedSession } from '../types/study';
import { loadSession, deleteSession } from '../utils/storage';

export const Home: React.FC = () => {
  const {
    notes,
    setNotes,
    loading,
    error,
    studySet,
    setStudySet,
    generate,
  } = useGenerate();

  const { theme, toggleTheme } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('flashcards');

  // Flashcards Hook
  const {
    currentCard,
    isFlipped,
    nextCard,
    prevCard,
    toggleFlip,
    resetFlashcards,
  } = useFlashcards(
    studySet?.flashcards.length || 0,
    viewMode === 'flashcards' && !!studySet && !loading
  );

  // Quiz Hook
  const {
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
  } = useQuiz(studySet, setStudySet);

  // Resume Session Modal State
  const [savedSession, setSavedSession] = useState<SavedSession | null>(null);
  const [showResumeModal, setShowResumeModal] = useState(false);

  // Reset flashcards when studySet changes
  useEffect(() => {
    if (studySet) {
      resetFlashcards();
    }
  }, [studySet, resetFlashcards]);

  // Check for saved session on mount
  useEffect(() => {
    const session = loadSession();
    if (session) {
      setSavedSession(session);
      setShowResumeModal(true);
    }
  }, []);

  // Session resume handlers
  const handleResumeSession = () => {
    if (savedSession) {
      setStudySet({
        title: savedSession.title,
        flashcards: savedSession.flashcards,
        quiz: savedSession.quiz,
      });
    }
    setShowResumeModal(false);
  };

  const handleDeleteSession = () => {
    deleteSession();
    setSavedSession(null);
    setShowResumeModal(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Top Bar with Icon-Only Theme Toggle */}
      <div className="flex justify-between items-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-700/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-sm">
          <span>⚡ AI Study Assistant</span>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="w-10 h-10 rounded-xl border flex items-center justify-center text-lg transition-all bg-white dark:bg-slate-900/80 border-slate-300 dark:border-slate-700 text-amber-500 dark:text-amber-400 hover:scale-105 active:scale-95 shadow-sm"
        >
          <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
        </button>
      </div>

      {/* App Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 dark:from-slate-100 dark:via-indigo-200 dark:to-purple-200 tracking-tight">
          StudySpark
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
          Convert free-form notes into structured flashcards and interactive quizzes instantly.
        </p>
      </header>

      {/* Input Panel */}
      <InputPanel
        notes={notes}
        onNotesChange={setNotes}
        onGenerate={generate}
        loading={loading}
      />

      {/* Loading State */}
      {loading && <LoadingState />}

      {/* Error State */}
      {error && !loading && (
        <ErrorState message={error} onRetry={generate} />
      )}

      {/* Empty State */}
      {!studySet && !loading && !error && <EmptyState />}

      {/* Success State */}
      {studySet && !loading && (
        <section className="w-full animate-fadeIn">
          {/* Study Set Header */}
          <div className="glass-card rounded-2xl p-5 md:p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {studySet.title}
                </h2>
                {retestMode && (
                  <span className="text-xs bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700/60 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full font-medium">
                    Retest Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {studySet.flashcards.length} Flashcards • {studySet.quiz.length} Quiz Questions
              </p>
            </div>

            {/* View Mode Tabs */}
            <div className="flex bg-slate-200/80 dark:bg-slate-900/90 p-1.5 rounded-xl border border-slate-300 dark:border-slate-800 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('flashcards')}
                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all flex items-center gap-2 ${
                  viewMode === 'flashcards'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span>🎴 Flashcards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('quiz')}
                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all flex items-center gap-2 ${
                  viewMode === 'quiz'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span>🎯 Quiz</span>
              </button>
            </div>
          </div>

          {/* Flashcards View */}
          {viewMode === 'flashcards' && (
            <div className="w-full">
              <ProgressBar
                current={currentCard + 1}
                total={studySet.flashcards.length}
                label="Flashcard Progress"
              />

              <Flashcard
                question={studySet.flashcards[currentCard].question}
                answer={studySet.flashcards[currentCard].answer}
                isFlipped={isFlipped}
                onFlip={toggleFlip}
              />

              {/* Navigation Controls */}
              <div className="flex items-center justify-between mt-6">
                <button
                  type="button"
                  onClick={prevCard}
                  className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm font-semibold transition-all flex items-center gap-2 shadow-sm"
                >
                  <span>← Previous</span>
                </button>

                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Card {currentCard + 1} of {studySet.flashcards.length}
                </span>

                <button
                  type="button"
                  onClick={nextCard}
                  className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm font-semibold transition-all flex items-center gap-2 shadow-sm"
                >
                  <span>Next →</span>
                </button>
              </div>
            </div>
          )}

          {/* Quiz View */}
          {viewMode === 'quiz' && (
            <div className="w-full">
              {!quizState.completed ? (
                <>
                  <ProgressBar
                    current={quizState.currentQuestion + 1}
                    total={totalQuestions}
                    label="Quiz Progress"
                  />

                  {quizState.answers[quizState.currentQuestion] && (
                    <QuizCard
                      question={studySet.quiz[quizState.currentQuestion].question}
                      options={studySet.quiz[quizState.currentQuestion].options}
                      selectedOption={quizState.answers[quizState.currentQuestion].selectedOption}
                      submitted={quizState.answers[quizState.currentQuestion].submitted}
                      correctIndex={studySet.quiz[quizState.currentQuestion].correctIndex}
                      explanation={studySet.quiz[quizState.currentQuestion].explanation}
                      onSelect={selectOption}
                      onSubmit={submitAnswer}
                      onClear={clearOption}
                      onNext={nextQuestion}
                      isLastQuestion={quizState.currentQuestion + 1 === totalQuestions}
                    />
                  )}
                </>
              ) : (
                <QuizScoreCard
                  score={score}
                  totalQuestions={totalQuestions}
                  onRetestIncorrect={retestIncorrect}
                  onRestartQuiz={restartQuiz}
                />
              )}
            </div>
          )}
        </section>
      )}

      {/* Resume Previous Session Modal */}
      {showResumeModal && savedSession && (
        <ResumeSessionModal
          session={savedSession}
          onResume={handleResumeSession}
          onDelete={handleDeleteSession}
        />
      )}
    </div>
  );
};
