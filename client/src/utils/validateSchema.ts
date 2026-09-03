import { z } from 'zod';
import type { StudySet, GenerateAPIResponse } from '../types/study';

export const FlashcardSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const QuizQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  options: z.array(z.string().min(1)).length(4),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string().min(1),
});

export const StudySetSchema = z.object({
  title: z.string().min(1),
  flashcards: z.array(FlashcardSchema).min(5).max(10),
  quiz: z.array(QuizQuestionSchema).min(5).max(10),
});

export const InvalidInputSchema = z.object({
  status: z.literal('invalid_input'),
  message: z.string().min(1),
});

export const GenerateResponseSchema = z.union([
  StudySetSchema,
  InvalidInputSchema,
]);

/**
 * Validates that an arbitrary object conforms to GenerateAPIResponse using Zod.
 */
export function validateResponseData(data: unknown): GenerateAPIResponse {
  const result = GenerateResponseSchema.safeParse(data);
  if (!result.success) {
    console.error('Zod Client Validation Error:', result.error.format());
    throw new Error('AI returned invalid data format');
  }
  return result.data as GenerateAPIResponse;
}

/**
 * Validates that an arbitrary object conforms to StudySet using Zod.
 */
export function validateStudySet(data: unknown): StudySet {
  const result = StudySetSchema.safeParse(data);
  if (!result.success) {
    throw new Error('Saved session has invalid study set format');
  }
  return result.data as StudySet;
}
