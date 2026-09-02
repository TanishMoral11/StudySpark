import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateStudySetRaw(notes: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
    },
  });

  const prompt = `You are an educational assistant.
Analyze the user's input. The input can be full study notes or a short study topic (e.g., "DBMS", "Binary Tree", "Operating Systems", "Photosynthesis").

RULES FOR EVALUATING INPUT:
1. IF the input is a valid academic topic, educational subject, lecture notes, or study concept (even if it is short, e.g. "DBMS", "Binary Tree", "Electricity"):
   Return ONLY valid JSON matching this schema:
   {
     "title": "A short, descriptive title based on the topic/notes",
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
   - Generate EXACTLY 10 flashcards
   - Generate EXACTLY 10 quiz questions
   - Exactly 4 options per question
   - correctIndex must be 0, 1, 2, or 3
   - Every ID must be unique

2. IF the input is casual conversation, greetings, meaningless text, gibberish, or completely non-academic content (examples: "hi", "hello", "how are you", "asdf", "asdfgh", "test", "1234"):
   Return EXACTLY this JSON shape:
   {
     "status": "invalid_input",
     "message": "Please enter study notes or an academic topic."
   }

3. NO MARKDOWN, NO CODE FENCES, NO EXTRA TEXT. RETURN ONLY THE JSON OBJECT.

User Input:
${notes}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
