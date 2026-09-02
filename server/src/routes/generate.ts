import { Router, Request, Response } from 'express';
import { generateStudySetRaw } from '../services/gemini';
import { GenerateResponseSchema } from '../schema/studySchema';

export const generateRouter = Router();

function parseJSONFromLLM(raw: string): unknown {
  const trimmed = raw.trim();

  // Try direct parse
  try {
    return JSON.parse(trimmed);
  } catch {
    // Continue
  }

  // Strip code fences
  const codeFenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeFenceMatch && codeFenceMatch[1]) {
    try {
      return JSON.parse(codeFenceMatch[1].trim());
    } catch {
      // Continue
    }
  }

  // Extract brace range
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start !== -1 && end > start) {
    try {
      return JSON.parse(trimmed.substring(start, end + 1));
    } catch {
      // Continue
    }
  }

  throw new Error('Malformed JSON received from LLM');
}

generateRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { notes } = req.body;

    if (!notes || typeof notes !== 'string' || notes.trim() === '') {
      res.status(400).json({
        status: 'invalid_input',
        message: 'Please enter study notes or an academic topic.',
      });
      return;
    }

    // Step 1: Call Gemini API
    let rawResult: string;
    try {
      rawResult = await generateStudySetRaw(notes.trim());
    } catch (err: unknown) {
      console.error('Gemini API Error:', err);
      res.status(500).json({
        error: "Couldn't generate study material. Check your connection or API key.",
      });
      return;
    }

    // Step 2: Extract & Parse JSON
    let jsonObject: unknown;
    try {
      jsonObject = parseJSONFromLLM(rawResult);
    } catch (err: unknown) {
      console.error('JSON Extraction Error:', err);
      res.status(500).json({ error: 'AI returned malformed JSON. Please retry.' });
      return;
    }

    // Step 3: Validate against Zod Schema (Handles both StudySet & InvalidInput)
    const validationResult = GenerateResponseSchema.safeParse(jsonObject);
    if (!validationResult.success) {
      console.error('Zod Validation Error:', validationResult.error.format());
      res.status(500).json({ error: 'AI returned invalid data structure. Please retry.' });
      return;
    }

    // Step 4: Return validated data
    res.status(200).json(validationResult.data);
  } catch (error: unknown) {
    console.error('Unexpected route error:', error);
    res.status(500).json({ error: 'Generation failed due to an internal server error.' });
  }
});
