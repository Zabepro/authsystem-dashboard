/* ============================================================
   STORAGE.JS — LocalStorage Database Manager
   Handles: Users, Sessions, Activity Logs, Settings
   ============================================================ */

const DB = {

  /* ─── Keys za LocalStorage ──────────────────────────────── */
  KEYS: {
    USERS:        'auth_users',
    SESSION:      'auth_session',
    REMEMBER:     'auth_remember',
    SETTINGS:     'auth_settings',
    ACTIVITY:     'auth_activity',
    THEME:        'auth_theme',
  },

  /* ══════════════════════════════════════════════════════════
     HELPER METHODS — Soma/Andika JSON kwenye LocalStorage
     ══════════════════════════════════════════════════════════ */

  _get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  _set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  _remove(key) {
    localStorage.removeItem(key);
  },

  /* ══════════════════════════════════════════════════════════
     USERS — Usimamizi wa Watumiaji
     ══════════════════════════════════════════════════════════ */

  Users: {

    /* Pata orodha yote ya users */
    getAll() {
      return DB._get(DB.KEYS.USERS) || [];
    },

    /* Pata user mmoja kwa email */
    getByEmail(email) {
      const users = this.getAll();
      return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    },

    /* Pata user mmoja kwa id */
    getById(id) {
      const users = this.getAll();
      return users.find(u => u.id === id) || null;
    },

    /* Ongeza user mpya */
    create({ fullName, email, password, avatar = null }) {
      const users = this.getAll();

      /* Hakikisha email haipo tayari */
      if (this.getByEmail(email)) {
        return { success: false, message: 'Email hii tayari imesajiliwa.' };
      }

      const newUser = {
        id:        DB._generateId(),
        fullName:  fullName.trim(),
        email:     email.toLowerCase().trim(),
        password:  DB._hashPassword(password),
        avatar:    avatar || DB._generateAvatar(fullName),
        role:      'user',
        createdAt: new Date().toISOString(),
        lastLogin: null,
        loginCount:0,
        isActive:  true,
      };

      users.push(newUser);
      DB._set(DB.KEYS.USERS, users);

      DB.Activity.log(newUser.id, 'register', 'Akaunti mpya imeundwa');

      /* Rudisha user bila password */
      const { password: _, ...safeUser } = newUser;
      return { success: true, user: safeUser };
    },

    /* Sasisha taarifa za user */
    update(id, updates) {
      const users = this.getAll();
      const index = users.findIndex(u => u.id === id);

      if (index === -1) {
        return { success: false, message: 'Mtumiaji hapatikani.' };
      }

      /* Usisasishe password hapa bila hash */
      if (updates.password) {
        updates.password = DB._hashPassword(updates.password);
      }

      users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
      DB._set(DB.KEYS.USERS, users);

      const { password: _, ...safeUser } = users[index];
      return { success: true, user: safeUser };
    },

    /* Verify email + password wakati wa login */
    verify(email, password) {
      const user = this.getByEmail(email);

      if (!user) {
        return { success: false, message: 'Email hii haipo kwenye mfumo.' };
      }

      if (!user.isActive) {
        return { success: false, message: 'Akaunti yako imezimwa. Wasiliana na msaada.' };
      }

      if (user.password !== DB._hashPassword(password)) {
        return { success: false, message: 'Nywila si sahihi. Jaribu tena.' };
      }

      /* Sasisha lastLogin na loginCount */
      this.update(user.id, {
        lastLogin:  new Date().toISOString(),
        loginCount: (user.loginCount || 0) + 1,
      });

      DB.Activity.log(user.id, 'login', 'Umeingia mfumoni');

      const { password: _, ...safeUser } = user;
      return { success: true, user: safeUser };
    },

    /* Angalia kama email tayari ipo */
    emailExists(email) {
      return !!this.getByEmail(email);
    },
  },

  /* ══════════════════════════════════════════════════════════
     SESSION — Usimamizi wa Kikao (Login State)
     ══════════════════════════════════════════════════════════ */

  Session: {

    /* Weka session baada ya login */
    create(user, remember = false) {
      const session = {
        userId:    user.id,
        email:     user.email,
        fullName:  user.fullName,
        avatar:    user.avatar,
        role:      user.role,
        createdAt: new Date().toISOString(),
        expiresAt: remember
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() /* 30 siku */
          : new Date(Date.now() +  1 * 24 * 60 * 60 * 1000).toISOString(), /* 1 siku */
        remember,
      };

      DB._set(DB.KEYS.SESSION, session);

      if (remember) {
        DB._set(DB.KEYS.REMEMBER, { email: user.email });
      }

      return session;
    },

    /* Pata session ya sasa */
    get() {
      const session = DB._get(DB.KEYS.SESSION);
      if (!session) return null;

      /* Angalia kama session imeisha muda */
      if (new Date() > new Date(session.expiresAt)) {
        this.destroy();
        return null;
      }

      return session;
    },

    /* Angalia kama mtumiaji ameingia */
    isLoggedIn() {
      return !!this.get();
    },

    /* Pata data kamili ya user wa sasa */
    getCurrentUser() {
      const session = this.get();
      if (!session) return null;
      return DB.Users.getById(session.userId);
    },

    /* Futa session (logout) */
    destroy() {
      const session = DB._get(DB.KEYS.SESSION);
      if (session) {
        DB.Activity.log(session.userId, 'logout', 'Umetoka mfumoni');
      }
      DB._remove(DB.KEYS.SESSION);
    },

    /* Pata email iliyokumbukwa (Remember Me) */
    getRememberedEmail() {
      const data = DB._get(DB.KEYS.REMEMBER);
      return data ? data.email : '';
    },

    /* Futa email iliyokumbukwa */
    clearRemembered() {
      DB._remove(DB.KEYS.REMEMBER);
    },
  },

  /* ══════════════════════════════════════════════════════════
     ACTIVITY — Historia ya Matendo ya Mtumiaji
     ══════════════════════════════════════════════════════════ */

  Activity: {

    /* Rekodi tendo jipya */
    log(userId, type, description) {
      const all    = DB._get(DB.KEYS.ACTIVITY) || [];
      const entry  = {
        id:          DB._generateId(),
        userId,
        type,        /* 'login' | 'logout' | 'register' | 'update' | 'custom' */
        description,
        timestamp:   new Date().toISOString(),
        icon:        this._getIcon(type),
      };

      all.unshift(entry); /* Ongeza mwanzoni */

      /* Weka hifadhi mpaka rekodi 100 tu */
      DB._set(DB.KEYS.ACTIVITY, all.slice(0, 100));
    },

    /* Pata historia ya user mmoja */
    getByUser(userId, limit = 10) {
      const all = DB._get(DB.KEYS.ACTIVITY) || [];
      return all.filter(a => a.userId === userId).slice(0, limit);
    },

    /* Pata historia yote */
    getAll(limit = 50) {
      const all = DB._get(DB.KEYS.ACTIVITY) || [];
      return all.slice(0, limit);
    },

    /* Icon kwa kila aina ya tendo */
    _getIcon(type) {
      const icons = {
        login:    '🔑',
        logout:   '👋',
        register: '🎉',
        update:   '✏️',
        custom:   '📌',
      };
      return icons[type] || '📌';
    },
  },

  /* ══════════════════════════════════════════════════════════
     SETTINGS — Mipangilio ya Mtumiaji
     ══════════════════════════════════════════════════════════ */

  Settings: {

    defaults: {
      theme:        'light',  /* 'light' | 'dark' */
      language:     'sw',
      notifications: true,
      sidebarOpen:  true,
    },

    get() {
      const saved = DB._get(DB.KEYS.SETTINGS);
      return { ...this.defaults, ...saved };
    },

    set(updates) {
      const current = this.get();
      DB._set(DB.KEYS.SETTINGS, { ...current, ...updates });
    },

    getTheme() {
      return this.get().theme;
    },

    setTheme(theme) {
      this.set({ theme });
      document.documentElement.setAttribute('data-theme', theme);
    },

    toggleTheme() {
      const current = this.getTheme();
      const next    = current === 'light' ? 'dark' : 'light';
      this.setTheme(next);
      return next;
    },
  },

  /* ══════════════════════════════════════════════════════════
     STATS — Takwimu za Dashboard
     ══════════════════════════════════════════════════════════ */

  Stats: {

    get() {
      const users    = DB.Users.getAll();
      const activity = DB.Activity.getAll(100);
      const now      = new Date();
      const today    = now.toDateString();

      const loginsToday = activity.filter(a =>
        a.type === 'login' && new Date(a.timestamp).toDateString() === today
      ).length;

      const newThisWeek = users.filter(u => {
        const created = new Date(u.createdAt);
        const diff    = (now - created) / (1000 * 60 * 60 * 24);
        return diff <= 7;
      }).length;

      return {
        totalUsers:   users.length,
        activeUsers:  users.filter(u => u.isActive).length,
        loginsToday,
        newThisWeek,
      };
    },

    /* Takwimu za logins kwa siku 7 zilizopita */
    getWeeklyLogins() {
      const activity = DB.Activity.getAll(100);
      const result   = [];

      for (let i = 6; i >= 0; i--) {
        const date  = new Date();
        date.setDate(date.getDate() - i);
        const label = date.toLocaleDateString('sw', { weekday: 'short' });
        const count = activity.filter(a => {
          return a.type === 'login' &&
            new Date(a.timestamp).toDateString() === date.toDateString();
        }).length;

        result.push({ label, count });
      }

      return result;
    },
  },

  /* ══════════════════════════════════════════════════════════
     UTILITIES — Zana za Msaada
     ══════════════════════════════════════════════════════════ */

  /* Tengeneza ID ya kipekee */
  _generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  },

  /* Hash rahisi ya password (kwa mfano wa elimu — si kwa production) */
  _hashPassword(password) {
    let hash = 0;
    const str = password + 'auth_salt_2025';
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(8, '0') + str.length.toString(16);
  },

  /* Tengeneza avatar ya harfi za jina (initials) */
  _generateAvatar(fullName) {
    const parts    = fullName.trim().split(' ');
    const initials = parts.length >= 2
      ? parts[0][0] + parts[parts.length - 1][0]
      : parts[0].slice(0, 2);
    return initials.toUpperCase();
  },

  /* ══════════════════════════════════════════════════════════
     INITIALIZE — Weka data ya mfano wakati wa kwanza
     ══════════════════════════════════════════════════════════ */

  init() {
    /* Weka theme iliyohifadhiwa */
    const theme = this.Settings.getTheme();
    document.documentElement.setAttribute('data-theme', theme);

    /* Ikiwa hakuna users, unda demo user moja */
    if (this.Users.getAll().length === 0) {
      this.Users.create({
        fullName: 'Demo User',
        email:    'demo@example.com',
        password: 'Demo@1234',
      });
    }
  },
};

/* Fanya DB ipatikane globally */
window.DB = DB;
