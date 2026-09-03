/**
 * Utility function to extract and parse JSON from raw LLM output strings.
 * Handles clean JSON, markdown code fences (```json ... ```), and extracted brace ranges.
 */
export function parseJSONFromLLM(raw: string): unknown {
  const trimmed = raw.trim();

  // Strategy 1: Direct JSON parse
  try {
    return JSON.parse(trimmed);
  } catch {
    // Continue to next strategy
  }

  // Strategy 2: Strip markdown code fences (```json ... ``` or ``` ...)
  const codeFenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeFenceMatch && codeFenceMatch[1]) {
    try {
      return JSON.parse(codeFenceMatch[1].trim());
    } catch {
      // Continue to next strategy
    }
  }

  // Strategy 3: Extract substring from first '{' to last '}'
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
