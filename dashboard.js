/* ═══════════════════════════════════════════════════════════════
   Private World For Couples — Dashboard JS
   Theme switching, sidebar, animations, and interactivity
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── DOM REFERENCES ───
  const root = document.documentElement;
  const body = document.body;
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navItems = document.querySelectorAll('.nav-item');
  const themeBtns = document.querySelectorAll('.theme-btn');
  const profileDropdown = document.getElementById('profileDropdown');
  const profileBtn = document.getElementById('profileBtn');
  const searchInput = document.getElementById('searchInput');
  const floatingHeartsEl = document.getElementById('floatingHearts');
  const loveQuoteEl = document.getElementById('loveQuote');
  const welcomeDateEl = document.getElementById('welcomeDate');
  const quickNoteInput = document.getElementById('quickNoteInput');
  const sendQuickNoteBtn = document.getElementById('sendQuickNote');

  // ─── LOVE QUOTES ───
  const loveQuotes = [
    '"The best thing to hold onto in life is each other." — Audrey Hepburn',
    '"I love you not because of who you are, but because of who I am when I am with you." — Roy Croft',
    '"In all the world, there is no heart for me like yours." — Maya Angelou',
    '"You are my today and all of my tomorrows." — Lee Christopher',
    '"Every love story is beautiful, but ours is my favorite." — Unknown',
    '"I knew I loved you before I met you." — Savage Garden',
    '"To love and be loved is to feel the sun from both sides." — David Viscott',
    '"You are the finest, loveliest, tenderest person I have ever known." — F. Scott Fitzgerald',
    '"I wish I could turn back the clock. I'd find you sooner and love you longer." — Unknown',
    '"My heart is, and always will be, yours." — Jane Austen',
    '"If I know what love is, it is because of you." — Hermann Hesse',
    '"You make me want to be a better person every single day." — Unknown',
    '"Love is not about how many days, months or years you have been together. Love is about how much you love each other every single day." — Unknown',
    '"I carry your heart with me (I carry it in my heart)." — E.E. Cummings',
    '"Grow old along with me, the best is yet to be." — Robert Browning',
  ];

  // ─── GREETING TIME ───
  function getGreetingTime() {
    const hour = new Date().getHours();
    if (hour < 5) return 'Sweet dreams';
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Good night';
  }

  // ─── THEME SWITCHING ───
  function setTheme(theme) {
    if (!theme) return;

    // Add smooth transition class globally
    document.documentElement.classList.add('theme-transition');

    root.setAttribute('data-theme', theme);
    localStorage.setItem('pw-dashboard-theme', theme);

    // Re-query in case buttons were modified
    const currentBtns = document.querySelectorAll('.theme-btn');
    currentBtns.forEach(btn => {
      if (btn.dataset.theme === theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Remove the transition class after animation finishes
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 500);
  }

  function initTheme() {
    const saved = localStorage.getItem('pw-dashboard-theme') || 'romantic';
    setTheme(saved);
  }

  // Use event delegation for reliable theme switching (handles clicks on child spans)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.theme-btn');
    if (btn && btn.dataset.theme) {
      setTheme(btn.dataset.theme);
    }
  });

  // ─── SIDEBAR TOGGLE ───
  let sidebarCollapsed = false;

  function toggleSidebar() {
    sidebarCollapsed = !sidebarCollapsed;
    sidebar.classList.toggle('collapsed', sidebarCollapsed);
    localStorage.setItem('pw-sidebar-collapsed', sidebarCollapsed);
  }

  function initSidebar() {
    const saved = localStorage.getItem('pw-sidebar-collapsed');
    if (saved === 'true') {
      sidebarCollapsed = true;
      sidebar.classList.add('collapsed');
    }
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
  }

  // ─── MOBILE MENU ───
  let overlay = null;

  function createOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    body.appendChild(overlay);
    overlay.addEventListener('click', closeMobileMenu);
  }

  function openMobileMenu() {
    sidebar.classList.add('mobile-open');
    if (!overlay) createOverlay();
    requestAnimationFrame(() => {
      overlay.classList.add('visible');
    });
  }

  function closeMobileMenu() {
    sidebar.classList.remove('mobile-open');
    if (overlay) {
      overlay.classList.remove('visible');
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileMenu);
  }

  // ─── NAV ACTIVE STATE ───
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      closeMobileMenu();
    });
  });

  // ─── PROFILE DROPDOWN ───
  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!profileDropdown.contains(e.target)) {
        profileDropdown.classList.remove('open');
      }
    });
  }

  // ─── FLOATING HEARTS ───
  function spawnFloatingHearts() {
    if (!floatingHeartsEl) return;
    const hearts = ['💕', '💗', '💖', '✨', '💝', '🤍', '💫'];
    const count = 12;

    for (let i = 0; i < count; i++) {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.animationDuration = `${10 + Math.random() * 15}s`;
      heart.style.animationDelay = `${Math.random() * 12}s`;
      heart.style.fontSize = `${10 + Math.random() * 10}px`;
      floatingHeartsEl.appendChild(heart);
    }
  }

  // ─── DAILY LOVE QUOTE ───
  function setDailyQuote() {
    if (!loveQuoteEl) return;
    const dayIndex = new Date().getDate() % loveQuotes.length;
    loveQuoteEl.textContent = loveQuotes[dayIndex];
  }

  // ─── WELCOME DATE ───
  function setWelcomeDate() {
    if (!welcomeDateEl) return;
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    welcomeDateEl.textContent = new Date().toLocaleDateString('en-US', options);
  }

  // ─── GREETING TEXT ───
  function setGreeting() {
    const greetingEl = document.querySelector('.welcome-tag');
    if (greetingEl) {
      greetingEl.textContent = `${getGreetingTime()}, lovebirds 💕`;
    }
  }

  // ─── STAT COUNTER ANIMATIONS ───
  function animateCounters() {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(el => {
      const text = el.textContent.trim();
      // Don't animate non-numeric values
      if (text.includes('%') || text.includes('k')) {
        // Just a subtle fade-in handled by CSS
        return;
      }
      const target = parseInt(text);
      if (isNaN(target)) return;

      let current = 0;
      const step = Math.ceil(target / 40);
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        el.textContent = current.toLocaleString();
      }, 30);
    });
  }

  // ─── QUICK NOTE ───
  if (sendQuickNoteBtn && quickNoteInput) {
    sendQuickNoteBtn.addEventListener('click', () => {
      const note = quickNoteInput.value.trim();
      if (!note) {
        quickNoteInput.style.borderColor = 'rgba(239, 68, 68, 0.5)';
        quickNoteInput.style.animation = 'shake 0.4s ease';
        setTimeout(() => {
          quickNoteInput.style.borderColor = '';
          quickNoteInput.style.animation = '';
        }, 500);
        return;
      }

      // Save note
      const notes = JSON.parse(localStorage.getItem('pw-love-notes') || '[]');
      notes.unshift({
        text: note,
        from: 'You',
        time: new Date().toISOString(),
      });
      localStorage.setItem('pw-love-notes', JSON.stringify(notes));

      // Show success animation
      const originalText = sendQuickNoteBtn.textContent;
      sendQuickNoteBtn.textContent = 'Sent! 💖';
      sendQuickNoteBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
      quickNoteInput.value = '';

      setTimeout(() => {
        sendQuickNoteBtn.textContent = originalText;
        sendQuickNoteBtn.style.background = '';
      }, 2000);

      // Add activity
      addActivity('You sent a love note 💌', 'pink');
    });
  }

  // ─── ADD ACTIVITY ───
  function addActivity(text, dotColor) {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;

    const li = document.createElement('li');
    li.className = 'activity-item';
    li.style.animation = 'fadeInUp 0.4s ease both';
    li.innerHTML = `
      <div class="activity-dot activity-dot-${dotColor}"></div>
      <div class="activity-content">
        <p class="activity-text">${text}</p>
        <span class="activity-time">Just now</span>
      </div>
    `;

    activityList.insertBefore(li, activityList.firstChild);
  }

  // ─── QUICK ACTION BUTTONS ───
  const quickActionHandlers = {
    'btn-add-memory': () => {
      addActivity('Memory creation started 📸', 'coral');
      showToast('Opening memory creator... 📸');
    },
    'btn-send-note': () => {
      quickNoteInput?.focus();
      showToast('Write something sweet below 💌');
    },
    'btn-upload-photo': () => {
      addActivity('Photo upload initiated 🖼️', 'purple');
      showToast('Photo uploader coming soon! 🖼️');
    },
    'btn-set-mood': () => {
      addActivity('Mood check-in opened 😊', 'gold');
      showToast('How are you feeling today? 😊');
    },
  };

  Object.entries(quickActionHandlers).forEach(([id, handler]) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', handler);
    }
  });

  // ─── TOAST NOTIFICATIONS ───
  function showToast(message) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 28px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      padding: 14px 28px;
      border-radius: 16px;
      background: var(--bg-card-solid);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-card-hover);
      color: var(--text-primary);
      font-size: 0.88rem;
      font-weight: 600;
      z-index: 9999;
      opacity: 0;
      transition: all 0.4s ease;
      backdrop-filter: blur(16px);
    `;

    body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  // ─── COUNTDOWN CALCULATION ───
  function updateCountdown() {
    const countdownEl = document.getElementById('countdownDays');
    if (!countdownEl) return;

    // Anniversary date — Dec 11, 2026
    const anniversary = new Date(2026, 11, 11); // Month is 0-indexed
    const now = new Date();
    const diff = anniversary - now;
    const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    countdownEl.textContent = days;

    // Update progress ring
    const progress = document.querySelector('.countdown-progress');
    if (progress) {
      const totalDays = 365;
      const elapsed = totalDays - days;
      const percent = Math.min(1, elapsed / totalDays);
      const circumference = 2 * Math.PI * 42;
      const offset = circumference * (1 - percent);
      progress.style.strokeDasharray = circumference;
      progress.style.strokeDashoffset = offset;
    }
  }

  // ─── DAYS TOGETHER ───
  function updateDaysTogether() {
    const el = document.getElementById('daysTogether');
    if (!el) return;
    const start = new Date(2025, 11, 11);
    const now = new Date();
    const days = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    el.textContent = days;
  }

  // ─── SEARCH FUNCTIONALITY ───
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
          showToast(`Searching for "${query}" 🔍`);
          searchInput.value = '';
        }
      }
    });
  }

  // ─── POLAROID HOVER SOUND EFFECT (visual) ───
  const polaroids = document.querySelectorAll('.polaroid-card');
  polaroids.forEach(card => {
    card.addEventListener('click', () => {
      showToast('Opening memory details... 📖');
    });
  });

  // ─── NOTIFICATION BUTTON ───
  const notifBtn = document.getElementById('notifBtn');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      showToast('3 new love notes from Palak 💌');
      const dot = notifBtn.querySelector('.notif-dot');
      if (dot) dot.style.display = 'none';
    });
  }

  // ─── LOGO CLICK ───
  const logoEl = document.getElementById('sidebarLogo');
  if (logoEl) {
    logoEl.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }

  // ─── CSS SHAKE ANIMATION INJECTION ───
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-6px); }
      40% { transform: translateX(6px); }
      60% { transform: translateX(-3px); }
      80% { transform: translateX(3px); }
    }
  `;
  document.head.appendChild(shakeStyle);

  // ─── INIT ───
  function init() {
    initTheme();
    initSidebar();
    setGreeting();
    setDailyQuote();
    setWelcomeDate();
    spawnFloatingHearts();
    updateCountdown();
    updateDaysTogether();

    // Delay counter animation for visual effect
    setTimeout(animateCounters, 600);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
