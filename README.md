# 🚀 Gemini Flash API

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![Express.js](https://img.shields.io/badge/Express.js-5.x-lightgrey)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow)

A modern, production-ready RESTful API built with **Node.js** and **Express.js**, powered by **Google Gemini 2.5 Flash**.  
Supports multimodal AI endpoints for text, image, document, and audio processing.

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Environment Variables](#️-environment-variables)
- [📡 API Reference](#-api-reference)
- [📁 Project Structure](#-project-structure)
- [🔒 Production Readiness](#-production-readiness)
- [📄 License](#-license)

---

## ✨ Features

- Multimodal AI: text, image, document, and audio support
- RESTful API architecture
- File upload handling with `multer` (disk storage)
- Automatic file cleanup after processing
- Modern ESM (`import/export`) support
- Simple deployment and scalability
- JSON-based API responses

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

Server runs at:  
`http://localhost:3000`

---

## ⚙️ Environment Variables

| Variable         | Required | Description                   |
| ---------------- | -------- | ----------------------------- |
| `GEMINI_API_KEY` | Yes      | Google Gemini API key         |
| `PORT`           | No       | Server port (default: `3000`) |

---

## 📡 API Reference

### Base URL

```
http://localhost:3000
```

---

### 1. Generate Text

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

### 2. Generate Text from Image

**POST** `/generate-text-from-image`  
Content-Type: `multipart/form-data`

| Key      | Type   | Required | Description                                  |
| -------- | ------ | -------- | -------------------------------------------- |
| `image`  | File   | Yes      | Image file (`.jpg`, `.png`, etc.)            |
| `prompt` | String | No       | Custom instructions for the AI               |

_Default prompt: "Please draw conclusions from the following picture."_

---

### 3. Generate Text from Document

**POST** `/generate-text-from-document`  
Content-Type: `multipart/form-data`

| Key        | Type   | Required | Description                             |
| ---------- | ------ | -------- | --------------------------------------- |
| `document` | File   | Yes      | Document file (`.pdf`, etc.)            |
| `prompt`   | String | No       | Custom instructions for the AI          |

_Default prompt: "Please draw conclusions from the following document."_

---

### 4. Generate Text from Audio

**POST** `/generate-text-from-audio`  
Content-Type: `multipart/form-data`

| Key      | Type   | Required | Description                                  |
| -------- | ------ | -------- | -------------------------------------------- |
| `audio`  | File   | Yes      | Audio file (`.mp3`, `.wav`, etc.)            |
| `prompt` | String | No       | Custom instructions for the AI               |

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
project-root/
│
├── uploads/                # Temporary uploaded files (auto-created)
├── .env
├── .env.sample
├── package.json
├── index.js
├── middleware/
│   └── upload.js           # Multer configuration
└── README.md
```

---

## 🔒 Production Readiness

- Add request rate limiting
- Configure CORS properly
- Use PM2 or Docker for deployment
- Add request validation middleware
- Implement centralized logging
- Add authentication if exposed publicly
- Enable HTTPS behind Nginx or reverse proxy

Example PM2 startup:

```bash
pm2 start index.js --name gemini-flash-api
```

---

## 📄 License

Licensed under the MIT License.

---

# 🚀 Quick Start

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <your-project-name>
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Copy `.env.sample` into `.env`:

```bash
cp .env.sample .env
```

Then fill in your environment variables:

```env
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
```

---

## 4. Start the Server

```bash
npm run start
```

Server will run at:

```text
http://localhost:3000
```

---

# ⚙️ Environment Variables

| Variable         | Required | Description                   |
| ---------------- | -------- | ----------------------------- |
| `GEMINI_API_KEY` | Yes      | Google Gemini API key         |
| `PORT`           | No       | Server port (default: `3000`) |

---

# 📡 API Reference

## Base URL

```text
http://localhost:3000
```

---

## 1. Generate Text

Generate text responses from a standard prompt.

### Endpoint

```http
POST /generate-text
```

### Content-Type

```text
application/json
```

### Request Body

```json
{
  "prompt": "Explain the theory of relativity in one sentence."
}
```

### Example Response

```json
{
  "result": "The theory of relativity explains how space, time, and gravity interact depending on motion and mass."
}
```

---

## 2. Generate Text from Image

Analyze an uploaded image and generate AI responses from visual content.

### Endpoint

```http
POST /generate-text-from-image
```

### Content-Type

```text
multipart/form-data
```

### Form Data

| Key      | Type   | Required | Description                                  |
| -------- | ------ | -------- | -------------------------------------------- |
| `image`  | File   | Yes      | Image file to analyze (`.jpg`, `.png`, etc.) |
| `prompt` | String | No       | Custom instructions for the AI               |

### Default Prompt

```text
Please draw conclusions from the following picture.
```

---

## 3. Generate Text from Document

Analyze uploaded documents for summarization, extraction, or question answering.

### Endpoint

```http
POST /generate-text-from-document
```

### Content-Type

```text
multipart/form-data
```

### Form Data

| Key        | Type   | Required | Description                             |
| ---------- | ------ | -------- | --------------------------------------- |
| `document` | File   | Yes      | Document file to analyze (`.pdf`, etc.) |
| `prompt`   | String | No       | Custom instructions for the AI          |

### Default Prompt

```text
Please draw conclusions from the following document.
```

---

## 4. Generate Text from Audio

Transcribe or analyze uploaded audio files.

### Endpoint

```http
POST /generate-text-from-audio
```

### Content-Type

```text
multipart/form-data
```

### Form Data

| Key      | Type   | Required | Description                                  |
| -------- | ------ | -------- | -------------------------------------------- |
| `audio`  | File   | Yes      | Audio file to analyze (`.mp3`, `.wav`, etc.) |
| `prompt` | String | No       | Custom instructions for the AI               |

### Default Prompt

```text
Please create a transcript from the following audio.
```

---

# ✅ Standard Response Format

Successful requests return:

```json
{
  "result": "Generated response from the Gemini model."
}
```

---

# ❌ Error Response Format

Errors return either `400 Bad Request` or `500 Internal Server Error`.

Example:

```json
{
  "error": "Error message details"
}
```

---

# 📁 Project Structure

```text
project-root/
│
├── uploads/
├── .env
├── .env.sample
├── package.json
├── server.js
└── README.md
```

---

# 🔒 Production Readiness

Recommended production improvements:

* Add request rate limiting
* Configure CORS properly
* Use PM2 or Docker for deployment
* Add request validation middleware
* Implement centralized logging
* Add authentication if exposed publicly
* Enable HTTPS behind Nginx or reverse proxy

Example PM2 startup:

```bash
pm2 start server.js --name gemini-api
```

---

# 📄 License

Licensed under the MIT License.
