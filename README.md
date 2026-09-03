# StudySpark — AI Study Assistant

**StudySpark** is a responsive React web application that converts free-form study notes or topics into structured interactive flashcards and multiple-choice quizzes using AI.

Designed with a heavy focus on reliability, error handling, defensive LLM parsing, responsive UX, and accessible UI interaction.

---

## 🎥 Screen Recording / Demo

[Watch Screen Recording / Demo Video](link_to_screen_recording_here)

---

## Features

- **Free-form Note Input**: Multi-line notes with real-time character counter and sample prompt chips.
- **Structured AI Generation**: Powered by **Gemini 2.5 Flash** with Zod runtime schema validation.
- **Defensive LLM Parsing**: Robust extraction pipeline that handles markdown code blocks, raw strings, and malformed JSON.
- **Interactive Flashcards**: 3D flip animation cards with active recall testing and keyboard navigation (`Space` to flip, `←` / `→` arrows to navigate).
- **Quiz Mode with Instant Feedback**: 4-option multiple-choice quiz with immediate correctness feedback, explanations, and score tracking.
- **Retest Incorrect Questions**: Local frontend retest algorithm that filters and shuffles missed questions without invoking additional API calls.
- **Stale Response Protection**: Built-in `AbortController` support that cancels outdated API requests if a user generates rapidly.
- **Session Persistence**: Saves study sessions to `localStorage` with prompt to resume on page reload.
- **Responsive & Accessible**: Glassmorphism dark mode design tuned for mobile (320px+) through desktop.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS | UI & Component State |
| **Backend** | Node.js, Express, TypeScript | Single API endpoint proxy |
| **AI Engine** | Gemini 2.5 Flash (`@google/generative-ai`) | Structured generation |
| **Validation** | Zod | Runtime schema validation |
| **Storage** | `localStorage` | Session persistence |

---

## 📦 Setup & Installation Instructions

### Prerequisites
- Node.js 18+ and npm installed
- A Gemini API Key (obtain from [Google AI Studio](https://aistudio.google.com/))

### 1. Clone & Install Dependencies

```bash
# Navigate to project root
cd StudySpark

# Install dependencies (automatically installs server & client packages via postinstall)
npm install
```

### 2. Configure Environment Variables

Create a `.env` file inside the `server/` directory:

```bash
# inside server/.env
PORT=8000
GEMINI_API_KEY=gemini_api_key
```

### 3. Run Development Server

From the root directory:

```bash
npm start
```

This starts:
- Express Backend on `http://localhost:8000`
- Vite React Frontend on `http://localhost:3000`
