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

  useEffect(() => {
    if (scanning) {
      const timer = setTimeout(() => {
        setScanning(false);
        setResult(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [scanning]);

  const handleAskAI = () => {
    if (question.trim() !== "") {
      setAiResponse(
        "Your crop looks healthy, but keep monitoring for pest activity."
      );
    }
  };

  return (
    <div className="app">

      {/* Header */}
      <header className="app-header">
        <h1>🌱 AgroView</h1>

        <div className="header-icons">
          <span>🔔</span>
          <span>👤</span>
        </div>
      </header>

      {/* Intro */}
      <div className="intro-card">
        <h2>Smart Farming Assistant</h2>
        <p>AI Powered Crop Monitoring System</p>
      </div>

      {/* Selected Crop */}
      <div className="selected-crop">
        <span>Selected Crop</span>
        <h3>{crop}</h3>
      </div>

      {/* Scan Button */}
      <Button
        text={scanning ? "🔄 Scanning..." : "📷 Scan Crop"}
        onClick={() => {
          setScanning(true);
          setResult(false);
        }}
      />

      {/* Ask Agro AI */}
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
          onClick={() => setAiOpen(true)}
        >
          Ask
        </button>
      </div>

      {/* Agro AI Panel */}
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

      {/* Scanning Card */}
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

      {/* Scan Result */}
      {result && (
        <div className="result-card">
          <span className="result-label">🧪 Scan Result</span>

          <h3>🐞 Aphid Detected</h3>

          <div className="result-info">

            {/* Risk */}
            <p>
              <strong>Risk Level:</strong>{" "}
              <span className="risk-medium">Medium</span>
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
              Monitor the affected leaves regularly and take suitable
              crop-protection measures.
            </p>
          </div>
        </div>
      )}

      {/* Crop Buttons */}
      <div className="crop-buttons">

        <button
          className={crop === "🥬 Cabbage" ? "active-crop" : ""}
          onClick={() => {
            setCrop("🥬 Cabbage");
            setScanning(false);
            setResult(false);
          }}
        >
          🥬 Cabbage
        </button>

        <button
          className={crop === "🌾 Rice" ? "active-crop" : ""}
          onClick={() => {
            setCrop("🌾 Rice");
            setScanning(false);
            setResult(false);
          }}
        >
          🌾 Rice
        </button>

        <button
          className={crop === "🍅 Tomato" ? "active-crop" : ""}
          onClick={() => {
            setCrop("🍅 Tomato");
            setScanning(false);
            setResult(false);
          }}
        >
          🍅 Tomato
        </button>

        <button
          className={crop === "🥦 Cauliflower" ? "active-crop" : ""}
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