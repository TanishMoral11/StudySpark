/**
 * Application-wide configuration constants.
 * Centralized single source of truth for UI boundaries, network timeouts, and storage keys.
 */
export const APP_CONFIG = {
  /**
   * Maximum character count allowed in the study notes textarea (25,000 characters ~ 10-15 pages of text).
   * Prevents HTTP payload size errors (413) and keeps LLM context focused.
   */
  MAX_INPUT_CHARS: 25000,

  /**
   * Network fetch timeout duration in milliseconds (30,000 ms = 30 seconds).
   * Automatically aborts hung AI requests if Google Gemini backend experiences high latency.
   */
  API_TIMEOUT_MS: 30000,

  /**
   * LocalStorage key definitions for persisting user session and theme preferences across page reloads.
   */
  STORAGE_KEYS: {
    /** Key used to store saved StudySet data (title, flashcards, quiz questions) */
    SESSION: 'studyspark_session',
    /** Key used to store user theme preference ('dark' | 'light') */
    THEME: 'studyspark_theme',
  },
} as const;
