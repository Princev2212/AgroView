import { useState, useEffect } from "react";
import Button from "./components/Button";
import "./App.css";

function App() {
  const [crop, setCrop] = useState("🥬 Cabbage");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(false);

  const [aiOpen, setAiOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [showAssistant, setShowAssistant] = useState(false);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (scanning) {
      const timer = setTimeout(() => {
        setScanning(false);
        setResult(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [scanning]);

  /* =========================
     MAIN AI QUESTION HANDLER
     ========================= */

  const handleAskAI = (inputQuestion = question) => {
  const userQuestion = inputQuestion.trim().toLowerCase();

  if (userQuestion === "") {
    return;
  }

  let response = "";

  if (
    userQuestion.includes("pest") ||
    userQuestion.includes("insect") ||
    userQuestion.includes("bug")
  ) {
    if (crop === "🥬 Cabbage") {
      response =
        "🐞 Cabbage leaves may be affected by pests such as aphids. Check the underside of the leaves regularly and monitor the affected areas.";
    } else if (crop === "🌾 Rice") {
      response =
        "🐞 Rice crops can be affected by different pests. Monitor the leaves and stems regularly for unusual spots or insect activity.";
    } else if (crop === "🍅 Tomato") {
      response =
        "🐞 Tomato plants can experience pest activity around leaves and young shoots. Check these areas regularly.";
    } else {
      response =
        "🐞 Cauliflower leaves can attract pests. Check the underside of leaves and monitor for holes or unusual damage.";
    }
  } else if (
    userQuestion.includes("damage") ||
    userQuestion.includes("leaf") ||
    userQuestion.includes("leaves")
  ) {
    response =
      `📊 For ${crop}, monitor damaged leaves regularly. If the damaged area keeps increasing, perform another crop scan.`;
  } else if (
    userQuestion.includes("healthy") ||
    userQuestion.includes("health")
  ) {
    response =
      `🌱 Your selected crop is ${crop}. Continue regular monitoring and use the crop scan to check its health condition.`;
  } else if (
    userQuestion.includes("water") ||
    userQuestion.includes("watering") ||
    userQuestion.includes("irrigation")
  ) {
    response =
      `💧 For ${crop}, check the soil moisture before watering. Avoid unnecessary watering and maintain regular monitoring.`;
  } else if (
    userQuestion.includes("aphid") ||
    userQuestion.includes("aphids")
  ) {
    response =
      `🐞 Aphids can affect ${crop}. Check the underside of leaves and young plant parts regularly for signs of pest activity.`;
  } else {
    response =
      `🤖 I can help you with ${crop} crop health, pests, leaf damage, and watering advice.`;
  }

  setAiResponse(response);
  speakAIResponse(response);
};
const handleVoiceInput = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice input is not supported. Please use Chrome or Edge.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-IN";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    setListening(true);
  };

  recognition.onresult = (event) => {
  const voiceText = event.results[0][0].transcript;

  setQuestion(voiceText);
  setListening(false);

  handleAskAI(voiceText);
};

  recognition.onerror = (event) => {
    console.log("Voice error:", event.error);
    setListening(false);
  };

  recognition.onend = () => {
    setListening(false);
  };

  recognition.start();
};
const speakAIResponse = (text) => {
    if (!("speechSynthesis" in window)) {
      alert("Voice output is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

   const speech = new SpeechSynthesisUtterance(text);

   speech.lang = "en-IN";
   speech.rate = 0.9;
   speech.pitch = 1;

   window.speechSynthesis.speak(speech);
};

  /* =========================
     QUICK AI OPTIONS
     ========================= */

  const handleAIOption = (type) => {
    if (type === "pest") {
      setQuestion("🐛 Pest Problem");
      setAiResponse(
        "🐞 Pest activity may be present. Please scan your crop leaf so AgroView can help identify possible pests and explain the risk level."
      );
    }

    if (type === "health") {
      setQuestion("🌿 Crop Health");
      setAiResponse(
        "🌱 Your crop health can be checked using a leaf scan. AgroView will analyze the crop and show its health status."
      );
    }

    if (type === "water") {
      setQuestion("💧 Water Advice");
      setAiResponse(
        "💧 Check the soil moisture before watering. Avoid unnecessary watering and monitor your crop regularly."
      );
    }
  };

  return (
    <div className="app">

      {/* =========================
          HEADER
          ========================= */}

      <header className="app-header">
        <h1>🌱 AgroView</h1>

        <div className="header-icons">
          <span>🔔</span>
          <span>👤</span>
        </div>
      </header>

      {/* =========================
          INTRO
          ========================= */}

      <div className="intro-card">
        <h2>Smart Farming Assistant</h2>
        <p>AI Powered Crop Monitoring System</p>
      </div>

      {/* =========================
          SELECTED CROP
          ========================= */}

      <div className="selected-crop">
        <span>Selected Crop</span>
        <h3>{crop}</h3>
      </div>

      {/* =========================
          SCAN BUTTON
          ========================= */}

      <Button
        text={scanning ? "🔄 Scanning..." : "📷 Scan Crop"}
        onClick={() => {
          setScanning(true);
          setResult(false);
        }}
      />

      {/* =========================
          ASK AGRO AI CARD
          ========================= */}

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

        {/* =========================
            AI QUICK ASSISTANT
            ========================= */}

        {showAssistant && (
          <div className="ai-assistant">

            <h2>🤖 Agro AI Assistant</h2>

            <div className="ai-message">
              👋 Hello! I am Agro AI.
              <br />
              How can I help you with your crop?
            </div>

            {/* Quick Options */}

            <div className="ai-options">

              <button
                onClick={() => handleAIOption("pest")}
              >
                🐛 Pest Problem
              </button>

              <button
                onClick={() => handleAIOption("health")}
              >
                🌿 Crop Health
              </button>

              <button
                onClick={() => handleAIOption("water")}
              >
                💧 Water Advice
              </button>

            </div>

            {/* =========================
                AI QUESTION INPUT
                ========================= */}

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
                onClick={handleAskAI}
              >
                ➤
              </button>

            </div>

            {/* =========================
                USER + AI CHAT
                ========================= */}

            {aiResponse && (
              <div className="ai-chat">

                <p>
                  <strong>👤 You:</strong>
                </p>

                <p>{question}</p>

                <p>
                  <strong>🤖 Agro AI:</strong>
                </p>

                <p>{aiResponse}</p>

              </div>
            )}

            {/* Close Assistant */}

            <button
              className="close-btn"
              onClick={() => {
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

      {/* =========================
          OLD AGRO AI PANEL
          ========================= */}

      {aiOpen && (
        <div className="ai-panel">

          <h3>🎤 Agro AI</h3>

          <p>
            Hello! I can help you understand your crop health,
            pest risks, and possible next steps.
          </p>

          {/* Input */}

          <div className="ai-input-row">

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
              onClick={handleAskAI}
            >
              ➤
            </button>

          </div>

          {/* User Question */}

          {aiResponse && (
            <div className="user-question">

              <strong>👤 You</strong>

              <p>{question}</p>

            </div>
          )}

          {/* AI Response */}

          {aiResponse && (
            <div className="ai-response">

              <strong>🤖 Agro AI</strong>

              <p>{aiResponse}</p>

            </div>
          )}

          {/* Close */}

          <button
            className="close-ai"
            onClick={() => {
              setAiOpen(false);
              setQuestion("");
              setAiResponse("");
            }}
          >
            Close
          </button>

        </div>
      )}

      {/* =========================
          SCANNING CARD
          ========================= */}

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

      {/* =========================
          SCAN RESULT
          ========================= */}

      {result && (
        <div className="result-card">

          <span className="result-label">
            🧪 Scan Result
          </span>

          <h3>🐞 Aphid Detected</h3>

          <div className="result-info">

            {/* Risk */}

            <p>
              <strong>Risk Level:</strong>{" "}
              <span className="risk-medium">
                Medium
              </span>
            </p>

            {/* Damage */}

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

          {/* Recommendation */}

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
          className={
            crop === "🥬 Cabbage"
              ? "active-crop"
              : ""
          }
          onClick={() => {
            setCrop("🥬 Cabbage");
            setScanning(false);
            setResult(false);
          }}
        >
          🥬 Cabbage
        </button>

        <button
          className={
            crop === "🌾 Rice"
              ? "active-crop"
              : ""
          }
          onClick={() => {
            setCrop("🌾 Rice");
            setScanning(false);
            setResult(false);
          }}
        >
          🌾 Rice
        </button>

        <button
          className={
            crop === "🍅 Tomato"
              ? "active-crop"
              : ""
          }
          onClick={() => {
            setCrop("🍅 Tomato");
            setScanning(false);
            setResult(false);
          }}
        >
          🍅 Tomato
        </button>

        <button
          className={
            crop === "🥦 Cauliflower"
              ? "active-crop"
              : ""
          }
          onClick={() => {
            setCrop("🥦 Cauliflower");
            setScanning(false);
            setResult(false);
          }}
        >
          🥦 Cauliflower
        </button>

      </div>

    </div>
  );
}

export default App;