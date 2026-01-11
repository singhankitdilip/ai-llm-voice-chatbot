import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const upload = multer();
app.use(cors({
  origin: "http://localhost:5173", // your frontend
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

// DEV-only memory (resets on restart)
let conversation = [];

app.post("/api/chat", upload.single("audio"), async (req, res) => {
  try {
    /* 1️⃣ Validate audio */
    if (!req.file) {
      return res.status(400).json({ error: "No audio" });
    }

    /* 2️⃣ Whisper (STT) */
    const whisperForm = new FormData();
    whisperForm.append("audio", new Blob([req.file.buffer]));

    const whisperRes = await fetch("http://127.0.0.1:4000/stt", {
      method: "POST",
      body: whisperForm,
    });

    const whisperData = await whisperRes.json();
    const userText = whisperData.text?.trim();

    if (!userText) {
      return res.status(400).json({ error: "Empty transcription" });
    }

    /* 3️⃣ Save user message */
    conversation.push({ role: "user", content: userText });
    if (conversation.length > 10) {
      conversation = conversation.slice(-10);
    }

    /* 4️⃣ LLaMA (Ollama) */
    const ollamaRes = await fetch("http://127.0.0.1:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2:3b",
        messages: [
          {
            role: "system",
            content:
              "You are a concise AI voice assistant. Do not greet repeatedly. Reply in 1–2 short sentences.",
          },
          ...conversation,
        ],
        stream: false,
      }),
    });

    const ollamaData = await ollamaRes.json();
    const aiText = ollamaData.message.content.trim();

    conversation.push({ role: "assistant", content: aiText });

    /* 5️⃣ Piper (TTS) */
    const piperRes = await fetch("http://127.0.0.1:5000/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: aiText.slice(0, 300),
      }),
    });

    const audioBuffer = Buffer.from(await piperRes.arrayBuffer());

    /* 6️⃣ Return audio */
    res.setHeader("Content-Type", "audio/wav");
    res.send(audioBuffer);

  } catch (err) {
    console.error("Voice Server Error:", err);
    res.status(500).json({ error: "Voice server failed" });
  }
});

app.listen(7000, () => {
  console.log("🎙 Voice server running on http://127.0.0.1:7000");
});
