import express from "express";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());

const PIPER_EXE = path.join(process.cwd(), "piper", "piper.exe");
const VOICE_MODEL = path.join(
  process.cwd(),
  "piper",
  "voices",
  "test_voice.onnx"
);
const OUTPUT_FILE = path.join(process.cwd(), "output.wav");

app.post("/tts", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).send("Text required");

  const safeText = text.replace(/"/g, '\\"');

  const command = `echo "${safeText}" | "${PIPER_EXE}" --model "${VOICE_MODEL}" --output_file "${OUTPUT_FILE}"`;

  exec(command, (err) => {
    if (err) {
      console.error("Piper error:", err);
      return res.status(500).send("Piper failed");
    }

    res.setHeader("Content-Type", "audio/wav");
    res.send(fs.readFileSync(OUTPUT_FILE));
  });
});

app.listen(5000, () => {
  console.log("🗣 Piper server running on http://127.0.0.1:5000");
});
