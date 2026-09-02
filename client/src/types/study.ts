export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StudySet {
  title: string;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}

export interface InvalidInputResponse {
  status: 'invalid_input';
  message: string;
}

export type GenerateAPIResponse = StudySet | InvalidInputResponse;

export type ViewMode = 'flashcards' | 'quiz';

export interface QuizAnswerState {
  selectedOption: number | null;
  submitted: boolean;
  isCorrect: boolean;
}

export interface QuizState {
  answers: QuizAnswerState[];
  currentQuestion: number;
  completed: boolean;
}

export interface SavedSession {
  title: string;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  createdAt: string;
}
