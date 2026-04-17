// ═══════════════════════════════════════════════════
// JOIN WORLD FLOW — Logic & Interactions
// ═══════════════════════════════════════════════════

(function initJoinFlow() {
  "use strict";

  // ── DOM Elements ──
  const joinCard = document.getElementById("joinCard");
  const joinLoading = document.getElementById("joinLoading");
  const joinSuccess = document.getElementById("joinSuccess");
  const joinForm = document.getElementById("joinForm");
  const joinDetected = document.getElementById("joinDetected");
  const joinDetectedCode = document.getElementById("joinDetectedCode");
  const joinCodeInput = document.getElementById("joinCodeInput");
  const joinBtn = document.getElementById("joinBtn");
  const joinError = document.getElementById("joinError");
  const enterWorldBtn = document.getElementById("enterWorldBtn");
  const joinSparkles = document.getElementById("joinSparkles");
  const joinParticles = document.getElementById("joinParticles");
  const joinYourName = document.getElementById("joinYourName");
  const joinPartnerName = document.getElementById("joinPartnerName");

  let inviteCode = "";
  let codeFromURL = false;

  // ── Read query parameter ──
  function getCodeFromURL() {
    const params = new URLSearchParams(window.location.search);
    return (params.get("code") || "").trim();
  }

  // ── Validate invite code format ──
  function isValidCode(code) {
    // Format: PW- followed by 4-8 alphanumeric characters
    return /^PW-[A-Z0-9]{4,8}$/i.test(code.trim());
  }

  // ── Initialize ──
  function init() {
    const urlCode = getCodeFromURL();

    if (urlCode) {
      // Auto-fill from URL
      inviteCode = urlCode.toUpperCase();
      codeFromURL = true;

      // Show detected code, hide manual input
      if (joinForm) joinForm.classList.add("hidden");
      if (joinDetected) {
        joinDetected.classList.remove("hidden");
        if (joinDetectedCode) joinDetectedCode.textContent = inviteCode;
      }
      if (joinBtn) joinBtn.disabled = false;
    } else {
      // Show manual input
      if (joinForm) joinForm.classList.remove("hidden");
      if (joinDetected) joinDetected.classList.add("hidden");
    }

    setupInputListeners();
    setupButtonListeners();
    spawnParticles();
  }

  // ── Input Validation ──
  function setupInputListeners() {
    if (!joinCodeInput) return;

    joinCodeInput.addEventListener("input", () => {
      const value = joinCodeInput.value.trim().toUpperCase();
      inviteCode = value;

      // Enable button if code looks valid
      if (joinBtn) {
        joinBtn.disabled = value.length < 5;
      }

      // Clear error on typing
      if (joinError) {
        joinError.classList.add("hidden");
        joinError.textContent = "";
      }
    });

    // Auto-uppercase
    joinCodeInput.addEventListener("keyup", () => {
      const pos = joinCodeInput.selectionStart;
      joinCodeInput.value = joinCodeInput.value.toUpperCase();
      joinCodeInput.setSelectionRange(pos, pos);
    });

    // Submit on Enter
    joinCodeInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (joinBtn && !joinBtn.disabled) {
          joinBtn.click();
        }
      }
    });
  }

  // ── Button Handlers ──
  function setupButtonListeners() {
    // Join button
    if (joinBtn) {
      joinBtn.addEventListener("click", () => {
        handleJoin();
      });
    }

    // Enter World button
    if (enterWorldBtn) {
      enterWorldBtn.addEventListener("click", () => {
        // Navigate to main app
        window.location.href = "index.html";
      });
    }
  }

  // ── Join Handler ──
  function handleJoin() {
    const code = inviteCode.trim();

    // Empty check
    if (!code) {
      showError("Please enter an invite code");
      return;
    }

    // Format validation
    if (!isValidCode(code)) {
      showError("Invalid invite code. Format should be PW-XXXXXX");
      return;
    }

    // Clear any errors
    hideError();

    // Show loading state
    transitionToLoading();

    // Simulate verification delay (1.8 seconds)
    setTimeout(() => {
      transitionToSuccess(code);
    }, 1800);
  }

  // ── Error Handling ──
  function showError(message) {
    if (!joinError) return;
    joinError.textContent = "⚠️ " + message;
    joinError.classList.remove("hidden");

    // Re-trigger shake animation
    joinError.style.animation = "none";
    joinError.offsetHeight;
    joinError.style.animation = "";

    // Shake the input
    if (joinCodeInput) {
      joinCodeInput.style.animation = "none";
      joinCodeInput.offsetHeight;
      joinCodeInput.style.animation = "joinShake 0.45s ease";
      joinCodeInput.style.borderColor = "#d63966";
      setTimeout(() => {
        joinCodeInput.style.borderColor = "";
        joinCodeInput.style.animation = "";
      }, 500);
    }
  }

  function hideError() {
    if (!joinError) return;
    joinError.classList.add("hidden");
    joinError.textContent = "";
  }

  // ── State Transitions ──
  function transitionToLoading() {
    // Fade out card
    if (joinCard) {
      joinCard.style.transition = "opacity 0.35s ease, transform 0.35s ease";
      joinCard.style.opacity = "0";
      joinCard.style.transform = "scale(0.95)";
    }

    setTimeout(() => {
      if (joinCard) joinCard.classList.add("hidden");
      if (joinLoading) joinLoading.classList.remove("hidden");
    }, 350);
  }

  function transitionToSuccess(code) {
    // Load partner data from localStorage if available
    loadPartnerData();

    // Fade out loading
    if (joinLoading) {
      joinLoading.style.transition = "opacity 0.3s ease";
      joinLoading.style.opacity = "0";
    }

    setTimeout(() => {
      if (joinLoading) joinLoading.classList.add("hidden");
      if (joinSuccess) joinSuccess.classList.remove("hidden");

      // Save join data
      localStorage.setItem("privateWorldJoined", "true");
      localStorage.setItem("privateWorldJoinCode", code);
      localStorage.setItem("privateWorldEntryUnlocked", "true");

      // Spawn sparkle effects
      spawnSparkles();
    }, 300);
  }

  // ── Load Partner Data ──
  function loadPartnerData() {
    try {
      const data = JSON.parse(localStorage.getItem("privateWorldData") || "{}");
      if (data.yourName && joinPartnerName) {
        joinPartnerName.textContent = data.yourName;
      }
      if (data.partnerName && joinYourName) {
        joinYourName.textContent = data.partnerName;
      }
    } catch {
      // Fallback — keep defaults
    }
  }

  // ── Sparkle Effects ──
  function spawnSparkles() {
    if (!joinSparkles) return;
    const emojis = ["✨", "💖", "💗", "⭐", "💕", "🌟", "💫"];

    for (let i = 0; i < 16; i++) {
      const sparkle = document.createElement("span");
      sparkle.className = "join-sparkle-item";
      sparkle.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      // Random position from center
      const angle = (Math.PI * 2 * i) / 16;
      const distance = 80 + Math.random() * 120;
      const sx = Math.cos(angle) * distance;
      const sy = Math.sin(angle) * distance;

      sparkle.style.left = "50%";
      sparkle.style.top = "40%";
      sparkle.style.setProperty("--sx", `${sx}px`);
      sparkle.style.setProperty("--sy", `${sy}px`);
      sparkle.style.animationDelay = `${Math.random() * 0.4}s`;
      sparkle.style.fontSize = `${0.7 + Math.random() * 0.8}rem`;

      joinSparkles.appendChild(sparkle);

      // Clean up after animation
      setTimeout(() => sparkle.remove(), 1600);
    }
  }

  // ── Background Particles ──
  function spawnParticles() {
    if (!joinParticles) return;
    const hearts = ["💗", "💕", "💖", "✨"];

    function createParticle() {
      const p = document.createElement("span");
      p.className = "join-particle";
      p.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      p.style.left = `${Math.random() * 100}vw`;
      p.style.bottom = "-30px";
      p.style.animationDuration = `${5 + Math.random() * 6}s`;
      p.style.fontSize = `${0.7 + Math.random() * 0.6}rem`;
      joinParticles.appendChild(p);
      setTimeout(() => p.remove(), 11000);
    }

    // Initial burst
    for (let i = 0; i < 3; i++) {
      setTimeout(createParticle, i * 400);
    }

    // Continuous
    setInterval(createParticle, 1500);
  }

  // ── Start ──
  init();
})();
