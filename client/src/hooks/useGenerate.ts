import { useState, useRef, useEffect, useCallback } from 'react';
import type { StudySet } from '../types/study';
import { validateResponseData } from '../utils/validateSchema';
import { saveSession } from '../utils/storage';
import { APP_CONFIG } from '../config/constants';

export function useGenerate() {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studySet, setStudySet] = useState<StudySet | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  const generate = useCallback(async () => {
    const trimmedNotes = notes.trim();
    if (!trimmedNotes) {
      setError('Please enter study notes or an academic topic.');
      setStudySet(null);
      return;
    }

    // Cancel any ongoing request (Stale request protection)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    // Set 30-second timeout for long-running AI calls
    const timeoutId = setTimeout(() => {
      controller.abort('timeout');
    }, APP_CONFIG.API_TIMEOUT_MS);

    const currentRequestId = ++requestIdRef.current;

    setLoading(true);
    setError(null);
    setStudySet(null); // Hide previous results during generation & on error

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: trimmedNotes }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Ignore stale responses if a newer request was dispatched
      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      if (!response.ok) {
        let errMessage = 'Couldn\'t generate study material. Check your connection.';
        try {
          const errData = await response.json();
          if (errData.message) errMessage = errData.message;
          else if (errData.error) errMessage = errData.error;
        } catch {
          // Use default error
        }
        throw new Error(errMessage);
      }

      const jsonObject = await response.json();
      const validatedResult = validateResponseData(jsonObject);

      // Handle Invalid Input Response from LLM
      if ('status' in validatedResult && validatedResult.status === 'invalid_input') {
        if (currentRequestId === requestIdRef.current) {
          setError(validatedResult.message);
          setStudySet(null);
        }
        return;
      }

      // Handle Success StudySet Response
      if (currentRequestId === requestIdRef.current) {
        const validStudySet = validatedResult as StudySet;
        setStudySet(validStudySet);
        saveSession(validStudySet);
      }
    } catch (err: unknown) {
      clearTimeout(timeoutId);

      if (err instanceof Error) {
        if (err.name === 'AbortError' || controller.signal.aborted) {
          if (controller.signal.reason === 'timeout') {
            if (currentRequestId === requestIdRef.current) {
              setError('Generation timed out. Please try again.');
              setStudySet(null);
            }
          }
          return; // Intentionally aborted or timed out
        }
        if (currentRequestId === requestIdRef.current) {
          setError(err.message || 'Couldn\'t generate study material. Check your connection.');
          setStudySet(null);
        }
      } else if (currentRequestId === requestIdRef.current) {
        setError('An unexpected error occurred. Please try again.');
        setStudySet(null);
      }
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [notes]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    notes,
    setNotes,
    loading,
    error,
    setError,
    studySet,
    setStudySet,
    generate,
  };
}
