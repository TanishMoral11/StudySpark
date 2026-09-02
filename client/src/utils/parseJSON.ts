/**
 * Extracts and parses JSON from raw LLM output strings.
 * Handles clean JSON, markdown code blocks, and prefixed text.
 */
export function extractJSON<T = unknown>(raw: string): T {
  if (!raw || typeof raw !== 'string') {
    throw new Error('Invalid input: Expected non-empty string');
  }

  const trimmed = raw.trim();

  // Try direct JSON parse first
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    // Continue to fallback parsing strategies
  }

  // Strategy 1: Strip markdown code blocks (```json ... ``` or ``` ...)
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      return JSON.parse(codeBlockMatch[1].trim()) as T;
    } catch {
      // Continue to fallback
    }
  }

  // Strategy 2: Extract substring from first '{' to last '}'
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const jsonCandidate = trimmed.substring(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(jsonCandidate) as T;
    } catch {
      // Failed to parse extracted substring
    }
  }

  throw new Error('Failed to extract valid JSON from response');
}
