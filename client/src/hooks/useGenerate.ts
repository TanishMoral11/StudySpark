import { useState, useRef, useEffect, useCallback } from 'react';
import type { StudySet } from '../types/study';
import { extractJSON } from '../utils/parseJSON';
import { validateResponseData } from '../utils/validateSchema';
import { saveSession } from '../utils/storage';

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
      return;
    }

    // Cancel any ongoing request (Stale request protection)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    const currentRequestId = ++requestIdRef.current;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: trimmedNotes }),
        signal: controller.signal,
      });

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

      const rawText = await response.text();
      
      let parsedData: unknown;
      try {
        parsedData = extractJSON(rawText);
      } catch {
        throw new Error('AI returned invalid formatted JSON. Please retry.');
      }

      const validatedResult = validateResponseData(parsedData);

      // Handle Invalid Input Response from LLM
      if ('status' in validatedResult && validatedResult.status === 'invalid_input') {
        if (currentRequestId === requestIdRef.current) {
          setError(validatedResult.message);
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
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          return; // Intentionally aborted, do nothing
        }
        if (currentRequestId === requestIdRef.current) {
          setError(err.message || 'Couldn\'t generate study material. Check your connection.');
        }
      } else if (currentRequestId === requestIdRef.current) {
        setError('An unexpected error occurred. Please try again.');
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
