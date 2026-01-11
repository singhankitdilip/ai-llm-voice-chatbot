🎙️ AI Voice Chatbot (Offline, Free)

A fully local AI Voice Assistant built with Whisper + LLaMA + Piper, running 100% offline.

This project allows you to talk to AI using your microphone and hear spoken responses, with no cloud APIs and no usage limits.

🧠 Tech Stack
Frontend

⚛️ React (Vite)

🎤 Web Audio API (MediaRecorder)

🌊 Animated speaking/listening UI

📍 Runs on http://localhost:5173

Backend (Voice Pipeline)

🗣 Whisper (faster-whisper) → Speech to Text

🧠 LLaMA 3.2 3B (Ollama) → AI Brain

🔊 Piper TTS → Text to Speech

🚀 Express.js → Orchestration API

📍 Runs on http://localhost:7000

🏗 Architecture
Frontend (5173)
   ↓
Express Voice Server (7000)
   ↓
Whisper STT (4000)
   ↓
Ollama LLaMA (11434)
   ↓
Piper TTS (5000)

📁 Project Structure
ai-voice-chatbot/
├─ frontend/                 # Vite + React (5173)
├─ server/                   # Express Voice Server (7000)
│  └─ index.js
├─ whisper/                  # Whisper STT (4000)
│  ├─ whisper_server.py
│  └─ requirements.txt
├─ piper-server/             # Piper TTS (5000)
│  ├─ piper-server.js
│  └─ piper/
│     ├─ piper.exe
│     ├─ onnxruntime.dll
│     ├─ espeak-ng-data/
│     └─ voices/
│        ├─ test_voice.onnx
│        └─ test_voice.onnx.json
└─ README.md

✅ Requirements
System

Windows 10/11

Node.js 18+

Python 3.10–3.11

FFmpeg (added to PATH)

Node
npm install -g nodemon

🧩 1️⃣ Whisper Setup (Speech → Text)
Install dependencies
cd whisper
pip install -r requirements.txt

requirements.txt
faster-whisper==1.0.3
numpy>=1.24
flask>=2.3

Run Whisper server
python whisper_server.py


Whisper runs on:

http://127.0.0.1:4000

🧩 2️⃣ Ollama + LLaMA Setup
Install Ollama

👉 https://ollama.com

Pull LLaMA model
ollama pull llama3.2:3b

Ollama API runs on
http://127.0.0.1:11434

🧩 3️⃣ Piper Setup (Text → Speech)
Folder requirements

Only these files are needed:

piper/
├─ piper.exe
├─ onnxruntime.dll
├─ espeak-ng-data/
└─ voices/
   ├─ test_voice.onnx
   └─ test_voice.onnx.json

Run Piper server
cd piper-server
node piper-server.js


Piper runs on:

http://127.0.0.1:5000

Test Piper
curl -X POST http://127.0.0.1:5000/tts ^
  -H "Content-Type: application/json" ^
  -d "{\"text\":\"Piper is working\"}" ^
  --output test.wav

🧩 4️⃣ Voice Server (Express)
Install dependencies
cd server
npm install

Start server
node index.js


Server runs on:

http://localhost:7000/chat


CORS is enabled for http://localhost:5173

🧩 5️⃣ Frontend (Vite + React)
Install dependencies
cd frontend
npm install

Start frontend
npm run dev


Frontend runs on:

http://localhost:5173

🎯 How It Works

User clicks 🎤 Talk to AI

Audio recorded from mic

Audio sent to Express server

Whisper converts speech → text

LLaMA generates response

Piper converts response → voice

Audio streamed back to browser

AI speaks 🎧

⚠️ Common Issues
❌ CORS Error

✔ Fixed by enabling cors() in Express

❌ Piper not responding

✔ Make sure piper-server.js is running
✔ Port 5000 must be free

❌ Whisper errors

✔ FFmpeg must be installed
✔ Use Python 3.10–3.11

🚀 Features

✅ Fully offline

✅ No API keys

✅ Unlimited usage

✅ Real-time voice interaction

✅ Animated speaking/listening UI

✅ Short-term memory (conversation)

🔮 Future Improvements

Live transcription

Streaming audio (AI speaks while thinking)

Per-user sessions

Wake word detection

Desktop app (Electron / Tauri)

🏁 Final Notes

This project is built for learning, experimentation, and local AI apps.
You now own the entire AI voice stack — no limits, no lock-in.

🔥 Enjoy building.
