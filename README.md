# ✦ Gemini AI Studio

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![Express.js](https://img.shields.io/badge/Express.js-5.x-lightgrey)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow)

A full-stack AI application built with **Node.js** and **Express.js**, powered by **Google Gemini 2.5 Flash**.
Includes a built-in browser UI with four tabs — Chat, Image Analysis, Document Analysis, and Audio Transcription — backed by a production-ready multimodal REST API.

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Environment Variables](#️-environment-variables)
- [🖥️ Frontend UI](#️-frontend-ui)
- [📡 API Reference](#-api-reference)
- [📁 Project Structure](#-project-structure)
- [🔒 Production Readiness](#-production-readiness)
- [📄 License](#-license)

---

## ✨ Features

- **Multi-tab browser UI** — Chat, Image, Document, and Audio tabs in a single page
- **Conversational AI chat** with full message history sent to Gemini   on every turn
- **Markdown rendering** of AI responses (via `marked.js`)
- **Drag-and-drop file upload** with image preview
- **Export conversation** to a `.txt` file
- **Copy-to-clipboard** on every message
- **Animated typing indicator** while waiting for responses
- Multimodal REST API: text, image, document, and audio endpoints
- File upload handling with `multer` (disk storage, auto-cleanup after processing)
- Modern ESM (`import/export`) support
- CORS enabled, JSON-based API responses

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd gemini-flash-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.sample` to `.env` and fill in your credentials:

```bash
cp .env.sample .env
```

```env
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
```

### 4. Start the Server

```bash
npm run start
```

Open your browser at **`http://localhost:3000`** to use the UI.

---

## ⚙️ Environment Variables

| Variable         | Required | Description                   |
| ---------------- | -------- | ----------------------------- |
| `GEMINI_API_KEY` | Yes      | Google Gemini API key         |
| `PORT`           | No       | Server port (default: `3000`) |

---

## 🖥️ Frontend UI

The app serves a built-in UI from the `public/` folder at `http://localhost:3000`.

| Tab           | Description                                                                    |
| ------------- | ------------------------------------------------------------------------------ |
| 💬 Chat       | Multi-turn conversation with Gemini. Supports markdown, copy, and export.      |
| 🖼️ Image     | Upload an image (JPG/PNG/WEBP/GIF) with an optional prompt for AI analysis.    |
| 📄 Document   | Upload a document (PDF/DOC/DOCX/TXT) with an optional prompt for AI analysis.  |
| 🎵 Audio      | Upload an audio file (MP3/WAV/M4A/OGG) for AI transcription or analysis.       |

**UI features:**
- Drag-and-drop or click-to-browse file selection
- Image preview before submission
- Animated typing indicator (bouncing dots) while waiting
- Markdown-rendered responses with syntax-highlighted code blocks
- One-click copy on any message
- Export full chat history as a `.txt` file
- Fully responsive — works on mobile

---

## 📡 API Reference

### Base URL

```
http://localhost:3000
```

---

### 1. Conversational Chat

**POST** `/api/chat`
Content-Type: `application/json`

Sends the full conversation history to Gemini and returns the next AI response. Used by the Chat tab.

**Body:**
```json
{
  "conversation": [
    { "role": "user",  "text": "Hello!" },
    { "role": "model", "text": "Hi! How can I help you today?" },
    { "role": "user",  "text": "Explain black holes in simple terms." }
  ]
}
```

**Response:**
```json
{ "result": "A black hole is a region of space where gravity is so strong that nothing — not even light — can escape it..." }
```

---

### 2. Generate Text

**POST** `/generate-text`
Content-Type: `application/json`

**Body:**
```json
{ "prompt": "Explain the theory of relativity in one sentence." }
```

**Response:**
```json
{ "result": "The theory of relativity explains how space, time, and gravity interact depending on motion and mass." }
```

---

### 3. Generate Text from Image

**POST** `/generate-text-from-image`
Content-Type: `multipart/form-data`

| Key      | Type   | Required | Description                       |
| -------- | ------ | -------- | --------------------------------- |
| `image`  | File   | Yes      | Image file (`.jpg`, `.png`, etc.) |
| `prompt` | String | No       | Custom instructions for the AI    |

_Default prompt: "Please draw conclusions from the following picture."_

---

### 4. Generate Text from Document

**POST** `/generate-text-from-document`
Content-Type: `multipart/form-data`

| Key        | Type   | Required | Description                    |
| ---------- | ------ | -------- | ------------------------------ |
| `document` | File   | Yes      | Document file (`.pdf`, etc.)   |
| `prompt`   | String | No       | Custom instructions for the AI |

_Default prompt: "Please draw conclusions from the following document."_

---

### 5. Generate Text from Audio

**POST** `/generate-text-from-audio`
Content-Type: `multipart/form-data`

| Key      | Type   | Required | Description                       |
| -------- | ------ | -------- | --------------------------------- |
| `audio`  | File   | Yes      | Audio file (`.mp3`, `.wav`, etc.) |
| `prompt` | String | No       | Custom instructions for the AI    |

_Default prompt: "Please create a transcript from the following audio."_

---

### ✅ Standard Response

```json
{ "result": "Generated response from the Gemini model." }
```

### ❌ Error Response

```json
{ "error": "Error message details" }
```

---

## 📁 Project Structure

```
gemini-flash-api/
│
├── public/                 # Static frontend (served at /)
│   ├── index.html          # Multi-tab UI (Chat, Image, Document, Audio)
│   ├── script.js           # Frontend logic (tabs, uploads, markdown, export)
│   └── style.css           # UI styles
│
├── middleware/
│   └── upload.js           # Multer disk-storage configuration
│
├── uploads/                # Temporary uploaded files (auto-created & cleaned up)
├── index.js                # Express server & all API routes
├── .env                    # Environment variables (not committed)
├── .env.sample             # Environment variable template
├── package.json
└── README.md
```

---

## 🔒 Production Readiness

- Add request rate limiting (e.g., `express-rate-limit`)
- Configure CORS to allowlist specific origins
- Use PM2 or Docker for deployment
- Add request validation middleware
- Implement centralized logging (e.g., `winston`)
- Add authentication if exposed publicly
- Enable HTTPS behind Nginx or a reverse proxy

Example PM2 startup:

```bash
pm2 start index.js --name gemini-ai-studio
```

---

## 📄 License

Licensed under the MIT License.
