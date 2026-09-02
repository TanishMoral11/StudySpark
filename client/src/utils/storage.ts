import type { StudySet, SavedSession } from '../types/study';
import { validateStudySet } from './validateSchema';

const STORAGE_KEY = 'studyspark_session';

export function saveSession(studySet: StudySet): void {
  try {
    const session: SavedSession = {
      title: studySet.title,
      flashcards: studySet.flashcards,
      quiz: studySet.quiz,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Failed to save session to localStorage', error);
  }
}

export function loadSession(): SavedSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const validated = validateStudySet(parsed);
    return {
      title: validated.title,
      flashcards: validated.flashcards,
      quiz: validated.quiz,
      createdAt: parsed.createdAt || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to load session from localStorage', error);
    deleteSession(); // Clear corrupted session
    return null;
  }
}

export function deleteSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to delete session from localStorage', error);
  }
}

export function hasSession(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}
