/* ============================================================
   DASHBOARD.JS — AuthSystem Dashboard Logic (Firebase)
   ============================================================ */

/* ── Global Cache (populated from Firestore on load) ─────── */
window._fbUser      = null;  /* current Firebase user data     */
window._fbUsers     = [];    /* all users from Firestore        */
window._fbActivity  = [];    /* activity logs from Firestore    */
window._fbStats     = null;  /* computed stats                  */
window._fbInitDone  = false;

/* ── Firebase Auth Guard + Init ─────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const _loaderEl = { _shownAt: Date.now() };
  _showDashLoader();
  /* Tag start time for minimum delay */
  setTimeout(() => {
    const el = document.getElementById('dashLoader');
    if (el) el._shownAt = Date.now();
  }, 0);

  FAUTH.onAuthStateChanged(async (fbUser) => {
    if (!fbUser) {
      window.location.href = 'index.html';
      return;
    }

    if (!window._fbInitDone) {
      window._fbInitDone = true;

      /* Load all data from Firestore */
      await _loadFirebaseData(fbUser);

      /* Remove loader and initialize dashboard */
      _hideDashLoader();
      _initDashboard();
    }
  });
});

function _showDashLoader() {
  const el = document.createElement('div');
  el.id = 'dashLoader';
  el.innerHTML = `
    <div class="dl-card">
      <div class="dl-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </div>
      <div class="dl-brand">AuthSystem</div>
      <div class="dl-bar-wrap">
        <div class="dl-bar"><div class="dl-bar-fill" id="dlFill"></div></div>
      </div>
      <div class="dl-step" id="dlStep">Connecting to server...</div>
      <div class="dl-dots"><span></span><span></span><span></span></div>
    </div>
  `;
  document.body.appendChild(el);

  /* Animate progress steps */
  const steps = [
    { pct: 15, msg: 'Connecting to server...' },
    { pct: 40, msg: 'Loading your profile...' },
    { pct: 65, msg: 'Fetching user data...' },
    { pct: 85, msg: 'Preparing dashboard...' },
    { pct: 95, msg: 'Almost ready...' },
  ];
  const fill = document.getElementById('dlFill');
  const step = document.getElementById('dlStep');
  steps.forEach(({ pct, msg }, i) => {
    setTimeout(() => {
      if (fill) fill.style.width = pct + '%';
      if (step) step.textContent = msg;
    }, i * 380);
  });
}

function _hideDashLoader(minDelay = 1800) {
  const el     = document.getElementById('dashLoader');
  if (!el) return;
  const fill   = document.getElementById('dlFill');
  const step   = document.getElementById('dlStep');
  const shown  = el._shownAt || Date.now();
  const wait   = Math.max(0, minDelay - (Date.now() - shown));

  setTimeout(() => {
    if (fill) fill.style.width = '100%';
    if (step) step.textContent = 'Welcome!';
    setTimeout(() => {
      el.style.transition = 'opacity 0.45s ease';
      el.style.opacity    = '0';
      setTimeout(() => el.remove(), 460);
    }, 350);
  }, wait);
}

async function _loadFirebaseData(fbUser) {
  /* ── Step 1: Load current user doc (critical) ─────────── */
  try {
    const snap = await FDB.collection('users').doc(fbUser.uid).get();

    if (snap.exists) {
      window._fbUser = { ...snap.data(), id: fbUser.uid };
    } else {
      /* Firestore doc missing — auto-create from Auth profile */
      const authData = {
        id:         fbUser.uid,
        fullName:   fbUser.displayName || fbUser.email.split('@')[0],
        email:      fbUser.email || '',
        role:       'user',
        createdAt:  fbUser.metadata.creationTime  || new Date().toISOString(),
        lastLogin:  fbUser.metadata.lastSignInTime || new Date().toISOString(),
        loginCount: 1,
        isActive:   true,
        avatarUrl:  '',
        settings:   { theme: 'light', language: 'sw', notifications: true },
      };
      try {
        await FDB.collection('users').doc(fbUser.uid).set(authData);
        await FB.Activity.log(fbUser.uid, 'register', 'Akaunti imeunganishwa na Firebase');
      } catch (writeErr) {
        console.warn('Auto-create user doc failed:', writeErr.message);
      }
      window._fbUser = authData;
    }
  } catch (err) {
    console.error('User doc fetch error:', err.message);
    /* Absolute fallback — use Firebase Auth metadata only */
    window._fbUser = {
      id:         fbUser.uid,
      fullName:   fbUser.displayName || fbUser.email?.split('@')[0] || 'Mtumiaji',
      email:      fbUser.email || '',
      role:       'user',
      loginCount: 1,
      isActive:   true,
      avatarUrl:  '',
      createdAt:  fbUser.metadata.creationTime,
      lastLogin:  fbUser.metadata.lastSignInTime,
    };
  }

  /* ── Step 2: Load all users (non-critical) ─────────────── */
  try {
    window._fbUsers = await FB.Users.getAll();
  } catch (err) {
    console.warn('Users.getAll failed:', err.message);
    /* At least show ourselves in the table */
    window._fbUsers = window._fbUser ? [window._fbUser] : [];
  }

  /* ── Step 3: Load activity (non-critical) ──────────────── */
  try {
    window._fbActivity = await FB.Activity.getAll(200);
  } catch (err) {
    console.warn('Activity.getAll failed:', err.message);
    window._fbActivity = [];
  }

  /* ── Step 4: Compute stats from loaded data ────────────── */
  const now   = new Date();
  const today = now.toDateString();
  window._fbStats = {
    totalUsers:  window._fbUsers.length,
    activeUsers: window._fbUsers.filter(u => u.isActive !== false).length,
    loginsToday: window._fbActivity.filter(a =>
      a.type === 'login' && new Date(a.timestamp).toDateString() === today
    ).length,
    newThisWeek: window._fbUsers.filter(u => {
      const diff = (now - new Date(u.createdAt)) / 86400000;
      return diff <= 7;
    }).length,
  };
}

function _initDashboard() {
  applyTheme();
  lucide.createIcons();

  populateUserUI();
  populateStats();
  populateActivity();
  populateProfilePage();
  drawWeeklyChart();
  populateSessionCard();

  initNav();
  initThemeToggle();
  initUserDropdown();
  initMobileSidebar();
  initProfileForm();
  initSecurityForm();
  initSettingsPage();
  initLogout();
  initUsersSearch();
  initSecurityToggles();
  initNotificationBell();
  initDangerZone();
  initLangToggle();

  setWelcomeDate();
}

/* ── Helpers ─────────────────────────────────────────────── */
function initials(name) {
  const parts = (name || '').trim().split(' ').filter(Boolean);
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : (parts[0] || 'U').slice(0, 2).toUpperCase();
}

/* ── Auto Transliteration: Latin → Arabic script ────────────
   Processes character by character using digraph-first priority.
   Double consonants collapse to single Arabic letter.
   ──────────────────────────────────────────────────────────── */
function _toArabic(text) {
  if (!text) return text;
  /* If already contains Arabic — return as-is */
  if (/[\u0600-\u06FF]/.test(text)) return text;

  const MAP = [
    /* digraphs — must come before single chars */
    ['sh','ش'],['kh','خ'],['gh','غ'],['th','ث'],['dh','ذ'],
    ['ch','تش'],['ph','ف'],['ng','نغ'],['ny','ني'],['oo','و'],
    ['aa','ا'],['ii','ي'],['uu','و'],['ee','ي'],
    /* double consonants → single */
    ['ss','س'],['tt','ت'],['ll','ل'],['mm','م'],['nn','ن'],
    ['rr','ر'],['dd','د'],['ff','ف'],['bb','ب'],['kk','ك'],
    /* single consonants */
    ['b','ب'],['t','ت'],['j','ج'],['d','د'],['r','ر'],
    ['z','ز'],['s','س'],['f','ف'],['q','ق'],['k','ك'],
    ['l','ل'],['m','م'],['n','ن'],['h','ه'],['w','و'],
    ['y','ي'],['p','ب'],['g','غ'],['v','ف'],['c','ك'],
    ['x','كس'],
    /* vowels last */
    ['a','ا'],['e','ي'],['i','ي'],['o','و'],['u','و'],
  ];

  return text.toLowerCase().split(/\s+/).map(word => {
    let out = '';
    let i   = 0;
    while (i < word.length) {
      let hit = false;
      for (const [from, to] of MAP) {
        if (word.slice(i, i + from.length) === from) {
          out += to;
          i   += from.length;
          hit  = true;
          break;
        }
      }
      if (!hit) i++; /* skip non-alpha like numbers */
    }
    return out;
  }).join(' ');
}

/* Initials from email — always 2 chars from the username part */
function emailInitials(email) {
  if (!email) return '??';
  const username = email.split('@')[0].replace(/[^a-zA-Z]/g, '');
  return username.slice(0, 2).toUpperCase() || '??';
}

/* Current locale tag based on active language */
function _locale() {
  const lang = (typeof I18N !== 'undefined') ? I18N.current : 'en';
  return lang === 'ar' ? 'ar-SA' : lang === 'sw' ? 'sw-TZ' : 'en-GB';
}

function timeAgo(ts) {
  if (!ts) return '—';
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  const lang = (typeof I18N !== 'undefined') ? I18N.current : 'en';

  const phrases = {
    now:   { en: 'Just now',          sw: 'Sasa hivi',              ar: 'الآن' },
    mins:  { en: `${m}m ago`,         sw: `Dakika ${m} zilizopita`, ar: `منذ ${m} دقيقة` },
    hours: { en: `${h}h ago`,         sw: `Saa ${h} zilizopita`,    ar: `منذ ${h} ساعة` },
    days:  { en: `${d}d ago`,         sw: `Siku ${d} zilizopita`,   ar: `منذ ${d} يوم` },
  };
  if (m < 1)  return phrases.now[lang]   || phrases.now.en;
  if (m < 60) return phrases.mins[lang]  || phrases.mins.en;
  if (h < 24) return phrases.hours[lang] || phrases.hours.en;
  if (d < 7)  return phrases.days[lang]  || phrases.days.en;
  return new Date(ts).toLocaleDateString(_locale(), { day:'numeric', month:'short', year:'numeric' });
}

function formatDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString(_locale(), { day: 'numeric', month: 'long', year: 'numeric' });
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val ?? '—';
}

/* ── Toast Notifications ────────────────────────────────── */
function showToast(message, type = 'success') {
  const wrap = document.getElementById('dashToastWrap');
  if (!wrap) return;

  const toast = document.createElement('div');
  toast.className = `dash-toast ${type}`;
  toast.innerHTML = `
    <div class="dash-toast-dot"></div>
    <span class="dash-toast-text">${message}</span>
    <button class="dash-toast-close" aria-label="Funga">&#x2715;</button>
  `;

  toast.querySelector('.dash-toast-close').addEventListener('click', () => dismissToast(toast));
  wrap.appendChild(toast);
  setTimeout(() => dismissToast(toast), 4000);
}

function dismissToast(toast) {
  toast.classList.add('out');
  setTimeout(() => toast.remove(), 220);
}

function showMsg(id, text, type = 'success') {
  const el = document.getElementById(id);
  if (!el) return;
  if (!text) { el.innerHTML = ''; return; }
  el.innerHTML = `<div class="dash-msg ${type}">${text}</div>`;
  setTimeout(() => { el.innerHTML = ''; }, 4000);
}

/* ── Loading State ───────────────────────────────────────── */
function setLoading(btn, isLoading, originalHTML) {
  if (!btn) return;
  if (isLoading) {
    btn.dataset.orig = btn.innerHTML;
    btn.innerHTML = `<span class="btn-spinner"></span> Saving...`;
    btn.classList.add('loading');
    btn.disabled = true;
  } else {
    btn.innerHTML = originalHTML || btn.dataset.orig || btn.innerHTML;
    btn.classList.remove('loading');
    btn.disabled = false;
  }
}

/* ── Theme ───────────────────────────────────────────────── */
function applyTheme() {
  const theme = FB.Settings.getTheme();
  document.documentElement.setAttribute('data-theme', theme);
  _syncThemeIcons(theme);
  const darkToggle = document.getElementById('darkModeToggle');
  if (darkToggle) darkToggle.checked = theme === 'dark';
}

function _syncThemeIcons(theme) {
  const moon = document.getElementById('moonIcon');
  const sun  = document.getElementById('sunIcon');
  if (moon) moon.classList.toggle('hidden', theme === 'dark');
  if (sun)  sun.classList.toggle('hidden',  theme !== 'dark');
}

function initThemeToggle() {
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    const next = FB.Settings.toggleTheme();
    _syncThemeIcons(next);
    lucide.createIcons();
    const darkToggle = document.getElementById('darkModeToggle');
    if (darkToggle) darkToggle.checked = next === 'dark';
  });
}

/* ── Time-based Greeting ─────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return t('greet_morning');
  if (h >= 12 && h < 17) return t('greet_afternoon');
  if (h >= 17 && h < 21) return t('greet_evening');
  return t('greet_night');
}

/* ── Language Toggle Dropdown ───────────────────────────────────── */
function initLangToggle() {
  if (typeof I18N === 'undefined') return;
  I18N.init();

  const wrap = document.getElementById('langWrap');
  const btn  = document.getElementById('langBtn');
  const menu = document.getElementById('langMenu');

  function _open() {
    if (!menu) return;
    menu.hidden = false;
    /* Mark currently active language */
    menu.querySelectorAll('.lang-option').forEach(o =>
      o.classList.toggle('active', o.dataset.lang === I18N.current)
    );
    /* Rotate caret */
    const caret = btn?.querySelector('.lang-caret');
    if (caret) caret.style.transform = 'rotate(180deg)';
  }

  function _close() {
    if (!menu) return;
    menu.hidden = true;
    const caret = btn?.querySelector('.lang-caret');
    if (caret) caret.style.transform = '';
  }

  /* Toggle on button click */
  btn?.addEventListener('click', (e) => {
    e.stopPropagation();
    menu?.hidden ? _open() : _close();
  });

  /* Select language from menu */
  menu?.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const lang = opt.dataset.lang;
      _close();
      I18N.setLang(lang);
      const key = lang === 'sw' ? 'toast_lang_sw' : lang === 'ar' ? 'toast_lang_ar' : 'toast_lang_en';
      if (typeof showToast === 'function') showToast(I18N.t(key), 'info');
    });
  });

  /* Close when clicking anywhere OUTSIDE the lang-wrap */
  document.addEventListener('click', (e) => {
    if (wrap && !wrap.contains(e.target)) _close();
  });
}

/* ── Avatar Photo Loader ─────────────────────────────────────
   Priority chain:
   1. avatarUrl iliyowekwa na mtumiaji (Firestore)
   2. Firebase Auth photoURL  (Google OAuth → picha halisi)
   3. Herufi za email initials — fallback salama (hakuna picha ya mtu mwingine)
   ──────────────────────────────────────────────────────────── */
function loadAvatar(user, imgId) {
  const img = document.getElementById(imgId);
  if (!img) return;
  img.classList.remove('loaded');

  const urls = [];

  /* 1 — custom avatarUrl saved by user in Profile page */
  const custom = (user.avatarUrl || '').trim();
  if (custom) urls.push(custom);

  /* 2 — Firebase Auth photoURL (set automatically on Google Sign-In) */
  const authUser = (typeof FAUTH !== 'undefined') ? FAUTH.currentUser : null;
  if (authUser && authUser.uid === user.id && authUser.photoURL) {
    urls.push(authUser.photoURL);
  }

  /* Walk the chain — if all fail, show email initials (never a wrong photo) */
  function tryNext(index) {
    if (index >= urls.length) {
      img.classList.remove('loaded');
      return;
    }
    const probe = new Image();
    probe.onload  = () => { img.src = urls[index]; img.classList.add('loaded'); };
    probe.onerror = () => tryNext(index + 1);
    probe.src = urls[index];
  }

  tryNext(0);
}

/* ── Resolve Current User (from Firebase cache) ──────────── */
function resolveCurrentUser() {
  return window._fbUser;
}

/* ── Populate User UI (topbar + dropdown) ────────────────── */
function populateUserUI() {
  const user = resolveCurrentUser();
  if (!user) return;

  const eIni      = emailInitials(user.email);
  const lang       = (typeof I18N !== 'undefined') ? I18N.current : 'en';
  /* Auto-transliterate to Arabic when Arabic mode is active */
  const displayName = lang === 'ar'
    ? _toArabic(user.fullName || '')
    : (user.fullName || '').trim();
  const firstName   = displayName.trim().split(/\s+/)[0];
  const greeting   = getGreeting();

  setText('userInitials', eIni);
  setText('userName',     firstName);
  setText('dropInitials', eIni);
  setText('dropName',     user.fullName);
  setText('dropEmail',    user.email);
  setText('welcomeText',  `${greeting}, ${firstName}!`);

  /* Load avatar photo */
  loadAvatar(user, 'userAvatarImg');
  loadAvatar(user, 'dropAvatarImg');
}

/* ── Welcome Date ────────────────────────────────────────── */
function setWelcomeDate() {
  const d = new Date().toLocaleDateString(_locale(), {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
  setText('welcomeDate', d);
}

/* ── Animated Counter ───────────────────────────────────── */
function animateCounter(el, target, duration = 700) {
  if (!el) return;
  const start     = 0;
  const startTime = performance.now();

  function step(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (target - start) * eased);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/* ── Stats ───────────────────────────────────────────────── */
function populateStats() {
  const stats = window._fbStats || { totalUsers: 0, activeUsers: 0, loginsToday: 0, newThisWeek: 0 };
  animateCounter(document.getElementById('statTotal'),  stats.totalUsers);
  animateCounter(document.getElementById('statActive'), stats.activeUsers);
  animateCounter(document.getElementById('statLogins'), stats.loginsToday);
  animateCounter(document.getElementById('statNew'),    stats.newThisWeek);
}

/* ── Profile Card (Overview) ─────────────────────────────── */
function populateActivity() {
  const user = resolveCurrentUser();
  if (!user) return;

  const ini = emailInitials(user.email);
  setText('profileInitials', ini);
  loadAvatar(user, 'profileAvatarImg');
  setText('profileName',     user.fullName);
  setText('profileRole',     user.role === 'admin' ? t('role_admin') : t('role_user'));
  setText('profileEmail',    user.email);
  setText('profileJoined',   formatDate(user.createdAt));
  const cnt  = user.loginCount || 1;
  const lang  = (typeof I18N !== 'undefined') ? I18N.current : 'en';
  const loginsStr = lang === 'ar' ? `${cnt} مرة` : lang === 'sw' ? `Mara ${cnt}` : `${cnt} time${cnt !== 1 ? 's' : ''}`;
  setText('profileLogins', loginsStr);
  setText('profileLastLogin', timeAgo(user.lastLogin));

  /* Activity feed from Firebase cache */
  const logs = (window._fbActivity || []).filter(a => a.userId === user.id).slice(0, 8);
  const list = document.getElementById('activityList');
  if (!list) return;

  if (!logs.length) {
    list.innerHTML = `<div class="activity-empty">${t('no_activity')}</div>`;
    return;
  }

  list.innerHTML = logs.map(log => `
    <div class="activity-item">
      <div class="activity-dot ${log.type}"></div>
      <div>
        <div class="activity-desc">${escHtml(log.description)}</div>
        <div class="activity-time">${timeAgo(log.timestamp)}</div>
      </div>
    </div>
  `).join('');
}

/* ── Profile Page Form ───────────────────────────────────── */
function populateProfilePage() {
  const user = resolveCurrentUser();
  if (!user) return;

  const nameEl      = document.getElementById('editName');
  const emailEl     = document.getElementById('editEmail');
  const roleEl      = document.getElementById('editRole');
  const avatarUrlEl = document.getElementById('editAvatarUrl');

  if (nameEl)      nameEl.value      = user.fullName  || '';
  if (emailEl)     emailEl.value     = user.email     || '';
  if (roleEl)      roleEl.value      = t(user.role === 'admin' ? 'role_admin' : 'role_user');
  if (avatarUrlEl) avatarUrlEl.value = user.avatarUrl || '';
  /* Update avatar preview in the form */
  setText('editAvatarInitials', emailInitials(user.email));
  loadAvatar(user, 'editAvatarImg');
}

function _previewAvatarUrl(url) {
  const img  = document.getElementById('editAvatarImg');
  const span = document.getElementById('editAvatarInitials');
  if (!img || !url) { img?.classList.remove('loaded'); return; }

  const test = new Image();
  test.onload  = () => { img.src = url; img.classList.add('loaded'); };
  test.onerror = () => { img.classList.remove('loaded'); };
  test.src = url;
}

function initProfileForm() {
  const saveBtn = document.getElementById('saveProfileBtn');

  /* Live preview when avatar URL changes */
  document.getElementById('editAvatarUrl')?.addEventListener('input', (e) => {
    _previewAvatarUrl(e.target.value.trim());
  });

  saveBtn?.addEventListener('click', () => {
    const user = resolveCurrentUser();
    if (!user) return;

    const newName      = document.getElementById('editName')?.value.trim();
    const newAvatarUrl = document.getElementById('editAvatarUrl')?.value.trim() || '';

    if (!newName || newName.length < 3) {
      showToast(t('toast_name_min'), 'error');
      return;
    }

    setLoading(saveBtn, true);

    FB.Users.update(user.id, { fullName: newName, avatarUrl: newAvatarUrl })
      .then(result => {
        setLoading(saveBtn, false);
        if (result.success) {
          /* Update Firebase cache */
          window._fbUser = { ...window._fbUser, fullName: newName, avatarUrl: newAvatarUrl };
          FB.Activity.log(user.id, 'update', 'Taarifa za wasifu zimesasishwa').then(() => {
            window._fbActivity.unshift({
              userId: user.id, type: 'update',
              description: 'Taarifa za wasifu zimesasishwa',
              timestamp: new Date().toISOString(),
            });
          });
          showToast(t('toast_profile_saved'), 'success');
          populateUserUI();
          populateActivity();
          populateProfilePage();
        } else {
          showToast(result.message, 'error');
        }
      })
      .catch(err => { setLoading(saveBtn, false); showToast(err.message, 'error'); });
  });

  document.getElementById('cancelProfileBtn')?.addEventListener('click', () => {
    populateProfilePage();
  });
}

/* ── Security Form ───────────────────────────────────────── */
function initSecurityForm() {
  const saveBtn = document.getElementById('savePassBtn');

  saveBtn?.addEventListener('click', () => {
    const user = resolveCurrentUser();
    if (!user) return;

    const current = document.getElementById('currentPass')?.value;
    const newPass = document.getElementById('newPass')?.value;
    const confirm = document.getElementById('confirmPass')?.value;

    if (!current || !newPass || !confirm) {
      showToast(t('toast_fill_all'), 'error');
      return;
    }

    if (newPass.length < 8) {
      showToast(t('toast_pass_min'), 'error');
      return;
    }

    if (newPass !== confirm) {
      showToast(t('toast_pass_mismatch'), 'error');
      return;
    }

    setLoading(saveBtn, true);

    FB.Auth.changePassword(current, newPass)
      .then(result => {
        setLoading(saveBtn, false);
        if (result.success) {
          document.getElementById('currentPass').value = '';
          document.getElementById('newPass').value     = '';
          document.getElementById('confirmPass').value = '';
          FB.Activity.log(user.id, 'update', 'Nywila imebadilishwa');
          showToast(t('toast_pass_changed'), 'success');
        } else {
          showToast(result.message, 'error');
        }
      })
      .catch(err => { setLoading(saveBtn, false); showToast(err.message, 'error'); });
  });
}

/* ── Settings Page ───────────────────────────────────────────── */
function initSettingsPage() {
  const darkToggle  = document.getElementById('darkModeToggle');
  const notifToggle = document.getElementById('notifToggle');

  if (darkToggle)  darkToggle.checked  = FB.Settings.getTheme() === 'dark';
  if (notifToggle) notifToggle.checked = FB.Settings.get().notifications !== false;

  darkToggle?.addEventListener('change', () => {
    const next = darkToggle.checked ? 'dark' : 'light';
    FB.Settings.setTheme(next);
    _syncThemeIcons(next);
    lucide.createIcons();
    showToast(t(next === 'dark' ? 'toast_dark_on' : 'toast_dark_off'), 'info');
    setTimeout(drawWeeklyChart, 50);
  });

  notifToggle?.addEventListener('change', () => {
    FB.Settings.set({ notifications: notifToggle.checked });
    showToast(t(notifToggle.checked ? 'toast_notif_on' : 'toast_notif_off'), 'info');
  });
}

/* ── Advanced Weekly Chart (Chart.js) ───────────────────── */
let _weeklyChart = null;

function _getChartData() {
  const all  = window._fbActivity || [];
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const d   = new Date();
    d.setDate(d.getDate() - i);
    const str  = d.toDateString();
    const lbl  = d.toLocaleDateString(_locale(), { weekday: 'short', day: 'numeric' });

    days.push({
      label:     lbl,
      logins:    all.filter(a => a.type === 'login'    && new Date(a.timestamp).toDateString() === str).length,
      registers: all.filter(a => a.type === 'register' && new Date(a.timestamp).toDateString() === str).length,
      updates:   all.filter(a => a.type === 'update'   && new Date(a.timestamp).toDateString() === str).length,
    });
  }
  return days;
}

function drawWeeklyChart() {
  const canvas = document.getElementById('weeklyChartCanvas');
  if (!canvas || !window.Chart) return;

  const data     = _getChartData();
  const isDark   = document.documentElement.getAttribute('data-theme') === 'dark';
  const grid     = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const txtColor = isDark ? '#64748b' : '#94a3b8';
  const tooltipBg   = isDark ? '#1e293b' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#e5e7eb';
  const tooltipTitle  = isDark ? '#f1f5f9' : '#111827';

  if (_weeklyChart) { _weeklyChart.destroy(); _weeklyChart = null; }

  _weeklyChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: data.map(d => d.label),
      datasets: [
        {
          label: t('chart_logins'),
          data: data.map(d => d.logins),
          borderColor: '#6366f1',
          backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)',
          fill: true,
          tension: 0.45,
          pointBackgroundColor: '#6366f1',
          pointBorderColor: isDark ? '#1e293b' : '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2,
        },
        {
          label: t('chart_regs'),
          data: data.map(d => d.registers),
          borderColor: '#10b981',
          backgroundColor: isDark ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.08)',
          fill: true,
          tension: 0.45,
          pointBackgroundColor: '#10b981',
          pointBorderColor: isDark ? '#1e293b' : '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2,
        },
        {
          label: t('chart_updates'),
          data: data.map(d => d.updates),
          borderColor: '#f59e0b',
          backgroundColor: 'transparent',
          fill: false,
          tension: 0.45,
          pointBackgroundColor: '#f59e0b',
          pointBorderColor: isDark ? '#1e293b' : '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2,
          borderDash: [4, 3],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 700, easing: 'easeInOutQuart' },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            font:  { size: 11, family: "'Inter', sans-serif", weight: '500' },
            color: txtColor,
            usePointStyle: true,
            pointStyleWidth: 7,
            padding: 14,
            boxHeight: 7,
          },
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: tooltipBg,
          borderColor:     tooltipBorder,
          borderWidth:     1,
          titleColor:      tooltipTitle,
          bodyColor:       txtColor,
          padding:         10,
          cornerRadius:    8,
          titleFont: { size: 12, weight: '600', family: "'Inter', sans-serif" },
          bodyFont:  { size: 11, family: "'Inter', sans-serif" },
          callbacks: {
            title: items => items[0].label,
          },
        },
      },
      scales: {
        x: {
          grid:   { color: grid, drawBorder: false },
          border: { display: false },
          ticks:  { color: txtColor, font: { size: 11, family: "'Inter', sans-serif" }, maxRotation: 0 },
        },
        y: {
          grid:   { color: grid, drawBorder: false },
          border: { display: false },
          ticks:  {
            color: txtColor,
            font:  { size: 11, family: "'Inter', sans-serif" },
            stepSize: 1,
            precision: 0,
          },
          min: 0,
        },
      },
      interaction: { mode: 'index', intersect: false },
    },
  });
}

/* ── Security Password Toggles ──────────────────────────── */
function initSecurityToggles() {
  [
    { btnId: 'eyeSec1', inputId: 'currentPass', iconId: 'eyeSec1Icon' },
    { btnId: 'eyeSec2', inputId: 'newPass',     iconId: 'eyeSec2Icon' },
    { btnId: 'eyeSec3', inputId: 'confirmPass', iconId: 'eyeSec3Icon' },
  ].forEach(({ btnId, inputId, iconId }) => {
    const btn   = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    const icon  = document.getElementById(iconId);
    if (!btn || !input) return;

    let visible = false;
    btn.addEventListener('click', () => {
      visible = !visible;
      input.type = visible ? 'text' : 'password';
      if (icon) icon.setAttribute('data-lucide', visible ? 'eye-off' : 'eye');
      lucide.createIcons({ nodes: [btn] });
    });
  });
}

/* ── Session Info Card ─────────────────────────────────── */
function populateSessionCard() {
  const fbUser = FAUTH.currentUser;
  if (!fbUser) return;

  setText('sesCreated',  timeAgo(fbUser.metadata.lastSignInTime));
  setText('sesExpires',  t('sess_active'));
  /* Check if user chose LOCAL persistence (remember me) */
  const hasPersistence = !!Object.keys(localStorage)
    .find(k => k.includes('firebase') && k.includes(fbUser.uid));
  setText('sesRemember', t(hasPersistence ? 'sess_rem_yes' : 'sess_rem_no'));
}

/* ── Notification Bell ──────────────────────────────────── */
function initNotificationBell() {
  const btn      = document.getElementById('notifBtn');
  const dropdown = document.getElementById('notifDropdown');
  const badge    = document.getElementById('notifBadge');
  const list     = document.getElementById('notifList');
  const clearBtn = document.getElementById('notifClear');

  if (!btn) return;

  function loadNotifs() {
    const user = resolveCurrentUser();
    if (!user) return;

    const today = new Date().toDateString();
    const logs  = (window._fbActivity || []).filter(a =>
      a.userId === user.id && new Date(a.timestamp).toDateString() === today
    ).slice(0, 10);

    badge.textContent = logs.length;
    badge.hidden = logs.length === 0;

    if (!logs.length) {
      list.innerHTML = `<div class="notif-empty"><i data-lucide="bell-off"></i><p>${t('notif_empty')}</p></div>`;
    } else {
      list.innerHTML = logs.map(l => `
        <div class="notif-item">
          <div class="notif-item-dot"></div>
          <div>
            <div class="notif-item-text">${escHtml(l.description)}</div>
            <div class="notif-item-time">${timeAgo(l.timestamp)}</div>
          </div>
        </div>
      `).join('');
    }
    lucide.createIcons({ nodes: [list] });
  }

  loadNotifs();

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.hidden = !dropdown.hidden;
    if (!dropdown.hidden) loadNotifs();
  });

  clearBtn?.addEventListener('click', () => {
    badge.hidden = true;
    badge.textContent = '0';
    list.innerHTML = `<div class="notif-empty"><i data-lucide="bell-off"></i><p>${t('notif_empty')}</p></div>`;
    lucide.createIcons({ nodes: [list] });
    dropdown.hidden = true;
  });

  document.addEventListener('click', () => { dropdown.hidden = true; });
  dropdown?.addEventListener('click', e => e.stopPropagation());
}

/* ── Danger Zone ────────────────────────────────────────────── */
function initDangerZone() {
  document.getElementById('clearActivityBtn')?.addEventListener('click', () => {
    const user = resolveCurrentUser();
    if (!user) return;

    if (!confirm(t('confirm_clear_activity'))) return;

    FB.Activity.clearByUser(user.id).then(() => {
      window._fbActivity = window._fbActivity.filter(a => a.userId !== user.id);
      showToast(t('toast_activity_cleared'), 'success');
      populateActivity();
    });
  });

  document.getElementById('forceLogoutBtn')?.addEventListener('click', doLogout);
}

/* ── Users Management ───────────────────────────────────── */
function populateUsers(filter = '') {
  const allUsers = window._fbUsers || [];
  const query    = filter.trim().toLowerCase();

  const filtered = query
    ? allUsers.filter(u =>
        (u.fullName || '').toLowerCase().includes(query) ||
        (u.email    || '').toLowerCase().includes(query)
      )
    : allUsers;

  const tbody = document.getElementById('usersTableBody');
  const empty = document.getElementById('usersEmpty');
  const count = document.getElementById('usersCount');

  if (count) {
    count.textContent = t('users_count')
      .replace('{n}', filtered.length)
      .replace('{total}', allUsers.length);
  }

  if (!tbody) return;

  if (!filtered.length) {
    tbody.innerHTML = '';
    if (empty) empty.hidden = false;
    return;
  }

  if (empty) empty.hidden = true;

  const currentId = resolveCurrentUser()?.id;

  tbody.innerHTML = filtered.map(u => {
    const ini      = emailInitials(u.email);
    const isAdmin  = u.role === 'admin';
    const isActive = u.isActive !== false;
    const joined   = formatDate(u.createdAt);
    const lastSeen = timeAgo(u.lastLogin || u.createdAt);

    return `
      <tr>
        <td>
          <div class="user-cell">
            <div class="user-cell-avatar" translate="no">${ini}</div>
            <div>
              <div class="user-cell-name" translate="no">${escHtml(u.fullName || '—')}</div>
              <div class="user-cell-id">#${(u.id || '').slice(-6)}</div>
            </div>
          </div>
        </td>
        <td><span class="user-email">${escHtml(u.email)}</span></td>
        <td>
          <span class="badge ${isAdmin ? 'badge-admin' : 'badge-user'}">
            <span class="badge-dot"></span>
            ${isAdmin ? t('badge_admin') : t('badge_user')}
          </span>
        </td>
        <td>
          <span class="badge ${isActive ? 'badge-active' : 'badge-offline'}">
            <span class="badge-dot"></span>
            ${isActive ? t('badge_active') : t('badge_offline')}
          </span>
        </td>
        <td><span class="user-date">${joined}</span></td>
        <td><span class="user-ago">${lastSeen}</span></td>
        <td>
          <div class="user-actions">
            ${u.id !== currentId ? `
              <button class="btn-action ${isActive ? 'warn' : 'ok'}" title="${isActive ? t('action_deactivate') : t('action_activate')}"
                onclick="toggleUserActive('${u.id}', ${isActive})">
                <i data-lucide="${isActive ? 'user-x' : 'user-check'}"></i>
                <span>${isActive ? t('action_deactivate') : t('action_activate')}</span>
              </button>
              <button class="btn-action del" title="${t('action_delete')}"
                onclick="deleteUser('${u.id}')">
                <i data-lucide="trash-2"></i>
                <span>${t('action_delete')}</span>
              </button>
            ` : `<span class="user-self-badge">${t('badge_you')}</span>`}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  /* Render Lucide icons inside the dynamically created table */
  lucide.createIcons({ nodes: [tbody] });
}

/* ── User Action Handlers (called from inline onclick) ───── */
async function toggleUserActive(uid, isCurrentlyActive) {
  const me = resolveCurrentUser();
  if (!me) return;

  const next   = !isCurrentlyActive;
  const result = await FB.Users.setActive(uid, next);

  if (result.success) {
    const idx = (window._fbUsers || []).findIndex(u => u.id === uid);
    if (idx !== -1) window._fbUsers[idx].isActive = next;
    populateUsers(document.getElementById('userSearch')?.value || '');
    lucide.createIcons();
    showToast(t(next ? 'toast_user_activated' : 'toast_user_deactivated'), 'success');
    FB.Activity.log(me.id, 'update', `User #${uid.slice(-6)} ${next ? 'activated' : 'deactivated'}`);
  } else {
    showToast(result.message || t('toast_error'), 'error');
  }
}

async function deleteUser(uid) {
  const me = resolveCurrentUser();
  if (!me) return;

  if (!confirm(t('confirm_delete_user'))) return;

  const result = await FB.Users.remove(uid);

  if (result.success) {
    window._fbUsers     = (window._fbUsers     || []).filter(u => u.id !== uid);
    window._fbActivity  = (window._fbActivity  || []).filter(a => a.userId !== uid);
    if (window._fbStats) window._fbStats.totalUsers = Math.max(0, window._fbStats.totalUsers - 1);
    populateUsers(document.getElementById('userSearch')?.value || '');
    populateStats();
    showToast(t('toast_user_deleted'), 'success');
    FB.Activity.log(me.id, 'update', `User #${uid.slice(-6)} deleted`);
  } else {
    showToast(result.message || t('toast_error'), 'error');
  }
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function initUsersSearch() {
  const input = document.getElementById('userSearch');
  if (!input) return;
  input.addEventListener('input', () => populateUsers(input.value));
}

/* ── Navigation ──────────────────────────────────────────── */
/* Dynamic — uses t() so titles update on language change */
function _pageTitles() {
  return {
    overview: t('nav_overview'),
    users:    t('nav_users'),
    profile:  t('nav_profile'),
    security: t('nav_security'),
    settings: t('nav_settings'),
  };
}

function navigateTo(pageId) {
  /* Hide all pages */
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  /* Show target page */
  const page = document.getElementById(`page-${pageId}`);
  if (page) page.classList.add('active');

  /* Highlight nav */
  document.querySelectorAll(`.nav-item[data-page="${pageId}"]`)
    .forEach(n => n.classList.add('active'));

  /* Update topbar title */
  setText('pageTitle', _pageTitles()[pageId] || pageId);

  /* Close dropdown & sidebar */
  closeDropdown();
  closeSidebar();

  /* Refresh data on page */
  if (pageId === 'overview') {
    populateStats();
    populateActivity();
    drawWeeklyChart();
  }
  if (pageId === 'users')    populateUsers();
  if (pageId === 'profile')  populateProfilePage();
  if (pageId === 'security') populateSessionCard();
}

function initNav() {
  document.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.page));
  });
}

/* ── User Dropdown ───────────────────────────────────────── */
function closeDropdown() {
  const dropdown = document.getElementById('userDropdown');
  const menu     = document.getElementById('userMenu');
  if (dropdown) dropdown.hidden = true;
  if (menu) menu.classList.remove('open');
}

function initUserDropdown() {
  const btn      = document.getElementById('userMenuBtn');
  const dropdown = document.getElementById('userDropdown');
  const menu     = document.getElementById('userMenu');

  btn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = !dropdown.hidden;
    dropdown.hidden = isOpen;
    menu.classList.toggle('open', !isOpen);
  });

  document.addEventListener('click', closeDropdown);
  dropdown?.addEventListener('click', e => e.stopPropagation());
}

/* ── Mobile Sidebar ──────────────────────────────────────── */
function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebarOverlay')?.classList.remove('open');
}

function initMobileSidebar() {
  document.getElementById('menuToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('open');
    document.getElementById('sidebarOverlay')?.classList.toggle('open');
  });

  document.getElementById('sidebarOverlay')?.addEventListener('click', closeSidebar);
}

/* ── Logout ──────────────────────────────────────────────── */
function doLogout() {
  FB.Auth.logout().finally(() => {
    window._fbUser = null;
    window._fbUsers = [];
    window._fbActivity = [];
    window.location.href = 'index.html';
  });
}

function initLogout() {
  document.getElementById('logoutBtn')?.addEventListener('click', doLogout);
  document.getElementById('logoutDropBtn')?.addEventListener('click', doLogout);
}
