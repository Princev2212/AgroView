
import { useState, useEffect } from "react";
import Button from "./components/Button";
import "./App.css";

function App() {
  const [crop, setCrop] = useState("🥬 Cabbage");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(false);

  const [notification, setNotification] = useState(null);

  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem("agroview-history");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "agroview-history",
      JSON.stringify(history)
    );
  }, [history]);

  const [pestName, setPestName] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [damage, setDamage] = useState(0);
  const [recommendation, setRecommendation] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedScan, setSelectedScan] = useState(null);
  const [pestDetails, setPestDetails] = useState("");

  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [showAssistant, setShowAssistant] = useState(false);
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  /* Save history */
  useEffect(() => {
    localStorage.setItem(
      "agroview-history",
      JSON.stringify(history)
    );
  }, [history]);

  /* Auto close app notification after 6 seconds */
  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification(null);
    }, 6000);

    return () => clearTimeout(timer);
  }, [notification]);

  /* Browser notification */
  useEffect(() => {
    if (!notification) return;

    if (
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification(notification.title, {
        body: notification.message,
      });
    }
  }, [notification]);

  /* Scan process */
  useEffect(() => {
    if (!scanning) return;

    const timer = setTimeout(() => {
      let scanData = {
        pest: "",
        risk: "",
        damage: 0,
        recommendation: "",
        details: "",
      };

      if (crop === "🥬 Cabbage") {
        scanData = {
          pest: "Aphid",
          risk: "Medium",
          damage: 12,
          recommendation:
            "Check the affected leaves regularly and monitor for any increase in pest activity.",
          details:
            "Aphids can affect young leaves and new plant growth. Check the underside of leaves regularly.",
        };
      } else if (crop === "🌾 Rice") {
        scanData = {
          pest: "Stem Borer",
          risk: "High",
          damage: 18,
          recommendation:
            "Check the affected plants carefully and take suitable crop-protection measures.",
          details:
            "Stem borers can cause significant damage to rice plants. Regular monitoring and timely intervention are crucial.",
        };
      } else if (crop === "🍅 Tomato") {
        scanData = {
          pest: "Whitefly",
          risk: "Medium",
          damage: 10,
          recommendation:
            "Check the leaves and young shoots regularly for further pest activity.",
          details:
            "Whiteflies can cause yellowing of leaves and stunt plant growth. Check the undersides of leaves for their presence.",
        };
      } else {
        scanData = {
          pest: "Caterpillar",
          risk: "Low",
          damage: 7,
          recommendation:
            "Damage is currently low. Continue checking the leaves regularly.",
          details:
            "Caterpillars can cause damage to leaves and stems. Regular monitoring is recommended.",
        };
      }

      /* Update scan result */
      setPestName(scanData.pest);
      setRiskLevel(scanData.risk);
      setDamage(scanData.damage);
      setRecommendation(scanData.recommendation);
      setPestDetails(scanData.details);

      setScanning(false);
      setResult(true);

      /* Create notification using actual scan data */
      setNotification({
        title: "⚠️ Pest Detected",
        message: `🐞 ${scanData.pest} detected in ${crop}. Damage: ${scanData.damage}% | Risk: ${scanData.risk}`,
        risk: scanData.risk,
      });

      /* Add scan to history */
      setHistory((oldHistory) => {
        const lastScan = oldHistory[0];

        if (
          lastScan &&
          lastScan.crop === crop &&
          lastScan.pest === scanData.pest &&
          lastScan.damage === scanData.damage
        ) {
          return oldHistory;
        }

        return [
          {
            id: Date.now(),
            crop,
            pest: scanData.pest,
            risk: scanData.risk,
            damage: scanData.damage,
            recommendation: scanData.recommendation,
            date: new Date().toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
          },
          ...oldHistory,
        ].slice(0, 10);
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [scanning, crop]);

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
        "🐛 Pest activity may be present. Scan your crop leaf to check for possible pest infestation.";
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

      {/* Notification */}
      {notification && (
        <div
          className={`app-notification notification-${notification.risk.toLowerCase()}`}
        >
          <div className="notification-icon">
            🔔
          </div>

          <div className="notification-content">
            <strong>{notification.title}</strong>

            <p>{notification.message}</p>
          </div>

          <button
            className="notification-close"
            onClick={() => setNotification(null)}
          >
            ✕
          </button>
        </div>
      )}
      {showLogin && (
        <div className="login-overlay">
          <div className="login-card">

           <button
             className="login-close"
             onClick={() => setShowLogin(false)}
            >
             ✕
            </button>

            <div className="login-icon">👤</div>

            <h2>Welcome to AgroView</h2>
            <p>Login to continue</p>

            <input
              type="text"
              placeholder="Enter your name"
            />

           <input
             type="email"
             placeholder="Enter your email"
           />

           <button className="login-button">
             Login
            </button>
         </div>
      </div>
    )}

      <header className="app-header">
        <h1>🌱 AgroView</h1>

        <div className="header-icons">
          <span>🔔</span>
          <span
            className="profile-icon"
            onClick={() => setShowLogin(true)}
          >
            👤
        </span>
        </div>
      </header>

      <div className="intro-card">
        <h2>Smart Farming Assistant</h2>
        <p>Crop Monitoring & Farming Guidance</p>
      </div>

      <div className="selected-crop">
        <span>Selected Crop</span>
        <h3>{crop}</h3>
      </div>

      <Button
        text={scanning ? "🔄 Scanning..." : "📷 Scan Crop"}
        onClick={() => {
          if (
            "Notification" in window &&
            Notification.permission === "default"
          ) {
            Notification.requestPermission();
          }

          setScanning(true);
          setResult(false);
          setShowDetails(false);
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
                className={`ai-mic ${
                  listening ? "listening" : ""
                }`}
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

                  <button
                    onClick={() =>
                      speakAIResponse(aiResponse)
                    }
                  >
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
            Checking the crop for possible pest activity...
          </p>

          <div className="scan-loader"></div>

        </div>
      )}

      {result && (
        <div className="result-card">

          <span className="result-label">
            🧪 Scan Result
          </span>

          <h3>🐞 {pestName} Detected</h3>

          <div className="result-info">

            <p>
              <strong>Risk Level:</strong>{" "}
              <span
                className={`risk-${riskLevel.toLowerCase()}`}
              >
                {riskLevel}
              </span>
            </p>

            <div className="damage-section">

              <div className="damage-header">
                <strong>Crop Damage</strong>

                <span>{damage}%</span>
              </div>

              <div className="damage-bar">

                <div
                  className={`damage-fill ${
                    damage < 10
                      ? "damage-low"
                      : damage < 20
                      ? "damage-medium"
                      : "damage-high"
                  }`}
                  style={{ width: `${damage}%` }}
                ></div>

              </div>

            </div>

          </div>

          <div className="recommendation">

            <div className="recommendation-title">
              💡 What to do
            </div>

            <p>{recommendation}</p>

          </div>

          <button
            className="details-button"
            onClick={() =>
              setShowDetails(!showDetails)
            }
          >
            {showDetails
              ? "Hide Details ↑"
              : "View Details →"}
          </button>

          {showDetails && (
            <div className="details-section">

              <h4>Details</h4>

              <p>{pestDetails}</p>

            </div>
          )}

        </div>
      )}

      <div className="crop-buttons">

        <button
          className={
            crop === "🥬 Cabbage"
              ? "active-crop"
              : ""
          }
          onClick={() =>
            changeCrop("🥬 Cabbage")
          }
        >
          🥬 Cabbage
        </button>

        <button
          className={
            crop === "🌾 Rice"
              ? "active-crop"
              : ""
          }
          onClick={() =>
            changeCrop("🌾 Rice")
          }
        >
          🌾 Rice
        </button>

        <button
          className={
            crop === "🍅 Tomato"
              ? "active-crop"
              : ""
          }
          onClick={() =>
            changeCrop("🍅 Tomato")
          }
        >
          🍅 Tomato
        </button>

        <button
          className={
            crop === "🥦 Cauliflower"
              ? "active-crop"
              : ""
          }
          onClick={() =>
            changeCrop("🥦 Cauliflower")
          }
        >
          🥦 Cauliflower
        </button>

      </div>

      {selectedScan && (

        <div className="selected-scan-card">

          <h3>
            🔍 Scan Details — {selectedScan.crop}
          </h3>

          <p>
            <strong>Crop:</strong>{" "}
            {selectedScan.crop}
          </p>

          <p>
            <strong>Pest:</strong>{" "}
            {selectedScan.pest}
          </p>

          <p>
            <strong>Risk:</strong>{" "}
            <span
              className={`risk-${selectedScan.risk.toLowerCase()}`}
            >
              {selectedScan.risk}
            </span>
          </p>

          <div className="selected-damage">

            <div className="selected-damage-header">

              <strong>Damage:</strong>

              <span
                className={
                  selectedScan.damage < 10
                    ? "damage-text-low"
                    : selectedScan.damage < 20
                    ? "damage-text-medium"
                    : "damage-text-high"
                }
              >
                {selectedScan.damage}%
              </span>

            </div>

            <div className="selected-damage-bar">

              <div
                className={`selected-damage-fill ${
                  selectedScan.damage < 10
                    ? "damage-low"
                    : selectedScan.damage < 20
                    ? "damage-medium"
                    : "damage-high"
                }`}
                style={{
                  width: `${selectedScan.damage}%`,
                }}
              ></div>

            </div>

          </div>

          <p>
            <strong>🕒 Scanned:</strong>{" "}
            {selectedScan.date}
          </p>

          <div
            className={`selected-recommendation selected-recommendation-${selectedScan.risk.toLowerCase()}`}
          >
            <strong>💡 What to do</strong>

            <p>
              {selectedScan.recommendation ||
                "No advice available for this scan."}
            </p>

          </div>

          <button
            className="close-selected-scan"
            onClick={() =>
              setSelectedScan(null)
            }
          >
            ✕ Close
          </button>

        </div>

      )}

      <div className="history-card">

        <h3>📋 Scan History</h3>

        <p className="history-count">
          {history.length} / 10 scans
        </p>

        <button
          className="clear-history"
          onClick={() => {
            const confirmClear = window.confirm(
              "Are you sure you want to clear all scan history?"
            );

            if (confirmClear) {
              setHistory([]);
              setSelectedScan(null);
            }
          }}
        >
          🗑️ Clear History
        </button>

        {history.length === 0 ? (

          <div className="empty-history">

            <div className="empty-history-icon">
              📋
            </div>

            <strong>No scan history</strong>

            <p>
              Your recent crop scans will appear here.
            </p>

          </div>

        ) : (

          history.map((item) => (

            <div
              className={`history-item ${
                selectedScan?.id === item.id
                  ? "selected-history-item"
                  : ""
              }`}
              key={item.id}
              onClick={() =>
                setSelectedScan(item)
              }
            >

              <div className="history-crop-pest">

                <strong>{item.crop}</strong>

                <span>•</span>

                <span>
                  🐞 {item.pest}
                </span>

              </div>

              <div className="history-risk-row">

                <span
                  className={`history-risk risk-${item.risk.toLowerCase()}`}
                >
                  Risk: {item.risk}
                </span>

                <span
                  className={`history-damage ${
                    item.damage < 10
                      ? "damage-low"
                      : item.damage < 20
                      ? "damage-medium"
                      : "damage-high"
                  }`}
                >
                  Damage: {item.damage}%
                </span>

              </div>

              <p>
                🕒 Scanned: {item.date}
              </p>

              {item.recommendation && (
                <p className="history-recommendation">

                  💡 Advice:{" "}

                  {item.recommendation.length > 80
                    ? item.recommendation.slice(0, 80) + "..."
                    : item.recommendation}

                </p>
              )}

              <p className="history-view-details">
                Tap to view details →
              </p>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default App;