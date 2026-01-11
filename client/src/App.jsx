// "use client";
// import { useState } from "react";

// export default function VoiceChatbot() {
//   const [listening, setListening] = useState(false);

//   const startChat = async () => {
//     setListening(true);

//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const recorder = new MediaRecorder(stream);
//     const chunks = [];

//     recorder.ondataavailable = e => chunks.push(e.data);
//     recorder.start();

//     setTimeout(() => recorder.stop(), 4000);

//     recorder.onstop = async () => {
//       const blob = new Blob(chunks, { type: "audio/wav" });
//       const formData = new FormData();
//       formData.append("audio", blob);

//       const res = await fetch("/api/chat", {
//         method: "POST",
//         body: formData,
//       });

//       const audioBlob = await res.blob();
//       const audioUrl = URL.createObjectURL(audioBlob);
//       new Audio(audioUrl).play();

//       setListening(false);
//     };
//   };

//   return (
//     <div style={{ padding: 40 }}>
//       <button onClick={startChat}>
//         {listening ? "🎙 Listening..." : "🎤 Talk to AI"}
//       </button>
//     </div>
//   );
// }

"use client";
import { useState } from "react";

export default function VoiceChatbot() {
  const [status, setStatus] = useState("idle"); 
  // idle | listening | thinking | speaking

  const startChat = async () => {
    setStatus("listening");

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks = [];

    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.start();

    setTimeout(() => recorder.stop(), 3000);

    recorder.onstop = async () => {
      setStatus("thinking");

      const blob = new Blob(chunks, { type: "audio/wav" });
      const formData = new FormData();
      formData.append("audio", blob);

      const res = await fetch("http://localhost:7000/api/chat", {
        method: "POST",
        body: formData,
      });

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      setStatus("speaking");
      const audio = new Audio(audioUrl);
      audio.play();

      audio.onended = () => {
        setStatus("idle");
      };
    };
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎧 Voice Assistant</h2>

      {/* 🔊 AI SPEAKING WAVE (LEFT) */}
      {status === "speaking" && (
        <div style={{ ...styles.waveWrap, alignSelf: "flex-start" }}>
          <Wave color="#444" />
          <span style={styles.label}>AI speaking</span>
        </div>
      )}

      {/* 🎤 USER SPEAKING WAVE (RIGHT) */}
      {status === "listening" && (
        <div style={{ ...styles.waveWrap, alignSelf: "flex-end" }}>
          <Wave color="#007bff" />
          <span style={styles.label}>You speaking</span>
        </div>
      )}

      {/* 🎤 BUTTON */}
      <button
        onClick={startChat}
        disabled={status !== "idle"}
        style={{
          ...styles.button,
          background: status === "idle" ? "#000" : "#999",
        }}
      >
        {status === "listening" && "🎙 Listening..."}
        {status === "thinking" && "🧠 Thinking..."}
        {status === "speaking" && "🔊 Speaking..."}
        {status === "idle" && "🎤 Talk to AI"}
      </button>

      <p style={styles.hint}>Speak clearly for 2–3 seconds</p>
    </div>
  );
}

/* 🔊 SOUND WAVE COMPONENT */
function Wave({ color }) {
  return (
    <div style={styles.wave}>
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          style={{
            ...styles.bar,
            background: color,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  container: {
    minHeight: "100vh",
    background: "#f4f4f4",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    fontFamily: "system-ui",
  },
  title: {
    fontSize: 22,
    fontWeight: 600,
  },
  waveWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  wave: {
    display: "flex",
    gap: 4,
    height: 30,
  },
  bar: {
    width: 4,
    height: "100%",
    borderRadius: 4,
    animation: "wave 1s infinite ease-in-out",
  },
  label: {
    fontSize: 12,
    color: "#555",
  },
  button: {
    padding: "14px 28px",
    fontSize: 16,
    borderRadius: 999,
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  hint: {
    fontSize: 12,
    color: "#666",
  },
};
