import { z } from 'zod';

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

export type StudySetInput = z.infer<typeof StudySetSchema>;
