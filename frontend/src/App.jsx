import { useState, useEffect } from "react";
import Button from "./components/Button";
import "./App.css";

function App() {
  /* =========================
     ACCOUNT + LOGIN
  ========================= */

  const [hasAccount, setHasAccount] = useState(() => {
    return localStorage.getItem("agroview-account-created") === "true";
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("agroview-logged-in") === "true";
  });

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("agroview-user-name") || "";
  });

  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem("agroview-user-email") || "";
  });

  /* =========================
     SIGN UP
  ========================= */

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  /* =========================
     LOGIN
  ========================= */

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  /* =========================
     FARM AREA
  ========================= */

  const [farmArea, setFarmArea] = useState(() => {
    return localStorage.getItem("agroview-farm-area") || "";
  });

  const [showCropView, setShowCropView] = useState(false);

  /* =========================
     CROPS
  ========================= */

  const [selectedCrops, setSelectedCrops] = useState(() => {
    const saved = localStorage.getItem("agroview-selected-crops");

    if (!saved) {
      return [];
    }

    try {
      const crops = JSON.parse(saved);

      if (Array.isArray(crops)) {
        return crops;
      }

      return [];
    } catch {
      return [];
    }
  });

  const [crop, setCrop] = useState(() => {
    const saved = localStorage.getItem("agroview-selected-crops");

    if (!saved) {
      return "";
    }

    try {
      const crops = JSON.parse(saved);

      if (Array.isArray(crops) && crops.length > 0) {
        return crops[0];
      }

      return "";
    } catch {
      return "";
    }
  });

  const [showProfile, setShowProfile] = useState(false);

  /* =========================
     SCAN
  ========================= */

  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(false);

  /* =========================
     NOTIFICATION
  ========================= */

  const [notification, setNotification] = useState(null);

  /* =========================
     HISTORY
  ========================= */

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("agroview-history");

    if (!saved) {
      return [];
    }

    try {
      const data = JSON.parse(saved);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  });

  /* =========================
     RESULT DATA
  ========================= */

  const [pestName, setPestName] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [damage, setDamage] = useState(0);
  const [recommendation, setRecommendation] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedScan, setSelectedScan] = useState(null);
  const [pestDetails, setPestDetails] = useState("");

  /* =========================
     AGRO AI
  ========================= */

  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [showAssistant, setShowAssistant] = useState(false);
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  /* =========================
     SAVE CROPS
  ========================= */

  useEffect(() => {
    localStorage.setItem(
      "agroview-selected-crops",
      JSON.stringify(selectedCrops)
    );
  }, [selectedCrops]);

  /* =========================
     SAVE FARM AREA
  ========================= */

  useEffect(() => {
    if (farmArea) {
      localStorage.setItem("agroview-farm-area", farmArea);
    }
  }, [farmArea]);

  /* =========================
     SAVE HISTORY
  ========================= */

  useEffect(() => {
    localStorage.setItem(
      "agroview-history",
      JSON.stringify(history)
    );
  }, [history]);

  /* =========================
     NOTIFICATION CLOSE
  ========================= */

  useEffect(() => {
    if (!notification) {
      return;
    }

    const timer = setTimeout(() => {
      setNotification(null);
    }, 6000);

    return () => clearTimeout(timer);
  }, [notification]);

  /* =========================
     BROWSER NOTIFICATION
  ========================= */

  useEffect(() => {
    if (!notification) {
      return;
    }

    if (
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification(notification.title, {
        body: notification.message,
      });
    }
  }, [notification]);

  /* =========================
     SIGN UP
  ========================= */

  const handleSignup = () => {
    if (
      !signupName.trim() ||
      !signupEmail.trim() ||
      !signupPassword.trim()
    ) {
      alert("Please enter your name, email and password.");
      return;
    }

    localStorage.setItem(
      "agroview-account-created",
      "true"
    );

    localStorage.setItem(
      "agroview-user-name",
      signupName.trim()
    );

    localStorage.setItem(
      "agroview-user-email",
      signupEmail.trim()
    );

    localStorage.setItem(
      "agroview-user-password",
      signupPassword
    );

    localStorage.removeItem("agroview-crop");
    localStorage.removeItem("agroview-selected-crops");
    localStorage.removeItem("agroview-farm-area");

    setHasAccount(true);
    setIsLoggedIn(false);

    setUserName(signupName.trim());
    setUserEmail(signupEmail.trim());

    setSelectedCrops([]);
    setCrop("");

    setFarmArea("");

    setLoginEmail(signupEmail.trim());
    setLoginPassword("");

    setSignupName("");
    setSignupEmail("");
    setSignupPassword("");

    alert("Account created successfully. Please login.");
  };

  /* =========================
     LOGIN
  ========================= */

  const handleLogin = () => {
    const savedEmail =
      localStorage.getItem("agroview-user-email");

    const savedPassword =
      localStorage.getItem("agroview-user-password");

    if (
      !loginEmail.trim() ||
      !loginPassword.trim()
    ) {
      alert("Please enter your email and password.");
      return;
    }

    if (
      loginEmail.trim() !== savedEmail ||
      loginPassword !== savedPassword
    ) {
      alert("Invalid email or password.");
      return;
    }

    localStorage.setItem(
      "agroview-logged-in",
      "true"
    );

    const savedName =
      localStorage.getItem("agroview-user-name") || "";

    setUserName(savedName);
    setUserEmail(savedEmail || "");
    setIsLoggedIn(true);

    setLoginEmail("");
    setLoginPassword("");
  };

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    localStorage.setItem(
      "agroview-logged-in",
      "false"
    );

    setIsLoggedIn(false);
    setShowProfile(false);
  };

  /* =========================
     SAVE FARM AREA
  ========================= */

  const saveFarmArea = () => {
    if (!farmArea || Number(farmArea) <= 0) {
      alert("Please enter a valid farm area.");
      return;
    }

    const cleanArea = Number(farmArea);

    localStorage.setItem(
      "agroview-farm-area",
      cleanArea.toString()
    );

    setFarmArea(cleanArea.toString());

    alert("Farm area saved successfully.");
  };

  /* =========================
     ADD CROP
  ========================= */

  const addCrop = (newCrop) => {
    if (selectedCrops.includes(newCrop)) {
      setCrop(newCrop);
      return;
    }

    const updatedCrops = [
      ...selectedCrops,
      newCrop,
    ];

    setSelectedCrops(updatedCrops);
    setCrop(newCrop);

    setScanning(false);
    setResult(false);
    setShowDetails(false);
    setSelectedScan(null);
    setQuestion("");
    setAiResponse("");
  };

  /* =========================
     REMOVE CROP
  ========================= */

  const removeCrop = (cropToRemove) => {
    if (selectedCrops.length === 1) {
      alert("At least one crop must be selected.");
      return;
    }

    const updatedCrops = selectedCrops.filter(
      (item) => item !== cropToRemove
    );

    setSelectedCrops(updatedCrops);

    if (crop === cropToRemove) {
      setCrop(updatedCrops[0]);
    }

    setScanning(false);
    setResult(false);
    setShowDetails(false);
    setSelectedScan(null);
    setQuestion("");
    setAiResponse("");
  };

  /* =========================
     SELECT ACTIVE CROP
  ========================= */

  const selectCrop = (newCrop) => {
    setCrop(newCrop);

    setScanning(false);
    setResult(false);
    setShowDetails(false);
    setSelectedScan(null);
    setQuestion("");
    setAiResponse("");

    setPestName("");
    setRiskLevel("");
    setDamage(0);
    setRecommendation("");
    setPestDetails("");
  };

  /* =========================
     FIRST CROP SELECTION
  ========================= */

  const handleCropSelection = (newCrop) => {
    const firstCrop = [newCrop];

    setSelectedCrops(firstCrop);
    setCrop(newCrop);

    localStorage.setItem(
      "agroview-selected-crops",
      JSON.stringify(firstCrop)
    );

    setScanning(false);
    setResult(false);
    setShowDetails(false);
    setSelectedScan(null);
    setQuestion("");
    setAiResponse("");
  };

  /* =========================
     SCAN PROCESS
  ========================= */

  useEffect(() => {
    if (!scanning || !crop) {
      return;
    }

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
      }

      if (crop === "🌾 Rice") {
        scanData = {
          pest: "Stem Borer",
          risk: "High",
          damage: 18,
          recommendation:
            "Check the affected plants carefully and take suitable crop-protection measures.",
          details:
            "Stem borers can cause significant damage to rice plants. Regular monitoring and timely intervention are important.",
        };
      }

      if (crop === "🍅 Tomato") {
        scanData = {
          pest: "Whitefly",
          risk: "Medium",
          damage: 10,
          recommendation:
            "Check the leaves and young shoots regularly for further pest activity.",
          details:
            "Whiteflies can cause yellowing of leaves and affect plant growth. Check the undersides of leaves regularly.",
        };
      }

      if (crop === "🥦 Cauliflower") {
        scanData = {
          pest: "Caterpillar",
          risk: "Low",
          damage: 7,
          recommendation:
            "Damage is currently low. Continue checking the leaves regularly.",
          details:
            "Caterpillars can damage leaves and stems. Regular monitoring is recommended.",
        };
      }

      setPestName(scanData.pest);
      setRiskLevel(scanData.risk);
      setDamage(scanData.damage);
      setRecommendation(scanData.recommendation);
      setPestDetails(scanData.details);

      setScanning(false);
      setResult(true);

      setNotification({
        title: "⚠️ Pest Detected",
        message:
          `🐞 ${scanData.pest} detected in ${crop}. ` +
          `Damage: ${scanData.damage}% | Risk: ${scanData.risk}`,
        risk: scanData.risk,
      });

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

        const newScan = {
          id: Date.now(),
          crop,
          pest: scanData.pest,
          risk: scanData.risk,
          damage: scanData.damage,
          recommendation: scanData.recommendation,
          date: new Date().toLocaleString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }
          ),
        };

        return [
          newScan,
          ...oldHistory,
        ].slice(0, 10);
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [scanning, crop]);

  /* =========================
     AI SPEECH
  ========================= */

  const speakAIResponse = (text) => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(
        /\p{Extended_Pictographic}/gu,
        ""
      )
      .replace(/\uFE0F/g, "")
      .trim();

    const speech =
      new SpeechSynthesisUtterance(cleanText);

    speech.lang = "en-IN";
    speech.rate = 0.9;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

  const stopAIResponse = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  /* =========================
     STOP VOICE INPUT
  ========================= */

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setRecognition(null);
      setListening(false);
    }
  };

  /* =========================
     ASK AI
  ========================= */

  const handleAskAI = (input = question) => {
    const q = input.trim().toLowerCase();

    if (!q || !crop) {
      return;
    }

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
      answer =
        `📊 Check the damaged leaves of ${crop} regularly. ` +
        "If the damage increases, scan the crop again.";
    } else if (
      q.includes("healthy") ||
      q.includes("health")
    ) {
      answer =
        `🌱 Your selected crop is ${crop}. ` +
        "Keep monitoring it regularly and use the crop scan to check its condition.";
    } else if (
      q.includes("water") ||
      q.includes("watering") ||
      q.includes("irrigation")
    ) {
      answer =
        `💧 Before watering ${crop}, check the soil moisture. ` +
        "Avoid overwatering the crop.";
    } else if (
      q.includes("aphid") ||
      q.includes("aphids")
    ) {
      answer =
        `🐞 Aphids can affect ${crop}. ` +
        "Check the underside of leaves and young plant parts for aphid activity.";
    } else {
      answer =
        `🤖 I can help you with ${crop}, pests, leaf damage, crop health and watering advice.`;
    }

    setAiResponse(answer);
    speakAIResponse(answer);
  };

  /* =========================
     VOICE INPUT
  ========================= */

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice input is not supported. Please use Chrome or Edge."
      );
      return;
    }

    const newRecognition =
      new SpeechRecognition();

    setRecognition(newRecognition);

    newRecognition.lang = "en-IN";
    newRecognition.continuous = false;
    newRecognition.interimResults = false;

    newRecognition.onstart = () => {
      setListening(true);
    };

    newRecognition.onresult = (event) => {
      const text =
        event.results[0][0].transcript;

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

  /* =========================
     FARM HEALTH
  ========================= */

  const calculateFarmHealth = () => {
    if (history.length === 0) {
      return 100;
    }

    const totalDamage = history.reduce(
      (total, scan) => total + Number(scan.damage || 0),
      0
    );

    const averageDamage =
      totalDamage / history.length;

    return Math.max(
      0,
      Math.round(100 - averageDamage)
    );
  };

  /* =========================
     AI QUICK OPTIONS
  ========================= */

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

  /* =====================================================
     SIGN UP PAGE
  ===================================================== */

  if (!hasAccount) {
    return (
      <div className="app login-page">
        <div className="login-card">

          <div className="login-icon">
            🌱
          </div>

          <h1>AgroView</h1>

          <h2>Create Your Account</h2>

          <p>
            Sign up first to start using AgroView.
          </p>

          <input
            type="text"
            placeholder="Enter your name"
            value={signupName}
            onChange={(e) =>
              setSignupName(e.target.value)
            }
          />

          <input
            type="email"
            placeholder="Enter your email"
            value={signupEmail}
            onChange={(e) =>
              setSignupEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Create password"
            value={signupPassword}
            onChange={(e) =>
              setSignupPassword(e.target.value)
            }
          />

          <button
            className="login-button"
            onClick={handleSignup}
          >
            Sign Up
          </button>

        </div>
      </div>
    );
  }

  /* =====================================================
     LOGIN PAGE
  ===================================================== */

  if (!isLoggedIn) {
    return (
      <div className="app login-page">
        <div className="login-card">

          <div className="login-icon">
            🌱
          </div>

          <h1>AgroView</h1>

          <h2>Welcome Back</h2>

          <p>
            Login to continue to your smart
            farming assistant.
          </p>

          <input
            type="email"
            placeholder="Enter your email"
            value={loginEmail}
            onChange={(e) =>
              setLoginEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={loginPassword}
            onChange={(e) =>
              setLoginPassword(e.target.value)
            }
          />

          <button
            className="login-button"
            onClick={handleLogin}
          >
            Login
          </button>

        </div>
      </div>
    );
  }

  /* =====================================================
     FIRST CROP SELECTION
  ===================================================== */

  if (selectedCrops.length === 0) {
    return (
      <div className="app crop-selection-page">

        <div className="crop-selection-card">

          <div className="login-icon">
            🌱
          </div>

          <h1>
            Hello, {userName}! 👋
          </h1>

          <h2>
            Select Your Crop
          </h2>

          <p>
            Which crop are you currently growing?
          </p>

          <div className="crop-selection-buttons">

            <button
              onClick={() =>
                handleCropSelection("🥬 Cabbage")
              }
            >
              🥬 Cabbage
            </button>

            <button
              onClick={() =>
                handleCropSelection("🌾 Rice")
              }
            >
              🌾 Rice
            </button>

            <button
              onClick={() =>
                handleCropSelection("🍅 Tomato")
              }
            >
              🍅 Tomato
            </button>

            <button
              onClick={() =>
                handleCropSelection("🥦 Cauliflower")
              }
            >
              🥦 Cauliflower
            </button>

          </div>

        </div>

      </div>
    );
  }

  /* =====================================================
     MAIN HOME
  ===================================================== */

  return (
    <div className="app">

      {/* =========================
          NOTIFICATION
      ========================= */}

      {notification && (
        <div
          className={`app-notification notification-${notification.risk.toLowerCase()}`}
        >
          <div className="notification-icon">
            🔔
          </div>

          <div className="notification-content">

            <strong>
              {notification.title}
            </strong>

            <p>
              {notification.message}
            </p>

          </div>

          <button
            className="notification-close"
            onClick={() =>
              setNotification(null)
            }
          >
            ✕
          </button>
        </div>
      )}

      {/* =========================
          HEADER
      ========================= */}

      <header className="app-header">

        <h1>
          🌱 AgroView
        </h1>

        <div className="header-icons">

          <span>
            🔔
          </span>

          <span
            className="profile-icon"
            onClick={() =>
              setShowProfile(true)
            }
          >
            👤
          </span>

        </div>

      </header>

      {/* =====================================================
          PROFILE PAGE
      ===================================================== */}

      {showProfile && (
        <div className="profile-overlay">

          <div className="profile-page">

            {/* PROFILE HEADER */}

            <div className="profile-page-header">

              <button
                className="profile-back"
                onClick={() => {
                  setShowProfile(false);
                  setShowCropView(false);
                }}
              >
                ←
              </button>

              <h2>
                My Profile
              </h2>

            </div>

            {/* USER CARD */}

            <div className="profile-user-card">

              <div className="profile-avatar">
                👤
              </div>

              <div>
                <h2>
                  {userName}
                </h2>

                <p>
                  {userEmail}
                </p>
              </div>

            </div>

            {/* =========================
                FARM DETAILS
            ========================= */}

            <div className="profile-section">

              <div className="profile-section-title">
                🌾 My Farm
              </div>

              <div className="farm-area-card">

                <div>

                  <span>
                    Farm Area
                  </span>

                  <strong>
                    {farmArea
                      ? `${farmArea} Acres`
                      : "Not added"}
                  </strong>

                </div>

                <div className="farm-icon">
                  🌱
                </div>

              </div>

              <div className="farm-area-input">

                <input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Enter farm area in acres"
                  value={farmArea}
                  onChange={(e) =>
                    setFarmArea(e.target.value)
                  }
                />

                <button
                  onClick={saveFarmArea}
                >
                  Save
                </button>

              </div>

            </div>

            {/* =========================
                VIEW MY CROP
            ========================= */}

            <div className="profile-section">

              <button
                className="view-crop-button"
                onClick={() =>
                  setShowCropView(!showCropView)
                }
              >

                <span>
                  🌿 View My Crop
                </span>

                <span>
                  {showCropView ? "↑" : "→"}
                </span>

              </button>

              {showCropView && (
                <div className="crop-view-card">

                  <h3>
                    🌾 Your Farm Monitoring
                  </h3>

                  <p>
                    Your farm is divided into
                    camera monitoring zones.
                  </p>

                  <div className="farm-stat-grid">

                    <div className="farm-stat">

                      <span>
                        📐 Area
                      </span>

                      <strong>
                        {farmArea || 0} Acres
                      </strong>

                    </div>

                    <div className="farm-stat">

                      <span>
                        📷 Camera Zones
                      </span>

                      <strong>
                        {farmArea
                          ? Math.ceil(
                              Number(farmArea) * 4
                            )
                          : 0}
                      </strong>

                    </div>

                  </div>

                  <div className="camera-info">

                    <div className="camera-info-icon">
                      📷
                    </div>

                    <div>

                      <strong>
                        4 Camera Zones / Acre
                      </strong>

                      <p>
                        Each acre is divided into
                        4 monitoring parts for
                        crop observation.
                      </p>

                    </div>

                  </div>

                <div className="farm-dashboard">

                  <h3>📊 Farm Overview</h3>

                 <div className="farm-dashboard-grid">

                  <div className="dashboard-stat">
                    <span>📐 Farm Area</span>
                    <strong>{farmArea || 0} Acres</strong>
                  </div>
 
                  <div className="dashboard-stat">
                    <span>📷 Cameras</span>
                    <strong>
                      {farmArea
                        ? Math.ceil(Number(farmArea) * 4)
                        : 0}
                    </strong>
                  </div>

                  <div className="dashboard-stat healthy">
                    <span>🟢 Healthy Zones</span>
                    <strong>
                      {farmArea
                        ? Math.max(
                           0,
                           Math.ceil(Number(farmArea) * 4) - 4
                         )
                      : 0}
                    </strong>
                 </div>

                 <div className="dashboard-stat warning">
                   <span>🟡 Pest Detected</span>
                   <strong>3</strong>
                 </div>

                 <div className="dashboard-stat critical">
                   <span>🔴 Critical</span>
                   <strong>1</strong>
                  </div>

                  <div className="dashboard-stat health">
                    <span>🌱 Farm Health</span>
                    <strong>
                      {calculateFarmHealth()}%
                    </strong>
                    <small>
                      {calculateFarmHealth() >= 80
                       ? "🟢 Farm is healthy"
                      : calculateFarmHealth() >= 60
                      ? "🟡 Needs attention"
                      : "🔴 Immediate attention needed"}
                    </small>
                  </div>

                </div>

              </div>
                  <div className="camera-zones">

                    {[1, 2, 3, 4].map(
                      (zone) => (
                        <div
                          className="camera-zone"
                          key={zone}
                        >

                          <span>
                            📷
                          </span>

                          <strong>
                            Zone {zone}
                          </strong>

                          <small>
                            Camera
                          </small>

                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

            </div>

            {/* =========================
                MY CROPS
            ========================= */}

            <div className="profile-section">

              <div className="profile-section-title">
                🌱 My Crops
              </div>

              <div className="profile-crops">

                {selectedCrops.map(
                  (item) => (
                    <div
                      className="profile-crop-card"
                      key={item}
                    >

                      <span>
                        {item}
                      </span>

                      <button
                        onClick={() =>
                          removeCrop(item)
                        }
                      >
                        ✕
                      </button>

                    </div>
                  )
                )}

              </div>

              <div className="profile-add-crops">

                <button
                  onClick={() =>
                    addCrop("🥬 Cabbage")
                  }
                >
                  + 🥬 Cabbage
                </button>

                <button
                  onClick={() =>
                    addCrop("🌾 Rice")
                  }
                >
                  + 🌾 Rice
                </button>

                <button
                  onClick={() =>
                    addCrop("🍅 Tomato")
                  }
                >
                  + 🍅 Tomato
                </button>

                <button
                  onClick={() =>
                    addCrop("🥦 Cauliflower")
                  }
                >
                  + 🥦 Cauliflower
                </button>

              </div>

            </div>

            {/* =========================
                ACCOUNT SETTINGS
            ========================= */}

            <div className="profile-section">

              <div className="profile-section-title">
                ⚙️ Account Settings
              </div>

              {/* CHANGE EMAIL */}

              <button
                className="profile-action"
                onClick={() => {

                  const newEmail =
                    window.prompt(
                      "Enter your new email:"
                    );

                  if (
                    newEmail &&
                    newEmail.includes("@")
                  ) {

                    localStorage.setItem(
                      "agroview-user-email",
                      newEmail.trim()
                    );

                    setUserEmail(
                      newEmail.trim()
                    );

                    alert(
                      "Email updated successfully."
                    );
                  }

                }}
              >

                <span>
                  ✉️ Change Email
                </span>

                <span>
                  →
                </span>

              </button>

              {/* LOGOUT */}

              <button
                className="profile-action logout-action"
                onClick={handleLogout}
              >

                <span>
                  🚪 Logout
                </span>

                <span>
                  →
                </span>

              </button>

              {/* DELETE ACCOUNT */}

              <button
                className="delete-account-button"
                onClick={() => {

                  const confirmed =
                    window.confirm(
                      "Are you sure you want to delete your AgroView account?"
                    );

                  if (!confirmed) {
                    return;
                  }

                  localStorage.clear();

                  setHasAccount(false);
                  setIsLoggedIn(false);

                  setUserName("");
                  setUserEmail("");

                  setSelectedCrops([]);
                  setCrop("");

                  setHistory([]);

                  setFarmArea("");

                  setShowProfile(false);
                  setShowCropView(false);

                }}
              >
                🗑️ Delete Account
              </button>

            </div>

            {/* PROFILE CLOSE */}

            <button
              className="close-btn"
              onClick={() => {
                setShowProfile(false);
                setShowCropView(false);
              }}
            >
              Close
            </button>

          </div>

        </div>
      )}

      {/* =========================
          INTRO
      ========================= */}

      <div className="intro-card">

        <h2>
          Welcome, {userName} 👋
        </h2>

        <p>
          Smart Farming Assistant
        </p>

      </div>

      {/* =========================
          YOUR CROPS
      ========================= */}

      <div className="selected-crop">

        <span>
          Your Crops
        </span>

        <div className="home-crops">

          {selectedCrops.map((item) => (

            <button
              key={item}
              className={
                crop === item
                  ? "active-crop"
                  : ""
              }
              onClick={() =>
                selectCrop(item)
              }
            >
              {item}
            </button>

          ))}

        </div>

        <p>
          Selected for scanning:
          <strong>
            {" "}
            {crop}
          </strong>
        </p>

      </div>

      {/* =========================
          SCAN BUTTON
      ========================= */}

      <Button
        text={
          scanning
            ? "🔄 Scanning..."
            : "📷 Scan Crop"
        }
        onClick={() => {

          if (!crop) {
            alert(
              "Please select a crop first."
            );
            return;
          }

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

      {/* =========================
          AGRO AI
      ========================= */}

      <div className="ai-card">

        <div className="ai-icon">
          🎤
        </div>

        <div className="ai-content">

          <h3>
            Ask Agro AI
          </h3>

          <p>
            Ask questions about your crop
            and get farming guidance.
          </p>

        </div>

        <button
          className="ai-button"
          onClick={() =>
            setShowAssistant(true)
          }
        >
          🎤 Ask Agro AI
        </button>

        {showAssistant && (

          <div className="ai-assistant">

            <h2>
              🤖 Agro AI Assistant
            </h2>

            <div className="ai-message">

              👋 Hello! I am Agro AI.

              <br />

              How can I help you with your crop?

            </div>

            <div className="ai-options">

              <button
                onClick={() =>
                  handleAIOption("pest")
                }
              >
                🐛 Pest Problem
              </button>

              <button
                onClick={() =>
                  handleAIOption("health")
                }
              >
                🌿 Crop Health
              </button>

              <button
                onClick={() =>
                  handleAIOption("water")
                }
              >
                💧 Water Advice
              </button>

            </div>

            <div className="ai-input-row">

              <button
                className={`ai-mic ${
                  listening
                    ? "listening"
                    : ""
                }`}
                onClick={
                  handleVoiceInput
                }
              >
                {listening
                  ? "🔴"
                  : "🎤"}
              </button>

              <input
                type="text"
                placeholder="Ask about your crop..."
                value={question}
                onChange={(e) =>
                  setQuestion(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {

                  if (
                    e.key === "Enter"
                  ) {
                    handleAskAI();
                  }

                }}
              />

              <button
                className="ai-send"
                onClick={() =>
                  handleAskAI()
                }
              >
                ➤
              </button>

            </div>

            {aiResponse && (

              <div className="ai-chat">

                <p>
                  <strong>
                    👤 You:
                  </strong>
                </p>

                <p>
                  {question}
                </p>

                <p>
                  <strong>
                    🤖 Agro AI:
                  </strong>
                </p>

                <div className="ai-response-box">

                  <span>
                    🤖
                  </span>

                  <p>
                    {aiResponse}
                  </p>

                </div>

                <div className="ai-voice-controls">

                  <button
                    onClick={() =>
                      speakAIResponse(
                        aiResponse
                      )
                    }
                  >
                    🔊 Speak
                  </button>

                  <button
                    onClick={
                      stopAIResponse
                    }
                  >
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

      {/* =========================
          SCANNING
      ========================= */}

      {scanning && (

        <div className="scanning-card">

          <div className="scan-icon">
            📷
          </div>

          <h3>
            Scanning {crop}
          </h3>

          <p>
            Checking the crop for possible
            pest activity...
          </p>

          <div className="scan-loader"></div>

        </div>

      )}

      {/* =========================
          RESULT
      ========================= */}

      {result && (

        <div className="result-card">

          <span className="result-label">
            🧪 Scan Result
          </span>

          <h3>
            🐞 {pestName} Detected
          </h3>

          <div className="result-info">

            <p>
              <strong>
                Risk Level:
              </strong>{" "}

              <span
                className={`risk-${riskLevel.toLowerCase()}`}
              >
                {riskLevel}
              </span>

            </p>

            <div className="damage-section">

              <div className="damage-header">

                <strong>
                  Crop Damage
                </strong>

                <span>
                  {damage}%
                </span>

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
                  style={{
                    width: `${damage}%`,
                  }}
                ></div>

              </div>

            </div>

          </div>

          <div className="recommendation">

            <div className="recommendation-title">
              💡 What to do
            </div>

            <p>
              {recommendation}
            </p>

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

            <div className="details-panel">

              <h4>
                Details
              </h4>

              <p>
                {pestDetails}
              </p>

            </div>

          )}

        </div>

      )}

      {/* =========================
          SELECTED SCAN
      ========================= */}

      {selectedScan && (

        <div className="selected-scan-card">

          <h3>
            🔍 Scan Details —{" "}
            {selectedScan.crop}
          </h3>

          <p>
            <strong>
              Crop:
            </strong>{" "}
            {selectedScan.crop}
          </p>

          <p>
            <strong>
              Pest:
            </strong>{" "}
            {selectedScan.pest}
          </p>

          <p>
            <strong>
              Risk:
            </strong>{" "}

            <span
              className={`risk-${selectedScan.risk.toLowerCase()}`}
            >
              {selectedScan.risk}
            </span>

          </p>

          <div className="selected-damage">

            <div className="selected-damage-header">

              <strong>
                Damage:
              </strong>

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
            <strong>
              🕒 Scanned:
            </strong>{" "}
            {selectedScan.date}
          </p>

          <div
            className={`selected-recommendation selected-recommendation-${selectedScan.risk.toLowerCase()}`}
          >

            <strong>
              💡 What to do
            </strong>

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

      {/* =========================
          HISTORY
      ========================= */}

      <div className="history-card">

        <h3>
          📋 Scan History
        </h3>

        <p className="history-count">
          {history.length} / 10 scans
        </p>

        <button
          className="clear-history"
          onClick={() => {

            const confirmClear =
              window.confirm(
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

            <strong>
              No scan history
            </strong>

            <p>
              Your recent crop scans will
              appear here.
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

                <strong>
                  {item.crop}
                </strong>

                <span>
                  •
                </span>

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
                    ? item.recommendation.slice(
                        0,
                        80
                      ) + "..."
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