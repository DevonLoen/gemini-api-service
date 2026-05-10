
import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import upload from "./middleware/upload.js";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const GEMINI_MODEL = "gemini-2.5-flash";

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS - Allow requests from frontend
// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.post("/generate-text", async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
        });

        res.status(200).json({ result: response.text });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

app.post("/generate-text-from-image", upload.single("image"), async (req, res) => {
    const { prompt } = req.body;
    const filePath = req.file.path;
    try {
        const fileBuffer = fs.readFileSync(filePath);
        const base64Image = fileBuffer.toString("base64");
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                { type: "text", text: prompt ?? "Please draw conclusions from the following picture." },
                { inlineData: { data: base64Image, mimeType: req.file.mimetype } }
            ]
        });
        res.status(200).json({ result: response.text });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    } finally {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
});

app.post("/generate-text-from-document", upload.single("document"), async (req, res) => {
    const { prompt } = req.body;
    const filePath = req.file.path;
    try {
        const fileBuffer = fs.readFileSync(filePath);
        const base64Document = fileBuffer.toString("base64");
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                { type: "text", text: prompt ?? "Please draw conclusions from the following document." },
                { inlineData: { data: base64Document, mimeType: req.file.mimetype } }
            ]
        });
        res.status(200).json({ result: response.text });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    } finally {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
});

app.post("/generate-text-from-audio", upload.single("audio"), async (req, res) => {
    const { prompt } = req.body;
    const filePath = req.file.path;
    try {
        const fileBuffer = fs.readFileSync(filePath);
        const base64Audio = fileBuffer.toString("base64");
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                { type: "text", text: prompt ?? "Please create a transcript from the following audio." },
                { inlineData: { data: base64Audio, mimeType: req.file.mimetype } }
            ]
        });
        res.status(200).json({ result: response.text });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    } finally {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
});


app.post("/api/chat", async (req, res) => {
    const { conversation } = req.body;
    try {
        if (!Array.isArray(conversation) || conversation.length === 0) {
            return res.status(400).json({ error: "Conversation must be a non-empty array of messages." });
        }

        // Transform conversation to Gemini API format
        const contents = conversation.map(({ role, text }) => ({
            role: role === "user" ? "user" : "model",
            parts: [{ text }]
        }));

        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents,
            systemInstruction: "You are a helpful assistant that provides detailed and informative responses to user queries."
        });

        res.status(200).json({ result: response.text });
    } catch (error) {
        console.error("Chat error:", error);
        res.status(500).json({ error: error.message });
    }   
});
