const herName = "Private World";
const metDate = "2025-12-11T00:00:00";
const defaultNextDate = "2026-03-14T19:00:00";
const password = "PWFC2026";
const nextMeetStorageKey = "loveStoryNextMeetDate";
const entryAccessStorageKey = "privateWorldEntryUnlocked";
const fixedInviteCode = "PWFC2026";
let nextDate = localStorage.getItem(nextMeetStorageKey) || defaultNextDate;

// Premium entry gate.
const entryGate = document.getElementById("entryGate");
const privateWorldApp = document.getElementById("privateWorldApp");
const createWorldBtn = document.getElementById("createWorldBtn");
const showInviteBtn = document.getElementById("showInviteBtn");
const inviteForm = document.getElementById("inviteForm");
const inviteCodeInput = document.getElementById("inviteCodeInput");
const inviteError = document.getElementById("inviteError");
const entryMessage = document.getElementById("entryMessage");

function unlockPrivateWorld() {
  if (entryGate) entryGate.classList.add("hidden");
  if (privateWorldApp) privateWorldApp.classList.remove("hidden");
  localStorage.setItem(entryAccessStorageKey, "true");
  window.scrollTo(0, 0);
}

function showInviteJoin() {
  if (inviteForm) inviteForm.classList.remove("hidden");
  if (inviteError) inviteError.classList.add("hidden");
  if (entryMessage) {
    entryMessage.textContent =
      "Paste the private invite code your partner sent you to unlock your shared space.";
  }
  if (inviteCodeInput) inviteCodeInput.focus();
}

if (localStorage.getItem(entryAccessStorageKey) === "true") {
  unlockPrivateWorld();
}

if (createWorldBtn) {
  createWorldBtn.addEventListener("click", () => {
    // Show the Create World flow instead of directly unlocking
    if (entryGate) entryGate.classList.add("hidden");
    const cwFlow = document.getElementById("createWorldFlow");
    if (cwFlow) cwFlow.classList.remove("hidden");
    window.scrollTo(0, 0);
  });
}

if (showInviteBtn) {
  showInviteBtn.addEventListener("click", () => {
    showInviteJoin();
  });
}

if (inviteForm) {
  inviteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const inviteCode = (inviteCodeInput?.value || "").trim();
    if (inviteCode.toUpperCase() !== fixedInviteCode) {
      if (inviteError) {
        inviteError.textContent = "That invite code does not match. Use PWFC2026 for the product demo.";
        inviteError.classList.remove("hidden");
      }
      return;
    }
    if (inviteError) inviteError.classList.add("hidden");
    unlockPrivateWorld();
  });
}

// ═══════════════════════════════════════════════════
// CREATE WORLD FLOW — Multi-step onboarding logic
// ═══════════════════════════════════════════════════

(function initCreateWorldFlow() {
  const cwFlow = document.getElementById("createWorldFlow");
  if (!cwFlow) return;

  // State
  let currentStep = 1;
  let cwData = { yourName: "", partnerName: "", anniversary: "", theme: "" };

  // DOM refs
  const steps = [
    document.getElementById("cwStep1"),
    document.getElementById("cwStep2"),
    document.getElementById("cwStep3")
  ];
  const progressFill = document.getElementById("cwProgressFill");
  const stepDots = cwFlow.querySelectorAll(".cw-step-dot");
  const yourNameInput = document.getElementById("cwYourName");
  const partnerNameInput = document.getElementById("cwPartnerName");
  const anniversaryInput = document.getElementById("cwAnniversary");
  const nextBtn1 = document.getElementById("cwNext1");
  const backToEntry = document.getElementById("cwBackToEntry");
  const nextBtn2 = document.getElementById("cwNext2");
  const backBtn2 = document.getElementById("cwBack2");
  const backBtn3 = document.getElementById("cwBack3");
  const enterWorldBtn = document.getElementById("cwEnterWorld");
  const themeCards = cwFlow.querySelectorAll(".cw-theme-card");
  const inviteCodeEl = document.getElementById("cwInviteCode");
  const copyCodeBtn = document.getElementById("cwCopyCode");
  const copyFeedback = document.getElementById("cwCopyFeedback");
  const shareLinkBtn = document.getElementById("cwShareLink");
  const shareWhatsappBtn = document.getElementById("cwShareWhatsapp");
  const partnerDisplayEl = document.getElementById("cwPartnerDisplay");

  // Generate random invite code
  function generateInviteCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "PW-";
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }

  // Update progress indicator
  function updateProgress() {
    const pct = (currentStep / 3) * 100;
    if (progressFill) progressFill.style.width = `${pct}%`;

    stepDots.forEach((dot) => {
      const step = Number(dot.dataset.step);
      dot.classList.remove("active", "completed");
      if (step === currentStep) dot.classList.add("active");
      else if (step < currentStep) dot.classList.add("completed");
    });
  }

  // Show specific step
  function goToStep(step) {
    currentStep = step;
    steps.forEach((panel, idx) => {
      if (!panel) return;
      if (idx + 1 === step) {
        panel.classList.add("active");
        // Re-trigger animation
        panel.style.animation = "none";
        panel.offsetHeight; // reflow
        panel.style.animation = "";
      } else {
        panel.classList.remove("active");
      }
    });
    updateProgress();

    // When reaching step 3, generate code + set partner name
    if (step === 3) {
      const code = generateInviteCode();
      if (inviteCodeEl) inviteCodeEl.textContent = code;
      if (partnerDisplayEl && cwData.partnerName) {
        partnerDisplayEl.textContent = cwData.partnerName;
      }
    }
  }

  // Step 1 validation
  function validateStep1() {
    const yourName = (yourNameInput?.value || "").trim();
    const partnerName = (partnerNameInput?.value || "").trim();
    const valid = yourName.length > 0 && partnerName.length > 0;
    if (nextBtn1) nextBtn1.disabled = !valid;
    return valid;
  }

  if (yourNameInput) yourNameInput.addEventListener("input", validateStep1);
  if (partnerNameInput) partnerNameInput.addEventListener("input", validateStep1);

  // Step 1 → Step 2
  if (nextBtn1) {
    nextBtn1.addEventListener("click", () => {
      if (!validateStep1()) return;
      cwData.yourName = (yourNameInput?.value || "").trim();
      cwData.partnerName = (partnerNameInput?.value || "").trim();
      cwData.anniversary = (anniversaryInput?.value || "").trim();
      goToStep(2);
    });
  }

  // Back to Entry Gate
  if (backToEntry) {
    backToEntry.addEventListener("click", () => {
      cwFlow.classList.add("hidden");
      if (entryGate) entryGate.classList.remove("hidden");
      window.scrollTo(0, 0);
    });
  }

  // Step 2 — Theme selection
  themeCards.forEach((card) => {
    card.addEventListener("click", () => {
      themeCards.forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");
      cwData.theme = card.dataset.theme;
      if (nextBtn2) nextBtn2.disabled = false;
    });
  });

  // Step 2 → Step 3
  if (nextBtn2) {
    nextBtn2.addEventListener("click", () => {
      if (!cwData.theme) return;
      goToStep(3);
    });
  }

  // Step 2 ← Back
  if (backBtn2) {
    backBtn2.addEventListener("click", () => goToStep(1));
  }

  // Step 3 ← Back
  if (backBtn3) {
    backBtn3.addEventListener("click", () => goToStep(2));
  }

  // Copy invite code
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener("click", () => {
      const code = inviteCodeEl?.textContent || "";
      navigator.clipboard.writeText(code).then(() => {
        if (copyFeedback) {
          copyFeedback.classList.remove("hidden");
          setTimeout(() => copyFeedback.classList.add("hidden"), 2000);
        }
        const copyText = copyCodeBtn.querySelector(".cw-copy-text");
        if (copyText) {
          copyText.textContent = "Copied!";
          setTimeout(() => { copyText.textContent = "Copy"; }, 2000);
        }
      }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        if (copyFeedback) {
          copyFeedback.classList.remove("hidden");
          setTimeout(() => copyFeedback.classList.add("hidden"), 2000);
        }
      });
    });
  }

  // Share Link (UI demo only)
  if (shareLinkBtn) {
    shareLinkBtn.addEventListener("click", () => {
      const code = inviteCodeEl?.textContent || "";
      const shareText = `Join my Private World! 💖 Use invite code: ${code}`;
      if (navigator.share) {
        navigator.share({ title: "Private World Invite", text: shareText }).catch(() => {});
      } else {
        navigator.clipboard.writeText(shareText).catch(() => {});
        alert("Invite link copied to clipboard! 💌");
      }
    });
  }

  // Share via WhatsApp (UI demo)
  if (shareWhatsappBtn) {
    shareWhatsappBtn.addEventListener("click", () => {
      const code = inviteCodeEl?.textContent || "";
      const message = encodeURIComponent(`Hey! 💖 Join my Private World! Use invite code: ${code}`);
      window.open(`https://wa.me/?text=${message}`, "_blank");
    });
  }

  // Enter World — save data to localStorage and unlock
  if (enterWorldBtn) {
    enterWorldBtn.addEventListener("click", () => {
      // Save world data
      localStorage.setItem("privateWorldData", JSON.stringify(cwData));

      // Update the hero name if partner name is provided
      const herNameEl = document.getElementById("herName");
      if (herNameEl && cwData.partnerName) {
        herNameEl.textContent = cwData.partnerName + "'s World";
      }

      // Update anniversary if provided
      if (cwData.anniversary) {
        const sinceDateEl = document.getElementById("sinceDate");
        if (sinceDateEl) sinceDateEl.textContent = cwData.anniversary;
      }

      // Hide flow, unlock world
      cwFlow.classList.add("hidden");
      unlockPrivateWorld();
    });
  }

  // Initialize
  updateProgress();
})();


// Personalize simple text values.
document.getElementById("herName").textContent = herName;
document.getElementById("sinceDate").textContent = metDate.slice(0, 10);
document.getElementById("nextDate").textContent = nextDate.replace("T", " ");
const nextMeetInput = document.getElementById("nextMeetInput");
if (nextMeetInput) nextMeetInput.value = nextDate;

// Scroll reveal.
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Smooth start button.
document.getElementById("scrollStart").addEventListener("click", () => {
  document.getElementById("timeline").scrollIntoView({ behavior: "smooth" });
});

// Side miss-you ping button (SMS helper).
const missYouBtn = document.getElementById("missYouBtn");
if (missYouBtn) {
  missYouBtn.addEventListener("click", () => {
    window.open("https://www.instagram.com/", "_blank");
  });
}

// Background music toggle.
const audio = document.getElementById("ourSong");
const musicBtn = document.getElementById("musicToggle");
let playing = false;
musicBtn.addEventListener("click", async () => {
  try {
    if (!playing) {
      await audio.play();
      musicBtn.textContent = "Pause Demo Atmosphere";
    } else {
      audio.pause();
      musicBtn.textContent = "Play Demo Atmosphere";
    }
    playing = !playing;
  } catch {
    musicBtn.textContent = "Add assets/our-song.mp3";
  }
});

// Beauty notes cards.
const beautyNotes = [
  "Your eyes are so beautiful, I first fell for your eyes and later for you",
  "When you smile, your eyes smile too",
  "Even when you cry, you look so cute",
  "When you open your hair, you look beautiful",
  "You look stunning in traditional outfits",
  "Your cute little habits make me smile",
  "When you try to act cute, it works every time",
  "Your voice feels soft and addictive",
  "Your laugh is my favorite sound",
  "Your hugs feel warm, safe, and peaceful",
  "Your face in random moments looks unreal",
  "Your expressions are naturally pretty",
  "The way you carry yourself is beautiful",
  "Your simple look is still my weakness",
  "You look beautiful in every mood"
];

const reasonsGrid = document.getElementById("reasonsGrid");
beautyNotes.forEach((note, idx) => {
  const card = document.createElement("article");
  card.className = "reason-card";
  card.innerHTML = `
    <div class="reason-inner">
      <div class="reason-face reason-front"><strong>Beauty Note #${idx + 1}</strong><br />Tap to reveal</div>
      <div class="reason-face reason-back">${note} 💖</div>
    </div>
  `;
  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
    card.classList.remove("love-hit");
    void card.offsetWidth;
    card.classList.add("love-hit");
    setTimeout(() => card.classList.remove("love-hit"), 700);
  });
  reasonsGrid.appendChild(card);
});

// Floating hearts animation.
function spawnHeart() {
  const heart = document.createElement("div");
  heart.className = "float-heart";
  heart.textContent = "💗";
  heart.style.left = `${Math.random() * 100}vw`;
  heart.style.animationDuration = `${4 + Math.random() * 5}s`;
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 9000);
}
setInterval(spawnHeart, 1200);

// Catch-the-hearts game.
const gameArea = document.getElementById("gameArea");
const basket = document.getElementById("basket");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const resultEl = document.getElementById("gameResult");
const highScoreValueEl = document.getElementById("highScoreValue");
const highScoreByEl = document.getElementById("highScoreBy");
const gamePlayerSelect = document.getElementById("gamePlayerSelect");
const gameScoreStorageKey = "loveStoryGameHighScore";
let gameTimer;
let heartTimer;
let timeLeft = 30;
let score = 0;
let basketX = gameArea.clientWidth / 2;
let highScore = { score: 0, by: "Not set" };

try {
  const savedScore = JSON.parse(localStorage.getItem(gameScoreStorageKey) || "{}");
  if (Number.isFinite(savedScore.score) && typeof savedScore.by === "string") {
    highScore = {
      score: savedScore.score,
      by: savedScore.by || "Not set"
    };
  }
} catch {}

function renderHighScore() {
  if (highScoreValueEl) highScoreValueEl.textContent = String(highScore.score || 0);
  if (highScoreByEl) highScoreByEl.textContent = highScore.by || "Not set";
}

renderHighScore();

function moveBasket(x) {
  const min = 20;
  const max = gameArea.clientWidth - 20;
  basketX = Math.min(max, Math.max(min, x));
  basket.style.left = `${basketX}px`;
}

document.addEventListener("mousemove", (e) => {
  const rect = gameArea.getBoundingClientRect();
  if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
    moveBasket(e.clientX - rect.left);
  }
});

gameArea.addEventListener("touchmove", (e) => {
  const rect = gameArea.getBoundingClientRect();
  moveBasket(e.touches[0].clientX - rect.left);
});

function dropHeart() {
  const heart = document.createElement("span");
  heart.className = "falling-heart";
  heart.textContent = "❤️";
  const x = Math.random() * (gameArea.clientWidth - 26);
  let y = -20;
  heart.style.left = `${x}px`;
  gameArea.appendChild(heart);

  const fall = setInterval(() => {
    y += 3.4;
    heart.style.top = `${y}px`;

    const basketCenter = basketX;
    const heartCenter = x + 12;
    if (y > gameArea.clientHeight - 45 && Math.abs(basketCenter - heartCenter) < 32) {
      score += 1;
      scoreEl.textContent = score;
      heart.remove();
      clearInterval(fall);
    }

    if (y > gameArea.clientHeight + 12) {
      heart.remove();
      clearInterval(fall);
    }
  }, 16);
}

function endGame() {
  clearInterval(gameTimer);
  clearInterval(heartTimer);
  const playerName = gamePlayerSelect?.value || "Partner One";
  if (score > highScore.score) {
    highScore = { score, by: playerName };
    localStorage.setItem(gameScoreStorageKey, JSON.stringify(highScore));
    renderHighScore();
    resultEl.textContent = `Final score: ${score}. New highest score by ${playerName}. Beat this record!`;
    return;
  }
  resultEl.textContent = `Final score: ${score}. Beat this record!`;
}

document.getElementById("startGame").addEventListener("click", () => {
  score = 0;
  timeLeft = 30;
  scoreEl.textContent = "0";
  timeEl.textContent = "30";
  resultEl.textContent = "";

  gameArea.querySelectorAll(".falling-heart").forEach((h) => h.remove());

  clearInterval(gameTimer);
  clearInterval(heartTimer);

  gameTimer = setInterval(() => {
    timeLeft -= 1;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  heartTimer = setInterval(dropHeart, 580);
});

// Time counters.
function getDiffParts(ms) {
  const total = Math.max(ms, 0);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((total / (1000 * 60)) % 60);
  const secs = Math.floor((total / 1000) % 60);
  return { days, hours, mins, secs };
}

function updateCounters() {
  const now = Date.now();
  const since = new Date(metDate).getTime();
  const date = new Date(nextDate).getTime();

  const together = getDiffParts(now - since);
  const countdown = getDiffParts(date - now);

  document.getElementById("timeTogether").textContent = `${together.days}d ${together.hours}h ${together.mins}m ${together.secs}s`;
  document.getElementById("nextDateCountdown").textContent = `${countdown.days}d ${countdown.hours}h ${countdown.mins}m ${countdown.secs}s`;
}
setInterval(updateCounters, 1000);
updateCounters();

const saveNextMeetBtn = document.getElementById("saveNextMeet");
if (saveNextMeetBtn) {
  saveNextMeetBtn.addEventListener("click", () => {
    const picked = (nextMeetInput?.value || "").trim();
    if (!picked) return;
    nextDate = picked;
    localStorage.setItem(nextMeetStorageKey, nextDate);
    document.getElementById("nextDate").textContent = nextDate.replace("T", " ");
    updateCounters();
  });
}

// Movie night planner.
const movieStorageKey = "loveStoryMovies";
const movieSuggestInput = document.getElementById("movieSuggestInput");
const addMovieSuggestBtn = document.getElementById("addMovieSuggest");
const movieSuggestList = document.getElementById("movieSuggestList");
const movieWatchedInput = document.getElementById("movieWatchedInput");
const movieRatingInput = document.getElementById("movieRatingInput");
const addMovieWatchedBtn = document.getElementById("addMovieWatched");
const movieWatchedList = document.getElementById("movieWatchedList");

function loadMovies() {
  try {
    const parsed = JSON.parse(localStorage.getItem(movieStorageKey) || "{}");
    return {
      watchlist: Array.isArray(parsed.watchlist) ? parsed.watchlist : [],
      watched: Array.isArray(parsed.watched) ? parsed.watched : []
    };
  } catch {
    return { watchlist: [], watched: [] };
  }
}

function saveMovies(data) {
  localStorage.setItem(movieStorageKey, JSON.stringify(data));
}

let moviesData = loadMovies();

function renderMovieLists() {
  if (movieSuggestList) {
    if (!moviesData.watchlist.length) {
      movieSuggestList.innerHTML = "<p class=\"section-intro\">No movie added yet.</p>";
    } else {
      movieSuggestList.innerHTML = moviesData.watchlist
        .map(
          (movie, idx) => `
          <article class="movie-item">
            <div class="movie-item-main">
              <p class="movie-title">${movie.title}</p>
              <p class="movie-sub">To watch together</p>
            </div>
            <button class="movie-del" data-type="watchlist" data-index="${idx}">Delete</button>
          </article>
        `
        )
        .join("");
    }
  }

  if (movieWatchedList) {
    if (!moviesData.watched.length) {
      movieWatchedList.innerHTML = "<p class=\"section-intro\">No watched movie saved yet.</p>";
    } else {
      movieWatchedList.innerHTML = moviesData.watched
        .map(
          (movie, idx) => `
          <article class="movie-item">
            <div class="movie-item-main">
              <p class="movie-title">${movie.title}</p>
              <p class="movie-sub">Rating: ${movie.rating}/5</p>
            </div>
            <button class="movie-del" data-type="watched" data-index="${idx}">Delete</button>
          </article>
        `
        )
        .join("");
    }
  }

  document.querySelectorAll(".movie-del").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      const index = Number(btn.dataset.index);
      if (!Number.isInteger(index)) return;
      if (type === "watchlist") moviesData.watchlist.splice(index, 1);
      if (type === "watched") moviesData.watched.splice(index, 1);
      saveMovies(moviesData);
      renderMovieLists();
    });
  });
}

if (addMovieSuggestBtn) {
  addMovieSuggestBtn.addEventListener("click", () => {
    const title = (movieSuggestInput?.value || "").trim();
    if (!title) return;
    moviesData.watchlist.push({ title });
    saveMovies(moviesData);
    renderMovieLists();
    movieSuggestInput.value = "";
  });
}

if (addMovieWatchedBtn) {
  addMovieWatchedBtn.addEventListener("click", () => {
    const title = (movieWatchedInput?.value || "").trim();
    const rating = Number(movieRatingInput?.value || 5);
    if (!title) return;
    moviesData.watched.push({ title, rating });
    saveMovies(moviesData);
    renderMovieLists();
    movieWatchedInput.value = "";
    if (movieRatingInput) movieRatingInput.value = "5";
  });
}

renderMovieLists();

// Watch together sync.
const watchSyncStorageKey = "loveStoryWatchSyncPlan";
const watchSyncChatStorageKey = "loveStoryWatchSyncChat";
const syncMovieTitleInput = document.getElementById("syncMovieTitle");
const syncMovieTimeInput = document.getElementById("syncMovieTime");
const saveSyncPlanBtn = document.getElementById("saveSyncPlan");
const syncPlanView = document.getElementById("syncPlanView");
const syncCountdown = document.getElementById("syncCountdown");
const syncChatAuthor = document.getElementById("syncChatAuthor");
const syncChatInput = document.getElementById("syncChatInput");
const addSyncChatBtn = document.getElementById("addSyncChat");
const syncChatList = document.getElementById("syncChatList");
let watchPlan = { title: "", time: "" };
let watchChat = [];

function formatLocalDateTime(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

function loadWatchSync() {
  try {
    const parsed = JSON.parse(localStorage.getItem(watchSyncStorageKey) || "{}");
    watchPlan = {
      title: typeof parsed.title === "string" ? parsed.title : "",
      time: typeof parsed.time === "string" ? parsed.time : ""
    };
  } catch {
    watchPlan = { title: "", time: "" };
  }

  try {
    const parsedChat = JSON.parse(localStorage.getItem(watchSyncChatStorageKey) || "[]");
    watchChat = Array.isArray(parsedChat) ? parsedChat : [];
  } catch {
    watchChat = [];
  }
}

function saveWatchSync() {
  localStorage.setItem(watchSyncStorageKey, JSON.stringify(watchPlan));
}

function saveWatchChat() {
  localStorage.setItem(watchSyncChatStorageKey, JSON.stringify(watchChat));
}

function renderWatchPlan() {
  if (!syncPlanView || !syncCountdown) return;
  if (!watchPlan.title || !watchPlan.time) {
    syncPlanView.textContent = "No sync plan saved yet.";
    syncCountdown.textContent = "";
    return;
  }
  syncPlanView.textContent = `Movie: ${watchPlan.title} | Start: ${formatLocalDateTime(watchPlan.time)}`;
  const diff = new Date(watchPlan.time).getTime() - Date.now();
  if (Number.isNaN(diff)) {
    syncCountdown.textContent = "";
    return;
  }
  if (diff <= 0) {
    syncCountdown.textContent = "Time is here. Press play together now 🍿";
    return;
  }
  const left = getDiffParts(diff);
  syncCountdown.textContent = `Starts in ${left.days}d ${left.hours}h ${left.mins}m ${left.secs}s`;
}

function renderWatchChat() {
  if (!syncChatList) return;
  if (!watchChat.length) {
    syncChatList.innerHTML = "<p class=\"section-intro\">No chat yet. Send first reaction.</p>";
    return;
  }

  syncChatList.innerHTML = watchChat
    .slice()
    .reverse()
    .map(
      (item) => `
      <article class="sync-chat-item">
        <div class="sync-chat-head">
          <strong>${item.author}</strong>
          <span>${formatLocalDateTime(item.createdAt)}</span>
        </div>
        <p class="sync-chat-text">${item.text}</p>
      </article>
    `
    )
    .join("");
}

if (saveSyncPlanBtn) {
  saveSyncPlanBtn.addEventListener("click", () => {
    const title = (syncMovieTitleInput?.value || "").trim();
    const time = (syncMovieTimeInput?.value || "").trim();
    if (!title || !time) return;
    watchPlan = { title, time };
    saveWatchSync();
    renderWatchPlan();
  });
}

if (addSyncChatBtn) {
  addSyncChatBtn.addEventListener("click", () => {
    const author = (syncChatAuthor?.value || "Partner One").trim();
    const text = (syncChatInput?.value || "").trim();
    if (!text) return;
    watchChat.push({ author, text, createdAt: new Date().toISOString() });
    saveWatchChat();
    renderWatchChat();
    if (syncChatInput) syncChatInput.value = "";
  });
}

// Shared goals tracker.
const goalsStorageKey = "loveStorySharedGoals";
const goalTitleInput = document.getElementById("goalTitleInput");
const goalTargetInput = document.getElementById("goalTargetInput");
const goalTypeInput = document.getElementById("goalTypeInput");
const goalOwnerInput = document.getElementById("goalOwnerInput");
const goalStatusInput = document.getElementById("goalStatusInput");
const goalFilterInput = document.getElementById("goalFilterInput");
const addGoalBtn = document.getElementById("addGoalBtn");
const goalsList = document.getElementById("goalsList");
let goalsData = [];

function loadGoals() {
  try {
    const parsed = JSON.parse(localStorage.getItem(goalsStorageKey) || "[]");
    goalsData = Array.isArray(parsed)
      ? parsed.map((goal) => ({
          title: typeof goal.title === "string" ? goal.title : "",
          target: typeof goal.target === "string" ? goal.target : "",
          type: typeof goal.type === "string" ? goal.type : "Other",
          owner: typeof goal.owner === "string" ? goal.owner : "Both",
          status: typeof goal.status === "string" ? goal.status : "Planning",
          progress: Math.min(100, Math.max(0, Number(goal.progress) || 0))
        }))
      : [];
  } catch {
    goalsData = [];
  }
}

function saveGoals() {
  localStorage.setItem(goalsStorageKey, JSON.stringify(goalsData));
}

function syncGoalStatusWithProgress(goal) {
  const p = Number(goal.progress) || 0;
  if (p >= 100) {
    goal.status = "Completed";
    goal.progress = 100;
    return;
  }
  if (p <= 0) {
    goal.status = "Planning";
    goal.progress = 0;
    return;
  }
  goal.status = "In Progress";
}

function renderGoals() {
  if (!goalsList) return;
  const filter = goalFilterInput?.value || "All";
  const filteredGoals = goalsData
    .map((goal, idx) => ({ goal, idx }))
    .filter(({ goal }) => filter === "All" || goal.status === filter);

  if (!filteredGoals.length) {
    goalsList.innerHTML = "<p class=\"section-intro\">No goals for this filter yet.</p>";
    return;
  }

  goalsList.innerHTML = filteredGoals
    .map(
      ({ goal, idx }) => `
      <article class="goal-item" data-goal-index="${idx}">
        <div class="goal-head">
          <p class="goal-title">${goal.title}</p>
          <span class="goal-target">${goal.target ? `Target: ${goal.target}` : "No date"}</span>
        </div>
        <div class="goal-meta-line">
          <span class="goal-badge">${goal.type}</span>
          <span class="goal-badge">${goal.owner}</span>
          <span class="goal-badge ${
            goal.status === "Completed"
              ? "status-completed"
              : goal.status === "In Progress"
                ? "status-progress"
                : "status-planning"
          }">${goal.status}</span>
        </div>
        <div class="goal-progress-row">
          <input class="goal-progress" type="range" min="0" max="100" step="5" value="${goal.progress}" data-goal-range="${idx}" />
          <span class="goal-progress-val">${goal.progress}%</span>
        </div>
        <div class="goal-actions">
          <button class="goal-small-btn" data-goal-plus="${idx}">+10%</button>
          <button class="goal-small-btn" data-goal-minus="${idx}">-10%</button>
          <button class="goal-small-btn" data-goal-done="${idx}">Mark Done</button>
          <button class="goal-small-btn" data-goal-delete="${idx}">Delete</button>
        </div>
      </article>
    `
    )
    .join("");
}

if (addGoalBtn) {
  addGoalBtn.addEventListener("click", () => {
    const title = (goalTitleInput?.value || "").trim();
    const target = (goalTargetInput?.value || "").trim();
    const type = (goalTypeInput?.value || "Other").trim();
    const owner = (goalOwnerInput?.value || "Both").trim();
    const status = (goalStatusInput?.value || "Planning").trim();
    if (!title) return;
    goalsData.push({
      title,
      target,
      type,
      owner,
      status,
      progress: status === "Completed" ? 100 : 0
    });
    saveGoals();
    renderGoals();
    if (goalTitleInput) goalTitleInput.value = "";
    if (goalTargetInput) goalTargetInput.value = "";
    if (goalTypeInput) goalTypeInput.value = "Travel";
    if (goalOwnerInput) goalOwnerInput.value = "Both";
    if (goalStatusInput) goalStatusInput.value = "Planning";
  });
}

if (goalFilterInput) {
  goalFilterInput.addEventListener("change", () => {
    renderGoals();
  });
}

if (goalsList) {
  goalsList.addEventListener("input", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (!target.dataset.goalRange) return;
    const idx = Number(target.dataset.goalRange);
    if (!Number.isInteger(idx) || !goalsData[idx]) return;
    goalsData[idx].progress = Number(target.value) || 0;
    syncGoalStatusWithProgress(goalsData[idx]);
    saveGoals();
    renderGoals();
  });

  goalsList.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    const plusIdx = Number(target.dataset.goalPlus);
    if (Number.isInteger(plusIdx) && goalsData[plusIdx]) {
      goalsData[plusIdx].progress = Math.min(100, (Number(goalsData[plusIdx].progress) || 0) + 10);
      syncGoalStatusWithProgress(goalsData[plusIdx]);
      saveGoals();
      renderGoals();
      return;
    }

    const minusIdx = Number(target.dataset.goalMinus);
    if (Number.isInteger(minusIdx) && goalsData[minusIdx]) {
      goalsData[minusIdx].progress = Math.max(0, (Number(goalsData[minusIdx].progress) || 0) - 10);
      syncGoalStatusWithProgress(goalsData[minusIdx]);
      saveGoals();
      renderGoals();
      return;
    }

    const delIdx = Number(target.dataset.goalDelete);
    if (Number.isInteger(delIdx) && goalsData[delIdx]) {
      goalsData.splice(delIdx, 1);
      saveGoals();
      renderGoals();
      return;
    }

    const doneIdx = Number(target.dataset.goalDone);
    if (Number.isInteger(doneIdx) && goalsData[doneIdx]) {
      goalsData[doneIdx].status = "Completed";
      goalsData[doneIdx].progress = 100;
      saveGoals();
      renderGoals();
    }
  });
}

loadWatchSync();
renderWatchPlan();
renderWatchChat();
setInterval(renderWatchPlan, 1000);

loadGoals();
renderGoals();

// Date jar.
const dateJarIdeas = [
  "Sunset walk + one kulhad chai date",
  "Street food challenge: 5 stalls, 1 winner",
  "Temple visit and quiet talk evening",
  "Metro ride with no destination, just us",
  "One-hour photo walk and 10 candid clicks",
  "Mini cafe date and write one note for each other",
  "Late night call + same song on both phones",
  "Bookstore date and pick one book for each other",
  "Ice cream + random questions game",
  "Simple drive and no phone for 45 minutes"
];
const dateJarStorageKey = "loveStoryDateJarIdea";
const dateJarIdeaEl = document.getElementById("dateJarIdea");
const shuffleDateIdeaBtn = document.getElementById("shuffleDateIdea");
const saveDateIdeaBtn = document.getElementById("saveDateIdea");
const dateJarSavedMsgEl = document.getElementById("dateJarSavedMsg");

function renderDateIdea(text) {
  if (!dateJarIdeaEl) return;
  dateJarIdeaEl.textContent = text;
  dateJarIdeaEl.classList.remove("pop");
  void dateJarIdeaEl.offsetWidth;
  dateJarIdeaEl.classList.add("pop");
}

const savedDateIdea = localStorage.getItem(dateJarStorageKey);
if (savedDateIdea && dateJarIdeaEl) {
  dateJarIdeaEl.textContent = savedDateIdea;
}

if (shuffleDateIdeaBtn) {
  shuffleDateIdeaBtn.addEventListener("click", () => {
    const randomIdea = dateJarIdeas[Math.floor(Math.random() * dateJarIdeas.length)];
    renderDateIdea(randomIdea);
    if (dateJarSavedMsgEl) dateJarSavedMsgEl.classList.add("hidden");
  });
}

if (saveDateIdeaBtn) {
  saveDateIdeaBtn.addEventListener("click", () => {
    const currentIdea = (dateJarIdeaEl?.textContent || "").trim();
    if (!currentIdea) return;
    localStorage.setItem(dateJarStorageKey, currentIdea);
    if (dateJarSavedMsgEl) {
      dateJarSavedMsgEl.classList.remove("hidden");
      setTimeout(() => dateJarSavedMsgEl.classList.add("hidden"), 1400);
    }
  });
}

// Date approval flow: suggest -> approve -> set date.
const dateProposalStorageKey = "loveStoryDateProposalFlow";
const dateProposedByEl = document.getElementById("dateProposedBy");
const dateProposalInputEl = document.getElementById("dateProposalInput");
const submitDateProposalBtn = document.getElementById("submitDateProposal");
const dateProposalViewEl = document.getElementById("dateProposalView");
const dateApproveWrapEl = document.getElementById("dateApproveWrap");
const dateApprovedByEl = document.getElementById("dateApprovedBy");
const approveDateProposalBtn = document.getElementById("approveDateProposal");
const dateScheduleWrapEl = document.getElementById("dateScheduleWrap");
const approvedDateTimeEl = document.getElementById("approvedDateTime");
const saveApprovedDateBtn = document.getElementById("saveApprovedDate");
const approvedDateViewEl = document.getElementById("approvedDateView");
const resetDateProposalBtn = document.getElementById("resetDateProposal");
let dateProposalState = {
  idea: "",
  proposedBy: "",
  approvedBy: "",
  approved: false,
  dateTime: ""
};

function loadDateProposalState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(dateProposalStorageKey) || "{}");
    dateProposalState = {
      idea: typeof parsed.idea === "string" ? parsed.idea : "",
      proposedBy: typeof parsed.proposedBy === "string" ? parsed.proposedBy : "",
      approvedBy: typeof parsed.approvedBy === "string" ? parsed.approvedBy : "",
      approved: Boolean(parsed.approved),
      dateTime: typeof parsed.dateTime === "string" ? parsed.dateTime : ""
    };
  } catch {
    dateProposalState = { idea: "", proposedBy: "", approvedBy: "", approved: false, dateTime: "" };
  }
}

function saveDateProposalState() {
  localStorage.setItem(dateProposalStorageKey, JSON.stringify(dateProposalState));
}

function renderDateProposalState() {
  if (dateProposalViewEl) {
    if (!dateProposalState.idea) {
      dateProposalViewEl.textContent = "No date idea suggested yet.";
    } else {
      dateProposalViewEl.textContent = `Suggested by ${dateProposalState.proposedBy}: ${dateProposalState.idea}`;
    }
  }

  if (dateApproveWrapEl) {
    dateApproveWrapEl.classList.toggle("hidden", !dateProposalState.idea || dateProposalState.approved);
  }

  if (dateScheduleWrapEl) {
    dateScheduleWrapEl.classList.toggle("hidden", !dateProposalState.approved);
  }

  if (approvedDateTimeEl && dateProposalState.dateTime) {
    approvedDateTimeEl.value = dateProposalState.dateTime;
  }

  if (approvedDateViewEl) {
    if (!dateProposalState.approved) {
      approvedDateViewEl.textContent = "";
    } else if (!dateProposalState.dateTime) {
      approvedDateViewEl.textContent = `Approved by ${dateProposalState.approvedBy}. Now choose date/time.`;
    } else {
      approvedDateViewEl.textContent = `Approved by ${dateProposalState.approvedBy}. Date locked: ${formatLocalDateTime(dateProposalState.dateTime)} 💖`;
    }
  }
}

if (submitDateProposalBtn) {
  submitDateProposalBtn.addEventListener("click", () => {
    const proposedBy = (dateProposedByEl?.value || "Partner One").trim();
    const idea = (dateProposalInputEl?.value || "").trim();
    if (!idea) return;
    dateProposalState = {
      idea,
      proposedBy,
      approvedBy: "",
      approved: false,
      dateTime: ""
    };
    saveDateProposalState();
    renderDateProposalState();
    if (dateProposalInputEl) dateProposalInputEl.value = "";
  });
}

if (approveDateProposalBtn) {
  approveDateProposalBtn.addEventListener("click", () => {
    if (!dateProposalState.idea) return;
    dateProposalState.approved = true;
    dateProposalState.approvedBy = (dateApprovedByEl?.value || "Partner Two").trim();
    saveDateProposalState();
    renderDateProposalState();
  });
}

if (saveApprovedDateBtn) {
  saveApprovedDateBtn.addEventListener("click", () => {
    if (!dateProposalState.approved) return;
    const pickedDate = (approvedDateTimeEl?.value || "").trim();
    if (!pickedDate) return;
    dateProposalState.dateTime = pickedDate;
    saveDateProposalState();
    renderDateProposalState();
  });
}

if (resetDateProposalBtn) {
  resetDateProposalBtn.addEventListener("click", () => {
    dateProposalState = { idea: "", proposedBy: "", approvedBy: "", approved: false, dateTime: "" };
    saveDateProposalState();
    renderDateProposalState();
  });
}

loadDateProposalState();
renderDateProposalState();

// Mood check-in.
const moodStorageKey = "loveStoryMoodState";
const moodResponseEl = document.getElementById("moodResponse");
const moodNoteEl = document.getElementById("moodNote");
const moodMetaEl = document.getElementById("moodMeta");
const saveMoodBtn = document.getElementById("saveMoodNote");
const clearMoodBtn = document.getElementById("clearMoodNote");
const moodButtons = Array.from(document.querySelectorAll(".mood-btn"));
let selectedMood = "";

const moodLines = {
  happy: "Seeing you happy makes my day brighter too 💖",
  miss: "I miss you too. One hug pending from my side 🤍",
  hug: "Virtual tight hug sent. Real one coming soon 🤗",
  low: "I am with you. Slow breath, one step, we handle it together 🤍"
};

function renderMoodSelection() {
  moodButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mood === selectedMood);
  });
  if (moodResponseEl) {
    moodResponseEl.textContent = selectedMood
      ? moodLines[selectedMood] || "I am here."
      : "Pick a mood and I will send you a soft line here.";
  }
}

function loadMoodState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(moodStorageKey) || "{}");
    if (typeof parsed.mood === "string") selectedMood = parsed.mood;
    if (moodNoteEl && typeof parsed.note === "string") moodNoteEl.value = parsed.note;
    if (moodMetaEl && parsed.updatedAt) {
      moodMetaEl.textContent = `Last saved: ${new Date(parsed.updatedAt).toLocaleString()}`;
    }
  } catch {}
}

function saveMoodState() {
  const payload = {
    mood: selectedMood,
    note: (moodNoteEl?.value || "").trim(),
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(moodStorageKey, JSON.stringify(payload));
  if (moodMetaEl) {
    moodMetaEl.textContent = `Last saved: ${new Date(payload.updatedAt).toLocaleString()}`;
  }
}

moodButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedMood = btn.dataset.mood || "";
    renderMoodSelection();
  });
});

if (saveMoodBtn) {
  saveMoodBtn.addEventListener("click", () => {
    saveMoodState();
  });
}

if (clearMoodBtn) {
  clearMoodBtn.addEventListener("click", () => {
    selectedMood = "";
    if (moodNoteEl) moodNoteEl.value = "";
    localStorage.removeItem(moodStorageKey);
    if (moodMetaEl) moodMetaEl.textContent = "";
    renderMoodSelection();
  });
}

loadMoodState();
renderMoodSelection();

// Digital love letter editor.
const loveLetterStorageKey = "loveStoryLetterText";
const loveLetterInput = document.getElementById("loveLetterInput");
const saveLoveLetterBtn = document.getElementById("saveLoveLetter");
const clearLoveLetterBtn = document.getElementById("clearLoveLetter");

if (loveLetterInput) {
  const savedLetter = localStorage.getItem(loveLetterStorageKey);
  if (savedLetter !== null) {
    loveLetterInput.value = savedLetter;
  }
}

if (saveLoveLetterBtn) {
  saveLoveLetterBtn.addEventListener("click", () => {
    const text = (loveLetterInput?.value || "").trim();
    localStorage.setItem(loveLetterStorageKey, text);
  });
}

if (clearLoveLetterBtn) {
  clearLoveLetterBtn.addEventListener("click", () => {
    if (loveLetterInput) loveLetterInput.value = "";
    localStorage.removeItem(loveLetterStorageKey);
  });
}

// Funny couple scoreboard.
const scoreStorageKey = "loveStoryScoreboard";
const scoreDefaults = {
  fightCount: 0,
  patchCount: 0,
  sorryMeCount: 0,
  sorryHerCount: 0,
  missedKissCount: 0,
  missedHugCount: 0
};

function loadScores() {
  try {
    const parsed = JSON.parse(localStorage.getItem(scoreStorageKey) || "{}");
    return {
      fightCount: Number(parsed.fightCount) || 0,
      patchCount: Number(parsed.patchCount) || 0,
      sorryMeCount: Number(parsed.sorryMeCount) || 0,
      sorryHerCount: Number(parsed.sorryHerCount) || 0,
      missedKissCount: Number(parsed.missedKissCount) || 0,
      missedHugCount: Number(parsed.missedHugCount) || 0
    };
  } catch {
    return { ...scoreDefaults };
  }
}

function saveScores(scores) {
  localStorage.setItem(scoreStorageKey, JSON.stringify(scores));
}

function getWinnerLine(scores) {
  if (scores.patchCount >= scores.fightCount) return "Currently winning: Peace and love 💖";
  if (scores.sorryMeCount > scores.sorryHerCount) return "Currently winning: Partner Two (Partner One is apologizing more 😅)";
  if (scores.sorryHerCount > scores.sorryMeCount) return "Currently winning: Partner One (Partner Two is apologizing more 😄)";
  return "Currently winning: Tie, but teamwork still looks good 💖";
}

let scoreboard = loadScores();

function renderScores() {
  Object.keys(scoreDefaults).forEach((key) => {
    const el = document.getElementById(key);
    if (el) el.textContent = scoreboard[key];
  });
  const winnerLine = document.getElementById("winnerLine");
  if (winnerLine) winnerLine.textContent = getWinnerLine(scoreboard);
}

document.querySelectorAll(".score-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.stat;
    if (!key || !(key in scoreboard)) return;
    scoreboard[key] += 1;
    saveScores(scoreboard);
    renderScores();
  });
});

const resetScoresBtn = document.getElementById("resetScores");
const redeemKissBtn = document.getElementById("redeemKiss");
const redeemHugBtn = document.getElementById("redeemHug");
const clearPendingLoveBtn = document.getElementById("clearPendingLove");
if (resetScoresBtn) {
  resetScoresBtn.addEventListener("click", () => {
    scoreboard = { ...scoreDefaults };
    saveScores(scoreboard);
    renderScores();
  });
}

if (redeemKissBtn) {
  redeemKissBtn.addEventListener("click", () => {
    scoreboard.missedKissCount = Math.max(0, Number(scoreboard.missedKissCount || 0) - 1);
    saveScores(scoreboard);
    renderScores();
  });
}

if (redeemHugBtn) {
  redeemHugBtn.addEventListener("click", () => {
    scoreboard.missedHugCount = Math.max(0, Number(scoreboard.missedHugCount || 0) - 1);
    saveScores(scoreboard);
    renderScores();
  });
}

if (clearPendingLoveBtn) {
  clearPendingLoveBtn.addEventListener("click", () => {
    scoreboard.missedKissCount = 0;
    scoreboard.missedHugCount = 0;
    saveScores(scoreboard);
    renderScores();
  });
}

renderScores();

// Couple remarks board.
const remarksStorageKey = "loveStoryRemarks";
const remarkAuthorSelect = document.getElementById("remarkAuthor");
const remarkTextInput = document.getElementById("remarkText");
const remarksList = document.getElementById("remarksList");
const addRemarkBtn = document.getElementById("addRemark");
const clearRemarksBtn = document.getElementById("clearRemarks");

function loadRemarks() {
  try {
    const parsed = JSON.parse(localStorage.getItem(remarksStorageKey) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRemarks(items) {
  localStorage.setItem(remarksStorageKey, JSON.stringify(items));
}

function formatDateTime(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

let remarks = loadRemarks();

function renderRemarks() {
  if (!remarksList) return;
  if (!remarks.length) {
    remarksList.innerHTML = "<p class=\"section-intro\">No remarks yet. Add the first one.</p>";
    return;
  }

  remarksList.innerHTML = remarks
    .slice()
    .reverse()
    .map(
      (item) => `
      <article class="remark-item">
        <div class="remark-head">
          <span class="remark-name">${item.name}</span>
          <span>${formatDateTime(item.createdAt)}</span>
        </div>
        <p class="remark-text">${item.text}</p>
      </article>
    `
    )
    .join("");
}

if (addRemarkBtn) {
  addRemarkBtn.addEventListener("click", () => {
    const name = (remarkAuthorSelect?.value || "Partner One").trim();
    const text = (remarkTextInput?.value || "").trim();
    if (!text) return;

    remarks.push({ name, text, createdAt: new Date().toISOString() });
    saveRemarks(remarks);
    renderRemarks();
    if (remarkTextInput) remarkTextInput.value = "";
  });
}

if (clearRemarksBtn) {
  clearRemarksBtn.addEventListener("click", () => {
    remarks = [];
    saveRemarks(remarks);
    renderRemarks();
  });
}

renderRemarks();

// Secret puzzle checker.
const q1Metro = document.getElementById("q1Metro");
const q2Birth = document.getElementById("q2Birth");
const q3Items = document.getElementById("q3Items");
const q4Best = document.getElementById("q4Best");
const checkPuzzleBtn = document.getElementById("checkPuzzle");
const puzzleResult = document.getElementById("puzzleResult");
const puzzlePassword = document.getElementById("puzzlePassword");

function normalizeBirthInput(value) {
  return value.replace(/\s+/g, "").replace(/\//g, "-");
}

if (checkPuzzleBtn) {
  checkPuzzleBtn.addEventListener("click", () => {
    const a1 = (q1Metro?.value || "").trim().toLowerCase();
    const a2 = normalizeBirthInput((q2Birth?.value || "").trim());
    const a3 = (q3Items?.value || "").trim();
    const a4 = (q4Best?.value || "").trim().toLowerCase();

    const ok1 = a1 === "private memory vault";
    const ok2 = a2 === "2026";
    const ok3 = a3 === "2";
    const ok4 = a4 === "private couple space";

    if (puzzleResult) puzzleResult.classList.remove("hidden");

    if (ok1 && ok2 && ok3 && ok4) {
      if (puzzlePassword) puzzlePassword.textContent = password;
      if (puzzleResult) {
        puzzleResult.innerHTML = `<p>You unlocked it 💖</p><p>Secret Surprise Password: <strong id="puzzlePassword">${password}</strong></p>`;
      }
      return;
    }

    if (puzzleResult) {
      puzzleResult.innerHTML = "<p>Some answers are off. Try the product demo questions again.</p>";
    }
  });
}

// Password surprise.
document.getElementById("unlockBtn").addEventListener("click", () => {
  const typed = document.getElementById("passwordInput").value.trim();
  if (typed === password) {
    window.location.href = "surprise-love.html";
  } else {
    alert("Wrong passcode. Use the shared demo code from the unlock flow.");
  }
});

// Final heart burst.
const burst = document.getElementById("heartBurst");
for (let i = 0; i < 20; i += 1) {
  const h = document.createElement("span");
  h.className = "pop-heart";
  h.style.animationDelay = `${i * 0.08}s`;
  h.textContent = "❤";
  burst.appendChild(h);
}
