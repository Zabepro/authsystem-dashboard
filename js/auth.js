/* ============================================================
   AUTH.JS — Login & Register Logic
   Handles: Validation, Login, Register, Toast, Theme, Routing
   ============================================================ */

/* ══════════════════════════════════════════════════════════
   TOAST NOTIFICATION SYSTEM
   ══════════════════════════════════════════════════════════ */
const Toast = {

  container: null,

  init() {
    this.container = document.getElementById('toastContainer');
  },

  show({ title, message = '', type = 'info', duration = 4000 }) {
    if (!this.container) return;

    const icons = {
      success: '✓',
      error:   '✕',
      info:    'ℹ',
      warning: '⚠',
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${icons[type]}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-message">${message}</div>` : ''}
      </div>
      <button class="toast-close" aria-label="Funga">✕</button>
    `;

    /* Close button */
    toast.querySelector('.toast-close').addEventListener('click', () => {
      this._remove(toast);
    });

    this.container.appendChild(toast);

    /* Auto remove */
    const timer = setTimeout(() => this._remove(toast), duration);
    toast._timer = timer;
  },

  _remove(toast) {
    clearTimeout(toast._timer);
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  },

  success(title, message) { this.show({ title, message, type: 'success' }); },
  error(title, message)   { this.show({ title, message, type: 'error' });   },
  info(title, message)    { this.show({ title, message, type: 'info' });    },
  warning(title, message) { this.show({ title, message, type: 'warning' }); },
};

/* ══════════════════════════════════════════════════════════
   VALIDATION HELPERS
   ══════════════════════════════════════════════════════════ */
const Validate = {

  email(value) {
    if (!value.trim()) return 'Barua pepe yako inahitajika ili kuendelee';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Muundo si sahihi — tumia: jina@domain.com';
    return null;
  },

  password(value) {
    if (!value) return 'Nywila inahitajika ili kulinda akaunti yako';
    if (value.length < 8) return 'Nywila lazima iwe na herufi 8 au zaidi';
    return null;
  },

  passwordStrong(value) {
    if (!value)                          return 'Nywila inahitajika ili kulinda akaunti yako';
    if (value.length < 8)                return 'Nywila lazima iwe na herufi 8 au zaidi';
    if (!/[A-Z]/.test(value))            return 'Ongeza herufi kubwa angalau moja (mfano: A, B, C)';
    if (!/[0-9]/.test(value))            return 'Ongeza nambari angalau moja (mfano: 1, 2, 3)';
    if (!/[^A-Za-z0-9]/.test(value))    return 'Ongeza alama maalum angalau moja (mfano: @, #, !)';
    return null;
  },

  fullName(value) {
    if (!value.trim())                   return 'Jina kamili lako linahitajika';
    if (value.trim().length < 3)         return 'Jina lazima liwe na angalau herufi 3';
    if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'Jina liwe na herufi za kawaida tu, bila nambari';
    return null;
  },

  /* Nguvu ya nywila — rudisha 1-4 */
  passwordStrength(value) {
    let score = 0;
    if (value.length >= 8)           score++;
    if (/[A-Z]/.test(value))         score++;
    if (/[0-9]/.test(value))         score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    return score;
  },
};

/* ══════════════════════════════════════════════════════════
   FORM FIELD HELPER — Weka hali ya field (success/error)
   ══════════════════════════════════════════════════════════ */
const Field = {

  setError(groupId, errorId, message) {
    const group = document.getElementById(groupId);
    const error = document.getElementById(errorId);
    if (!group || !error) return;

    group.classList.remove('success', 'do-shake');
    group.classList.add('error');
    error.textContent = message;
    error.classList.add('visible');

    /* Trigger shake */
    void group.offsetHeight;
    group.classList.add('do-shake');
    setTimeout(() => group.classList.remove('do-shake'), 600);
  },

  setSuccess(groupId, errorId) {
    const group = document.getElementById(groupId);
    const error = document.getElementById(errorId);
    if (!group || !error) return;

    group.classList.remove('error');
    group.classList.add('success');
    error.innerHTML = '';
    error.classList.remove('visible');
  },

  clear(groupId, errorId) {
    const group = document.getElementById(groupId);
    const error = document.getElementById(errorId);
    if (!group) return;

    group.classList.remove('error', 'success');
    if (error) {
      error.innerHTML = '';
      error.classList.remove('visible');
    }
  },
};


/* ══════════════════════════════════════════════════════════
   BUTTON LOADING STATE
   ══════════════════════════════════════════════════════════ */
function setButtonLoading(btn, loading) {
  const text    = btn.querySelector('.btn-text');
  const spinner = btn.querySelector('.btn-spinner');
  const arrow   = btn.querySelector('.btn-arrow');

  if (loading) {
    btn.classList.add('loading');
    btn.disabled = true;
    if (spinner) spinner.hidden = false;
    if (arrow)   arrow.style.display = 'none';
  } else {
    btn.classList.remove('loading');
    btn.disabled = false;
    if (spinner) spinner.hidden = true;
    if (arrow)   arrow.style.display = '';
  }
}

/* ══════════════════════════════════════════════════════════
   RIPPLE EFFECT ON BUTTON CLICK
   ══════════════════════════════════════════════════════════ */
function addRipple(btn, e) {
  const rect   = btn.getBoundingClientRect();
  const size   = Math.max(rect.width, rect.height);
  const x      = e.clientX - rect.left - size / 2;
  const y      = e.clientY - rect.top  - size / 2;

  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
}

/* ══════════════════════════════════════════════════════════
   SCROLL TO FIRST ERROR
   ══════════════════════════════════════════════════════════ */
function scrollToFirstError() {
  const first = document.querySelector('.form-group.error');
  if (!first) return;
  first.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const input = first.querySelector('input');
  if (input) setTimeout(() => input.focus(), 350);
}

function highlightTerms() {
  const el = document.getElementById('termsGroup');
  if (!el) return;
  el.classList.remove('terms-error');
  void el.offsetHeight;
  el.classList.add('terms-error');
  setTimeout(() => el.classList.remove('terms-error'), 1400);
}

function initTheme() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const saved = FB.Settings.getTheme();
  document.documentElement.setAttribute('data-theme', saved);
  setTimeout(() => _applyThemeIcon(saved), 50);

  btn.addEventListener('click', () => {
    const next = FB.Settings.toggleTheme();
    _applyThemeIcon(next);
    btn.style.transform = 'scale(1.15) rotate(180deg)';
    setTimeout(() => { btn.style.transform = ''; }, 400);
  });
}

function _applyThemeIcon(theme) {
  const moonEl = document.getElementById('moonIcon');
  const sunEl  = document.getElementById('sunIcon');
  if (!moonEl || !sunEl) return;
  moonEl.classList.toggle('hidden', theme === 'dark');
  sunEl.classList.toggle('hidden',  theme !== 'dark');
}

/* ══════════════════════════════════════════════════════════
   PASSWORD TOGGLE (show / hide)
   ══════════════════════════════════════════════════════════ */
function initPasswordToggle(toggleId, inputId, iconId) {
  const toggle = document.getElementById(toggleId);
  const input  = document.getElementById(inputId);
  const icon   = document.getElementById(iconId);
  if (!toggle || !input) return;

  const eyeOpen   = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
  const eyeClosed = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`;

  let visible = false;

  toggle.addEventListener('click', () => {
    visible = !visible;
    input.type    = visible ? 'text' : 'password';
    if (icon) icon.innerHTML = visible ? eyeClosed : eyeOpen;
  });
}

/* ══════════════════════════════════════════════════════════
   PASSWORD STRENGTH METER (Register page)
   ══════════════════════════════════════════════════════════ */
function initStrengthMeter() {
  const input     = document.getElementById('regPassword');
  const container = document.getElementById('strengthContainer');
  const label     = document.getElementById('strengthLabel');
  const bars      = [
    document.getElementById('sbar1'),
    document.getElementById('sbar2'),
    document.getElementById('sbar3'),
    document.getElementById('sbar4'),
  ];
  const reqs = {
    length:  document.getElementById('req-length'),
    upper:   document.getElementById('req-upper'),
    number:  document.getElementById('req-number'),
    special: document.getElementById('req-special'),
  };

  if (!input || !container) return;

  const levels = [
    { label: 'Dhaifu',   cls: 'weak'   },
    { label: 'Wastani',  cls: 'fair'   },
    { label: 'Nzuri',    cls: 'good'   },
    { label: 'Imara',    cls: 'strong' },
  ];

  const reqsPanel = document.getElementById('passRequirements');

  input.addEventListener('focus', () => {
    if (reqsPanel) reqsPanel.classList.add('req-visible');
  });

  input.addEventListener('input', () => {
    const val   = input.value;
    const score = Validate.passwordStrength(val);

    if (!val) {
      container.classList.remove('visible');
      if (reqsPanel) reqsPanel.classList.remove('req-visible');
      return;
    }

    container.classList.add('visible');
    if (reqsPanel) reqsPanel.classList.add('req-visible');

    /* Update bars */
    bars.forEach((bar, i) => {
      bar.className = 'strength-bar';
      if (i < score) bar.classList.add(levels[score - 1].cls);
    });

    /* Update label */
    label.textContent = levels[score - 1].label;
    label.className   = `strength-label ${levels[score - 1].cls}`;

    /* Update requirements */
    _setReq(reqs.length,  val.length >= 8);
    _setReq(reqs.upper,   /[A-Z]/.test(val));
    _setReq(reqs.number,  /[0-9]/.test(val));
    _setReq(reqs.special, /[^A-Za-z0-9]/.test(val));
  });

  input.addEventListener('blur', () => {
    if (!input.value && reqsPanel) reqsPanel.classList.remove('req-visible');
  });

  function _setReq(el, met) {
    if (!el) return;
    el.classList.toggle('met', met);
    const icon = el.querySelector('.req-icon svg');
    if (icon) {
      icon.setAttribute('data-lucide', met ? 'check-circle' : 'circle');
      lucide.createIcons({ nodes: [icon.parentElement] });
    }
  }
}

/* ══════════════════════════════════════════════════════════
   CONFIRM PASSWORD — Real-time match check
   ══════════════════════════════════════════════════════════ */
function initConfirmCheck() {
  const passInput    = document.getElementById('regPassword');
  const confirmInput = document.getElementById('regConfirm');
  if (!passInput || !confirmInput) return;

  confirmInput.addEventListener('input', () => {
    if (!confirmInput.value) {
      Field.clear('confirmGroup', 'confirmError');
      return;
    }
    if (confirmInput.value === passInput.value) {
      Field.setSuccess('confirmGroup', 'confirmError');
    } else {
      Field.setError('confirmGroup', 'confirmError', 'Nywila hazifanani.');
    }
  });
}

/* ══════════════════════════════════════════════════════════
   REAL-TIME FIELD VALIDATION (blur events)
   ══════════════════════════════════════════════════════════ */
function initRealtimeValidation(page) {
  if (page === 'login') {
    const emailInput = document.getElementById('loginEmail');
    const passInput  = document.getElementById('loginPassword');

    emailInput?.addEventListener('blur', () => {
      const err = Validate.email(emailInput.value);
      err ? Field.setError('emailGroup', 'emailError', err)
          : Field.setSuccess('emailGroup', 'emailError');
    });

    emailInput?.addEventListener('input', () => {
      if (emailInput.value === '') Field.clear('emailGroup', 'emailError');
    });

    passInput?.addEventListener('blur', () => {
      const err = Validate.password(passInput.value);
      err ? Field.setError('passwordGroup', 'passwordError', err)
          : Field.setSuccess('passwordGroup', 'passwordError');
    });
  }

  if (page === 'register') {
    const nameInput  = document.getElementById('regName');
    const emailInput = document.getElementById('regEmail');
    const passInput  = document.getElementById('regPassword');

    nameInput?.addEventListener('blur', () => {
      const err = Validate.fullName(nameInput.value);
      err ? Field.setError('nameGroup', 'nameError', err)
          : Field.setSuccess('nameGroup', 'nameError');
    });

    emailInput?.addEventListener('blur', () => {
      const err = Validate.email(emailInput.value);
      if (err) { Field.setError('emailGroup', 'emailError', err); return; }
      /* Angalia kama email ipo tayari */
      if (DB.Users.emailExists(emailInput.value)) {
        Field.setError('emailGroup', 'emailError', 'Email hii tayari imesajiliwa.');
      } else {
        Field.setSuccess('emailGroup', 'emailError');
      }
    });

    passInput?.addEventListener('blur', () => {
      const err = Validate.passwordStrong(passInput.value);
      err ? Field.setError('passwordGroup', 'passwordError', err)
          : Field.setSuccess('passwordGroup', 'passwordError');
    });
  }
}

/* ══════════════════════════════════════════════════════════
   LOGIN PAGE LOGIC
   ══════════════════════════════════════════════════════════ */
function initLoginPage() {
  Toast.init();
  initTheme();
  initPasswordToggle('passwordToggle', 'loginPassword', 'eyeIcon');
  initRealtimeValidation('login');

  /* Redirect if already signed in via Firebase */
  FAUTH.onAuthStateChanged((fbUser) => {
    if (fbUser) window.location.href = 'dashboard.html';
  });

  /* ── Login Form Submit ── */
  const form     = document.getElementById('loginForm');
  const loginBtn = document.getElementById('loginBtn');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    addRipple(loginBtn, e);

    const email    = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const remember = document.getElementById('rememberMe').checked;

    let valid = true;
    const emailErr = Validate.email(email);
    if (emailErr) { Field.setError('emailGroup', 'emailError', emailErr); valid = false; }
    else Field.setSuccess('emailGroup', 'emailError');

    const passErr = Validate.password(password);
    if (passErr) { Field.setError('passwordGroup', 'passwordError', passErr); valid = false; }
    else Field.setSuccess('passwordGroup', 'passwordError');

    if (!valid) {
      Toast.error('Fomu Ina Makosa', 'Tafadhali angalia na sahihisha sehemu zilizowaka nyekundu.');
      scrollToFirstError();
      return;
    }

    setButtonLoading(loginBtn, true);

    /* ─ Firebase Login ─ */
    const result = await FB.Auth.login(email, password, remember);
    setButtonLoading(loginBtn, false);

    if (!result.success) {
      if (result.googleAccount) {
        /* Google-only account — guide user */
        Field.setError('emailGroup', 'emailError', 'Akaunti hii inatumia Google Sign-In');
        Field.clear('passwordGroup', 'passwordError');
        Toast.warning('Akaunti ya Google', result.message);
        /* Highlight Google button */
        const gBtn = document.getElementById('googleBtn');
        if (gBtn) {
          gBtn.style.transition = 'box-shadow 0.3s';
          gBtn.style.boxShadow  = '0 0 0 3px rgba(66,133,244,0.5)';
          setTimeout(() => { gBtn.style.boxShadow = ''; }, 3000);
        }
      } else {
        Toast.error('Imeshindwa Kuingia', result.message);
        Field.setError('emailGroup',    'emailError',    'Angalia barua pepe au nywila');
        Field.setError('passwordGroup', 'passwordError', result.message);
      }
      return;
    }

    const firstName = result.user.fullName.split(' ')[0];
    Toast.success(`Karibu, ${firstName}! 🎉`, 'Umeingia mfumoni — unakupelekwa dashibodini.');

    await _delay(1200);
    window.location.href = 'dashboard.html';
  });

  /* ─ Google Login Button ─ */
  document.getElementById('googleBtn')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    setButtonLoading(btn, true);
    const result = await FB.Auth.loginWithGoogle();
    setButtonLoading(btn, false);
    if (result.success) {
      window.location.href = 'dashboard.html';
    } else if (result.message) {
      Toast.error('Google Sign-In Imeshindwa', result.message);
    }
  });

  /* ── Forgot Password Modal ── */
  const forgotLink   = document.getElementById('forgotLink');
  const forgotModal  = document.getElementById('forgotModal');
  const modalClose   = document.getElementById('modalClose');
  const forgotSubmit = document.getElementById('forgotSubmit');

  forgotLink?.addEventListener('click', (e) => {
    e.preventDefault();
    forgotModal.hidden = false;
    document.getElementById('forgotEmail')?.focus();
  });

  modalClose?.addEventListener('click', () => {
    forgotModal.hidden = true;
  });

  forgotModal?.addEventListener('click', (e) => {
    if (e.target === forgotModal) forgotModal.hidden = true;
  });

  forgotSubmit?.addEventListener('click', async () => {
    const email = document.getElementById('forgotEmail').value.trim();
    if (!email) {
      Toast.warning('Sehemu Tupu', 'Tafadhali weka barua pepe yako kwanza.');
      return;
    }
    if (Validate.email(email)) {
      Toast.error('Barua Pepe Si Sahihi', 'Muundo wa barua pepe si sahihi — tumia: jina@domain.com');
      return;
    }

    setButtonLoading(forgotSubmit, true);
    try {
      await FAUTH.sendPasswordResetEmail(email);
      setButtonLoading(forgotSubmit, false);
      forgotModal.hidden = true;
      Toast.success('Barua Pepe Imetumwa!', `Angalia sanduku lako la barua pepe (${email}) kwa maelekezo ya kubadilisha nywila.`);
    } catch (err) {
      setButtonLoading(forgotSubmit, false);
      const msg = err.code === 'auth/user-not-found'
        ? 'Barua pepe hii haijaandikishwa kwenye mfumo.'
        : 'Hitilafu imetokea. Jaribu tena.';
      Toast.error('Imeshindwa', msg);
    }
  });
}

/* ══════════════════════════════════════════════════════════
   REGISTER PAGE LOGIC
   ══════════════════════════════════════════════════════════ */
function initRegisterPage() {
  Toast.init();

  /* Redirect if already signed in via Firebase */
  FAUTH.onAuthStateChanged((fbUser) => {
    if (fbUser) window.location.href = 'dashboard.html';
  });
  initTheme();
  initPasswordToggle('passToggle1', 'regPassword',  'eyeIcon1');
  initPasswordToggle('passToggle2', 'regConfirm',   'eyeIcon2');
  initStrengthMeter();
  initConfirmCheck();
  initRealtimeValidation('register');
  /* Update email check to use Firebase */
  document.getElementById('regEmail')?.addEventListener('blur', async () => {
    const emailEl = document.getElementById('regEmail');
    if (!emailEl) return;
    const err = Validate.email(emailEl.value);
    if (err) { Field.setError('emailGroup', 'emailError', err); return; }
    const exists = await FB.Auth.emailExists(emailEl.value);
    if (exists) {
      Field.setError('emailGroup', 'emailError', 'Email hii tayari imesajiliwa.');
    } else {
      Field.setSuccess('emailGroup', 'emailError');
    }
  });

  /* ── Google Button (Register) ── */
  document.getElementById('googleBtnReg')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    setButtonLoading(btn, true);
    const result = await FB.Auth.loginWithGoogle();
    setButtonLoading(btn, false);
    if (result.success) {
      window.location.href = 'dashboard.html';
    } else if (result.message) {
      Toast.error('Google Sign-In Imeshindwa', result.message);
    }
  });

  const form        = document.getElementById('registerForm');
  const registerBtn = document.getElementById('registerBtn');
  const successOverlay = document.getElementById('successOverlay');
  const successBar  = document.getElementById('successBar');
  const stepsLeft   = document.querySelectorAll('.reg-step');

  /* ── Form Submit ── */
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    addRipple(registerBtn, e);

    const fullName = document.getElementById('regName').value.trim();
    const email    = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm  = document.getElementById('regConfirm').value;
    const terms    = document.getElementById('agreeTerms').checked;

    let valid = true;

    const nameErr = Validate.fullName(fullName);
    if (nameErr) { Field.setError('nameGroup', 'nameError', nameErr); valid = false; }
    else Field.setSuccess('nameGroup', 'nameError');

    const emailErr = Validate.email(email);
    if (emailErr) { Field.setError('emailGroup', 'emailError', emailErr); valid = false; }
    else Field.setSuccess('emailGroup', 'emailError');

    const passErr = Validate.passwordStrong(password);
    if (passErr) { Field.setError('passwordGroup', 'passwordError', passErr); valid = false; }
    else Field.setSuccess('passwordGroup', 'passwordError');

    if (!password || confirm !== password) {
      Field.setError('confirmGroup', 'confirmError', 'Nywila mbili hazilingani — ziandike tena sawa');
      valid = false;
    } else if (!passErr) {
      Field.setSuccess('confirmGroup', 'confirmError');
    }

    if (!terms) { highlightTerms(); valid = false; }

    if (!valid) {
      Toast.error('Fomu Ina Makosa', 'Sahihisha sehemu zilizowaka nyekundu.');
      scrollToFirstError();
      return;
    }

    setButtonLoading(registerBtn, true);
    _setStep(stepsLeft, 2);

    /* ─ Firebase Register ─ */
    const result = await FB.Auth.register({ fullName, email, password });
    setButtonLoading(registerBtn, false);

    if (!result.success) {
      Toast.error('Usajili Umeshindwa', result.message);
      _setStep(stepsLeft, 1);
      return;
    }

    _setStep(stepsLeft, 3);

    if (successOverlay) {
      successOverlay.hidden = false;
      let progress = 0;
      const interval = setInterval(() => {
        progress += 2;
        if (successBar) successBar.style.width = progress + '%';
        if (progress >= 100) {
          clearInterval(interval);
          window.location.href = 'dashboard.html';
        }
      }, 50);
    } else {
      await _delay(600);
      window.location.href = 'dashboard.html';
    }
  });
}

/* ══════════════════════════════════════════════════════════
   HELPER — Set active step on register left panel
   ══════════════════════════════════════════════════════════ */
function _setStep(steps, active) {
  steps.forEach((step) => {
    const n = parseInt(step.dataset.step);
    step.classList.remove('active', 'done');
    if (n < active)  step.classList.add('done');
    if (n === active) step.classList.add('active');
  });
}

/* ══════════════════════════════════════════════════════════
   HELPER — Delay (simulate async)
   ══════════════════════════════════════════════════════════ */
function _delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ══════════════════════════════════════════════════════════
   AUTO DETECT PAGE & INITIALIZE
   ══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  const page = path.includes('register') ? 'register' : 'login';

  if (page === 'login')    initLoginPage();
  if (page === 'register') initRegisterPage();
});
