from faster_whisper import WhisperModel
from flask import Flask, request, jsonify

app = Flask(__name__)

# FORCE CPU MODE (IMPORTANT)
model = WhisperModel(
    "base",
    device="cpu",
    compute_type="int8"  # fast + low memory
)

@app.route("/stt", methods=["POST"])
def stt():
    audio = request.files["audio"]

    segments, info = model.transcribe(audio)
    text = "".join([segment.text for segment in segments])

    return jsonify({ "text": text })

app.run(port=4000)
