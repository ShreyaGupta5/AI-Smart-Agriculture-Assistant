# AI Smart Agriculture Assistant

An AI-powered smart farming web platform for crop disease detection, weather monitoring, fertilizer guidance, irrigation planning, and chatbot-based agricultural support.

## Tech Stack

- React, Vite, Framer Motion, Chart.js, Lucide icons
- Node.js and Express
- Mock AI/weather services that can be replaced with TensorFlow, OpenCV, OpenAI/Gemini, Weather API, MySQL, and Maps API integrations

## Run Locally

```bash
npm install
npm run dev
```

Frontend: http://localhost:5173

Backend API: http://localhost:8091/api/health

## Available API Endpoints

- `GET /api/health`
- `GET /api/weather?location=Your%20Farm%20Location`
- `POST /api/disease-detection`
- `POST /api/fertilizer`
- `POST /api/irrigation`
- `POST /api/chat`

## Notes

The current implementation uses deterministic mock AI responses so the full project runs without API keys or model files. Replace the service logic in `server/index.js` with real model/API calls when production credentials and trained models are available.
