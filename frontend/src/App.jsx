import { useState, useEffect } from "react";
import Button from "./components/Button";
import "./App.css";

function App() {
  const [crop, setCrop] = useState("🥬 Cabbage");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(false);

  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [showAssistant, setShowAssistant] = useState(false);
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (!scanning) return;

    const timer = setTimeout(() => {
      setScanning(false);
      setResult(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [scanning]);

const speakAIResponse = (text) => {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const cleanText = text
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/\uFE0F/g, "")
    .trim();

  const speech = new SpeechSynthesisUtterance(cleanText);

  speech.lang = "en-IN";
  speech.rate = 0.9;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
};
  const stopAIResponse = () => {
    window.speechSynthesis.cancel();
  };
  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setRecognition(null);
      setListening(false);
    }
  };

  const handleAskAI = (input = question) => {
    const q = input.trim().toLowerCase();

    if (!q) return;

    let answer = "";

    if (
      q.includes("pest") ||
      q.includes("insect") ||
      q.includes("bug")
    ) {
      if (crop === "🥬 Cabbage") {
        answer =
          "🐞 Cabbage leaves may be affected by pests such as aphids. Check the underside of the leaves regularly.";
      } else if (crop === "🌾 Rice") {
        answer =
          "🐞 Rice crops can be affected by different pests. Check the leaves and stems for unusual spots or insects.";
      } else if (crop === "🍅 Tomato") {
        answer =
          "🐞 Tomato plants can have pest problems around the leaves and young shoots. Check these areas regularly.";
      } else {
        answer =
          "🐞 Cauliflower leaves can attract pests. Check the underside of the leaves for holes or unusual damage.";
      }
    } else if (
      q.includes("damage") ||
      q.includes("leaf") ||
      q.includes("leaves")
    ) {
      answer = `📊 Check the damaged leaves of ${crop} regularly. If the damage increases, scan the crop again.`;
    } else if (
      q.includes("healthy") ||
      q.includes("health")
    ) {
      answer = `🌱 Your selected crop is ${crop}. Keep monitoring it regularly and use the crop scan to check its condition.`;
    } else if (
      q.includes("water") ||
      q.includes("watering") ||
      q.includes("irrigation")
    ) {
      answer = `💧 Before watering ${crop}, check the soil moisture. Avoid overwatering the crop.`;
    } else if (
      q.includes("aphid") ||
      q.includes("aphids")
    ) {
      answer = `🐞 Aphids can affect ${crop}. Check the underside of leaves and young plant parts for aphid activity.`;
    } else {
      answer =
        `🤖 I can help you with ${crop}, pests, leaf damage, crop health and watering advice.`;
    }

    setAiResponse(answer);
    speakAIResponse(answer);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported. Please use Chrome or Edge.");
      return;
    }

    const newRecognition = new SpeechRecognition();
    setRecognition(newRecognition);

    newRecognition.lang = "en-IN";
    newRecognition.continuous = false;
    newRecognition.interimResults = false;

    newRecognition.onstart = () => {
      setListening(true);
    };

    newRecognition.onresult = (event) => {
      const text = event.results[0][0].transcript;

      setQuestion(text);
      setListening(false);

      handleAskAI(text);
    };

    newRecognition.onerror = () => {
      setListening(false);
    };

    newRecognition.onend = () => {
      setListening(false);
    };

    newRecognition.start();
  };

 const handleAIOption = (type) => {
  let answer = "";

  if (type === "pest") {
    setQuestion("Pest Problem");

    answer =
      "🐞 Pest activity may be present. Scan your crop leaf to check for possible pest infestation.";
  }

  if (type === "health") {
    setQuestion("Crop Health");

    answer =
      "🌱 You can check your crop health using the leaf scan. AgroView will show the health condition.";
  }

  if (type === "water") {
    setQuestion("Water Advice");

    answer =
      "💧 Check the soil moisture before watering. Avoid unnecessary watering and monitor the crop regularly.";
  }

  setAiResponse(answer);
  speakAIResponse(answer);
};

  const changeCrop = (newCrop) => {
    setCrop(newCrop);
    setScanning(false);
    setResult(false);
    setQuestion("");
    setAiResponse("");
  };

  return (
    <div className="app">

      <header className="app-header">
        <h1>🌱 AgroView</h1>

        <div className="header-icons">
          <span>🔔</span>
          <span>👤</span>
        </div>
      </header>

      <div className="intro-card">
        <h2>Smart Farming Assistant</h2>
        <p>AI Powered Crop Monitoring System</p>
      </div>

      <div className="selected-crop">
        <span>Selected Crop</span>
        <h3>{crop}</h3>
      </div>

      <Button
        text={scanning ? "🔄 Scanning..." : "📷 Scan Crop"}
        onClick={() => {
          setScanning(true);
          setResult(false);
        }}
      />

      <div className="ai-card">

        <div className="ai-icon">🎤</div>

        <div className="ai-content">
          <h3>Ask Agro AI</h3>
          <p>
            Ask questions about your crop and get farming guidance.
          </p>
        </div>

        <button
          className="ai-button"
          onClick={() => setShowAssistant(true)}
        >
          🎤 Ask Agro AI
        </button>

        {showAssistant && (
          <div className="ai-assistant">

            <h2>🤖 Agro AI Assistant</h2>

            <div className="ai-message">
              👋 Hello! I am Agro AI.
              <br />
              How can I help you with your crop?
            </div>

            <div className="ai-options">
              <button onClick={() => handleAIOption("pest")}>
                🐛 Pest Problem
              </button>

              <button onClick={() => handleAIOption("health")}>
                🌿 Crop Health
              </button>

              <button onClick={() => handleAIOption("water")}>
                💧 Water Advice
              </button>
            </div>

            <div className="ai-input-row">

              <button
                className={`ai-mic ${listening ? "listening" : ""}`}
                onClick={handleVoiceInput}
              >
                {listening ? "🔴" : "🎤"}
              </button>

              <input
                type="text"
                placeholder="Ask about your crop..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAskAI();
                  }
                }}
              />

              <button
                className="ai-send"
                onClick={() => handleAskAI()}
              >
                ➤
              </button>

            </div>

            {aiResponse && (
              <div className="ai-chat">

                <p>
                  <strong>👤 You:</strong>
                </p>

                <p>{question}</p>

                <p>
                  <strong>🤖 Agro AI:</strong>
                </p>

                <div className="ai-response-box">
                  <span>🤖</span>
                  <p>{aiResponse}</p>
                </div>

                <div className="ai-voice-controls">
                  <button onClick={() => speakAIResponse(aiResponse)}>
                    🔊 Speak
                  </button>

                  <button onClick={stopAIResponse}>
                    🔇 Stop
                  </button>
                 </div>

              </div>
            )}

            <button
              className="close-btn"
              onClick={() => {
                 stopAIResponse();
                 stopListening();
                 setShowAssistant(false);
                 setQuestion("");
                 setAiResponse("");
              }}
            >
              Close
            </button>

          </div>
        )}
      </div>

      {scanning && (
        <div className="scanning-card">

          <div className="scan-icon">📷</div>

          <h3>Scanning {crop}</h3>

          <p>
            Analyzing the crop for possible pest infestation...
          </p>

          <div className="scan-loader"></div>

        </div>
      )}

      {result && (
        <div className="result-card">

          <span className="result-label">
            🧪 Scan Result
          </span>

          <h3>🐞 Aphid Detected</h3>

          <div className="result-info">

            <p>
              <strong>Risk Level:</strong>{" "}
              <span className="risk-medium">
                Medium
              </span>
            </p>

            <div className="damage-section">

              <div className="damage-header">
                <strong>Crop Damage</strong>
                <span>12%</span>
              </div>

              <div className="damage-bar">
                <div className="damage-fill"></div>
              </div>

            </div>

          </div>

          <div className="recommendation">

            <div className="recommendation-title">
              💡 What to do
            </div>

            <p>
              Monitor the affected leaves regularly and take
              suitable crop-protection measures.
            </p>

          </div>

        </div>
      )}

      <div className="crop-buttons">

        <button
          className={crop === "🥬 Cabbage" ? "active-crop" : ""}
          onClick={() => changeCrop("🥬 Cabbage")}
        >
          🥬 Cabbage
        </button>

        <button
          className={crop === "🌾 Rice" ? "active-crop" : ""}
          onClick={() => changeCrop("🌾 Rice")}
        >
          🌾 Rice
        </button>

        <button
          className={crop === "🍅 Tomato" ? "active-crop" : ""}
          onClick={() => changeCrop("🍅 Tomato")}
        >
          🍅 Tomato
        </button>

        <button
          className={
            crop === "🥦 Cauliflower" ? "active-crop" : ""
          }
          onClick={() => changeCrop("🥦 Cauliflower")}
        >
          🥦 Cauliflower
        </button>

      </div>

    </div>
  );
}

export default App;