import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateStudySetRaw(notes: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // Using Gemini 2.5 Flash model as per spec
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
    },
  });

  const prompt = `You are an educational assistant.
Convert the user's notes into study material.
Return ONLY valid JSON matching the exact schema specified below.

Schema:
{
 "title": "A short, descriptive title based on the notes",
 "flashcards": [
   {
     "id": "fc-1",
     "question": "Clear question",
     "answer": "Comprehensive answer"
   }
 ],
 "quiz": [
   {
     "id": "q-1",
     "question": "Question text",
     "options": ["Option A", "Option B", "Option C", "Option D"],
     "correctIndex": 0,
     "explanation": "Why this option is correct"
   }
 ]
}

Rules:
- No markdown
- No code fences
- No extra text
- Exactly 6 flashcards
- Exactly 6 quiz questions
- Exactly 4 options for each quiz question
- correctIndex must be an integer between 0 and 3
- Every ID must be unique

User's study notes:
${notes}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
