import React, { useState, useEffect } from 'react';
import { useGenerate } from '../hooks/useGenerate';
import { InputPanel } from '../components/InputPanel';
import { Flashcard } from '../components/Flashcard';
import { QuizCard } from '../components/QuizCard';
import { ProgressBar } from '../components/ProgressBar';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import type { ViewMode, QuizState, SavedSession } from '../types/study';
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

  const [viewMode, setViewMode] = useState<ViewMode>('flashcards');

  // Flashcards State
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz State
  const [quizState, setQuizState] = useState<QuizState>({
    answers: [],
    currentQuestion: 0,
    completed: false,
  });

  // Retest State
  const [retestMode, setRetestMode] = useState(false);

  // Resume Session Modal State
  const [savedSession, setSavedSession] = useState<SavedSession | null>(null);
  const [showResumeModal, setShowResumeModal] = useState(false);

  // Check for saved session on mount
  useEffect(() => {
    const session = loadSession();
    if (session) {
      setSavedSession(session);
      setShowResumeModal(true);
    }
  }, []);

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
      setCurrentCard(0);
      setIsFlipped(false);
      setRetestMode(false);
    }
  }, [studySet]);

  // Flashcard Navigation
  const nextCard = () => {
    if (!studySet) return;
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % studySet.flashcards.length);
  };

  const prevCard = () => {
    if (!studySet) return;
    setIsFlipped(false);
    setCurrentCard((prev) => (prev - 1 + studySet.flashcards.length) % studySet.flashcards.length);
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept keyboard shortcuts if focus is inside input/textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (studySet && !loading) {
        if (viewMode === 'flashcards') {
          if (e.key === 'ArrowRight') nextCard();
          if (e.key === 'ArrowLeft') prevCard();
          if (e.key === ' ') {
            e.preventDefault();
            setIsFlipped((prev) => !prev);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [studySet, loading, viewMode, currentCard]);

  // Quiz Interaction Handlers
  const handleSelectQuizOption = (optionIndex: number) => {
    setQuizState((prev) => {
      const updatedAnswers = [...prev.answers];
      updatedAnswers[prev.currentQuestion] = {
        ...updatedAnswers[prev.currentQuestion],
        selectedOption: optionIndex,
      };
      return { ...prev, answers: updatedAnswers };
    });
  };

  const handleSubmitQuizAnswer = () => {
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
  };

  const handleNextQuizQuestion = () => {
    if (!studySet) return;
    if (quizState.currentQuestion + 1 >= studySet.quiz.length) {
      setQuizState((prev) => ({ ...prev, completed: true }));
    } else {
      setQuizState((prev) => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }));
    }
  };

  const handleRetestIncorrect = () => {
    if (!studySet) return;
    // Local retest algorithm: reset only incorrect questions
    const incorrectIndices = quizState.answers
      .map((ans, idx) => (!ans.isCorrect ? idx : null))
      .filter((val): val is number => val !== null);

    if (incorrectIndices.length === 0) return;

    // Filter studySet quiz to incorrect questions
    const newQuizQuestions = incorrectIndices.map((i) => studySet.quiz[i]);

    setStudySet({
      ...studySet,
      quiz: newQuizQuestions,
    });
    setRetestMode(true);
  };

  // Compute quiz score
  const score = quizState.answers.filter((a) => a.isCorrect).length;
  const totalQuizQuestions = studySet?.quiz.length || 0;

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
      {/* App Header */}
      <header className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-semibold mb-4 shadow-sm">
          <span>⚡ AI Study Assistant</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-indigo-200 to-purple-200 tracking-tight">
          StudySpark
        </h1>
        <p className="text-sm md:text-base text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
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
          <div className="glass-card rounded-2xl p-5 md:p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold text-slate-100">
                  {studySet.title}
                </h2>
                {retestMode && (
                  <span className="text-xs bg-amber-950/80 border border-amber-700/60 text-amber-300 px-2.5 py-0.5 rounded-full font-medium">
                    Retest Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {studySet.flashcards.length} Flashcards • {studySet.quiz.length} Quiz Questions
              </p>
            </div>

            {/* View Mode Tabs */}
            <div className="flex bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('flashcards')}
                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all flex items-center gap-2 ${
                  viewMode === 'flashcards'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
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
                    : 'text-slate-400 hover:text-slate-200'
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
                onFlip={() => setIsFlipped((prev) => !prev)}
              />

              {/* Navigation Controls */}
              <div className="flex items-center justify-between mt-6">
                <button
                  type="button"
                  onClick={prevCard}
                  className="px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 text-sm font-semibold transition-all flex items-center gap-2"
                >
                  <span>← Previous</span>
                </button>

                <span className="text-xs font-semibold text-slate-400">
                  {currentCard + 1} / {studySet.flashcards.length}
                </span>

                <button
                  type="button"
                  onClick={nextCard}
                  className="px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 text-sm font-semibold transition-all flex items-center gap-2"
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
                    total={totalQuizQuestions}
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
                      onSelect={handleSelectQuizOption}
                      onSubmit={handleSubmitQuizAnswer}
                      onNext={handleNextQuizQuestion}
                      isLastQuestion={quizState.currentQuestion + 1 === totalQuizQuestions}
                    />
                  )}
                </>
              ) : (
                /* Quiz Complete Score Card */
                <div className="glass-card rounded-2xl p-8 md:p-12 text-center border border-slate-800 shadow-2xl">
                  <div className="w-20 h-20 bg-indigo-500/10 border border-indigo-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                    🏆
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-slate-100 mb-2">
                    Quiz Complete!
                  </h3>

                  <p className="text-lg font-semibold text-indigo-300 mb-6">
                    {score} / {totalQuizQuestions} Correct ({Math.round((score / totalQuizQuestions) * 100)}%)
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                    {score < totalQuizQuestions && (
                      <button
                        type="button"
                        onClick={handleRetestIncorrect}
                        className="px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg transition-all"
                      >
                        🔄 Retest Incorrect Questions ({totalQuizQuestions - score})
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setQuizState({
                          answers: studySet.quiz.map(() => ({
                            selectedOption: null,
                            submitted: false,
                            isCorrect: false,
                          })),
                          currentQuestion: 0,
                          completed: false,
                        });
                      }}
                      className="px-6 py-3 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                    >
                      Restart Entire Quiz
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Resume Previous Session Modal */}
      {showResumeModal && savedSession && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-6 md:p-8 max-w-md w-full border border-indigo-500/30 shadow-2xl animate-fadeIn">
            <h3 className="text-xl font-bold text-slate-100 mb-2 flex items-center gap-2">
              <span>📂</span> Resume Previous Session?
            </h3>
            <p className="text-sm text-slate-300 mb-1">
              You have a saved study session:
            </p>
            <p className="text-base font-semibold text-indigo-300 mb-4 bg-indigo-950/40 p-3 rounded-xl border border-indigo-800/40">
              "{savedSession.title}"
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResumeSession}
                className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs md:text-sm bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
              >
                Resume Session
              </button>
              <button
                type="button"
                onClick={handleDeleteSession}
                className="py-2.5 px-4 rounded-xl font-semibold text-xs md:text-sm bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 border border-slate-700 text-slate-400 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
