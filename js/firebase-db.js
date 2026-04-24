/* ============================================================
   FIREBASE-DB.JS — Firebase Auth + Firestore Wrapper
   Replaces localStorage-only storage with real Firebase backend
   ============================================================ */

const FB = {

  /* ══════════════════════════════════════════════════════════
     AUTH — Registration, Login, Logout
     ══════════════════════════════════════════════════════════ */
  Auth: {

    /* Register a new user */
    async register({ fullName, email, password }) {
      try {
        const cred = await FAUTH.createUserWithEmailAndPassword(email.toLowerCase().trim(), password);
        const uid  = cred.user.uid;

        await cred.user.updateProfile({ displayName: fullName.trim() });

        const userData = {
          id:         uid,
          fullName:   fullName.trim(),
          email:      email.toLowerCase().trim(),
          role:       'user',
          createdAt:  new Date().toISOString(),
          lastLogin:  new Date().toISOString(),
          loginCount: 1,
          isActive:   true,
          avatarUrl:  cred.user.photoURL || '',
          settings:   { theme: 'light', language: 'en', notifications: true },
        };

        await FDB.collection('users').doc(uid).set(userData);
        await FB.Activity.log(uid, 'register', 'Akaunti mpya imeundwa');

        return { success: true, user: userData };
      } catch (err) {
        return { success: false, message: FB._authError(err.code) };
      }
    },

    /* Login an existing user */
    async login(email, password, remember = false) {
      try {
        /* Set persistence before signing in */
        const persistence = remember
          ? firebase.auth.Auth.Persistence.LOCAL
          : firebase.auth.Auth.Persistence.SESSION;
        await FAUTH.setPersistence(persistence);

        const cred = await FAUTH.signInWithEmailAndPassword(email.toLowerCase().trim(), password);
        const uid  = cred.user.uid;

        const snap = await FDB.collection('users').doc(uid).get();
        if (!snap.exists) {
          await FAUTH.signOut();
          return { success: false, message: 'Akaunti haipatikani kwenye mfumo.' };
        }

        const userData = snap.data();

        if (!userData.isActive) {
          await FAUTH.signOut();
          return { success: false, message: 'Akaunti yako imezimwa. Wasiliana na msaada.' };
        }

        /* Update login stats */
        await FDB.collection('users').doc(uid).update({
          lastLogin:  new Date().toISOString(),
          loginCount: firebase.firestore.FieldValue.increment(1),
        });

        await FB.Activity.log(uid, 'login', 'Umeingia mfumoni');

        const freshSnap = await FDB.collection('users').doc(uid).get();
        return { success: true, user: { ...freshSnap.data(), id: uid } };
      } catch (err) {
        return { success: false, message: FB._authError(err.code) };
      }
    },

    /* Google Sign-In (popup) — works for both login and register */
    async loginWithGoogle() {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');

        const cred = await FAUTH.signInWithPopup(provider);
        const fbUser = cred.user;
        const uid    = fbUser.uid;

        /* Check if user doc already exists */
        const snap = await FDB.collection('users').doc(uid).get();

        if (snap.exists) {
          /* Update photo + lastLogin if user already registered */
          await FDB.collection('users').doc(uid).update({
            lastLogin:  new Date().toISOString(),
            loginCount: firebase.firestore.FieldValue.increment(1),
            avatarUrl:  fbUser.photoURL || snap.data().avatarUrl || '',
            fullName:   fbUser.displayName || snap.data().fullName,
          });
          await FB.Activity.log(uid, 'login', 'Umeingia kwa Google');
        } else {
          /* New user — create Firestore doc */
          const userData = {
            id:         uid,
            fullName:   fbUser.displayName || fbUser.email.split('@')[0],
            email:      fbUser.email.toLowerCase(),
            role:       'user',
            createdAt:  new Date().toISOString(),
            lastLogin:  new Date().toISOString(),
            loginCount: 1,
            isActive:   true,
            avatarUrl:  fbUser.photoURL || '',
            settings:   { theme: 'light', language: 'en', notifications: true },
          };
          await FDB.collection('users').doc(uid).set(userData);
          await FB.Activity.log(uid, 'register', 'Akaunti mpya imeundwa kwa Google');
        }

        return { success: true };
      } catch (err) {
        if (err.code === 'auth/popup-closed-by-user') {
          return { success: false, message: null }; /* silent — user closed popup */
        }
        return { success: false, message: FB._authError(err.code) };
      }
    },

    /* Logout */
    async logout() {
      const fbUser = FAUTH.currentUser;
      if (fbUser) {
        await FB.Activity.log(fbUser.uid, 'logout', 'Umetoka mfumoni');
      }
      await FAUTH.signOut();
    },

    /* Re-authenticate (needed before password change) */
    async reAuthenticate(password) {
      const fbUser = FAUTH.currentUser;
      if (!fbUser) return { success: false, message: 'Hujaingia.' };
      try {
        const cred = firebase.auth.EmailAuthProvider.credential(fbUser.email, password);
        await fbUser.reauthenticateWithCredential(cred);
        return { success: true };
      } catch (err) {
        return { success: false, message: FB._authError(err.code) };
      }
    },

    /* Change password */
    async changePassword(currentPassword, newPassword) {
      const reAuth = await this.reAuthenticate(currentPassword);
      if (!reAuth.success) return reAuth;

      try {
        await FAUTH.currentUser.updatePassword(newPassword);
        return { success: true };
      } catch (err) {
        return { success: false, message: FB._authError(err.code) };
      }
    },

    /* Check if email is registered */
    async emailExists(email) {
      try {
        const methods = await FAUTH.fetchSignInMethodsForEmail(email.toLowerCase());
        return methods.length > 0;
      } catch {
        return false;
      }
    },
  },

  /* ══════════════════════════════════════════════════════════
     USERS — Firestore user documents
     ══════════════════════════════════════════════════════════ */
  Users: {

    /* Get current authenticated user's Firestore data */
    async getCurrent() {
      const fbUser = FAUTH.currentUser;
      if (!fbUser) return null;
      const snap = await FDB.collection('users').doc(fbUser.uid).get();
      if (!snap.exists) return null;
      return { ...snap.data(), id: fbUser.uid };
    },

    /* Get user by UID */
    async getById(uid) {
      const snap = await FDB.collection('users').doc(uid).get();
      if (!snap.exists) return null;
      return { ...snap.data(), id: uid };
    },

    /* Get all users (sorted by createdAt desc) */
    async getAll() {
      const snap = await FDB.collection('users').get();
      return snap.docs
        .map(d => ({ ...d.data(), id: d.id }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    /* Toggle user active / inactive */
    async setActive(uid, isActive) {
      try {
        await FDB.collection('users').doc(uid).update({
          isActive, updatedAt: new Date().toISOString(),
        });
        return { success: true };
      } catch (err) {
        return { success: false, message: err.message };
      }
    },

    /* Remove user Firestore document */
    async remove(uid) {
      try {
        await FDB.collection('users').doc(uid).delete();
        return { success: true };
      } catch (err) {
        return { success: false, message: err.message };
      }
    },

    /* Update user fields */
    async update(uid, updates) {
      try {
        const payload = { ...updates, updatedAt: new Date().toISOString() };
        /* Remove undefined/null values */
        Object.keys(payload).forEach(k => payload[k] == null && delete payload[k]);

        await FDB.collection('users').doc(uid).update(payload);
        const updated = await this.getById(uid);
        return { success: true, user: updated };
      } catch (err) {
        return { success: false, message: err.message };
      }
    },
  },

  /* ══════════════════════════════════════════════════════════
     ACTIVITY — Firestore activity logs
     ══════════════════════════════════════════════════════════ */
  Activity: {

    /* Write an activity entry */
    async log(userId, type, description) {
      if (!userId) return;
      try {
        await FDB.collection('activity').add({
          userId,
          type,
          description,
          timestamp:  new Date().toISOString(),
          createdAt:  firebase.firestore.FieldValue.serverTimestamp(),
        });
      } catch (err) {
        console.warn('Activity log failed:', err.message);
      }
    },

    /* Get activity for a user (latest first) */
    async getByUser(userId, limit = 10) {
      const snap = await FDB.collection('activity')
        .where('userId', '==', userId)
        .get();
      return snap.docs
        .map(d => ({ ...d.data(), id: d.id }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
    },

    /* Get all activity (latest first) */
    async getAll(limit = 100) {
      const snap = await FDB.collection('activity').get();
      return snap.docs
        .map(d => ({ ...d.data(), id: d.id }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
    },

    /* Delete all activity entries for a user */
    async clearByUser(userId) {
      const snap = await FDB.collection('activity')
        .where('userId', '==', userId)
        .get();
      const batch = FDB.batch();
      snap.docs.forEach(d => batch.delete(d.ref));
      await batch.commit();
    },
  },

  /* ══════════════════════════════════════════════════════════
     SETTINGS — Stored in user document (settings sub-field)
     Theme & language also cached in localStorage for speed
     ══════════════════════════════════════════════════════════ */
  Settings: {

    /* Get settings (localStorage for theme/lang, Firestore for rest) */
    get() {
      const saved = JSON.parse(localStorage.getItem('auth_settings') || '{}');
      return { theme: 'light', language: 'en', notifications: true, ...saved };
    },

    set(updates) {
      const current = this.get();
      const merged  = { ...current, ...updates };
      localStorage.setItem('auth_settings', JSON.stringify(merged));

      /* Sync to Firestore in background */
      const fbUser = FAUTH.currentUser;
      if (fbUser) {
        const payload = {};
        Object.keys(updates).forEach(k => { payload[`settings.${k}`] = updates[k]; });
        FDB.collection('users').doc(fbUser.uid).update(payload).catch(() => {});
      }
    },

    getTheme() { return this.get().theme; },

    setTheme(theme) {
      this.set({ theme });
      document.documentElement.setAttribute('data-theme', theme);
    },

    toggleTheme() {
      const next = this.getTheme() === 'light' ? 'dark' : 'light';
      this.setTheme(next);
      return next;
    },
  },

  /* ══════════════════════════════════════════════════════════
     STATS — Computed from Firestore data
     ══════════════════════════════════════════════════════════ */
  Stats: {

    async get() {
      const [users, activity] = await Promise.all([
        FB.Users.getAll(),
        FB.Activity.getAll(200),
      ]);

      const now   = new Date();
      const today = now.toDateString();

      return {
        totalUsers:  users.length,
        activeUsers: users.filter(u => u.isActive !== false).length,
        loginsToday: activity.filter(a =>
          a.type === 'login' && new Date(a.timestamp).toDateString() === today
        ).length,
        newThisWeek: users.filter(u => {
          const diff = (now - new Date(u.createdAt)) / (1000 * 60 * 60 * 24);
          return diff <= 7;
        }).length,
      };
    },

    async getWeeklyActivity() {
      const all  = await FB.Activity.getAll(300);
      const days = [];

      for (let i = 6; i >= 0; i--) {
        const d   = new Date();
        d.setDate(d.getDate() - i);
        const str = d.toDateString();
        const lang = (typeof I18N !== 'undefined') ? I18N.current : 'en';
        const lbl  = d.toLocaleDateString(
          lang === 'ar' ? 'ar-SA' : lang === 'sw' ? 'sw-TZ' : 'en-GB',
          { weekday: 'short', day: 'numeric' }
        );

        days.push({
          label:     lbl,
          logins:    all.filter(a => a.type === 'login'    && new Date(a.timestamp).toDateString() === str).length,
          registers: all.filter(a => a.type === 'register' && new Date(a.timestamp).toDateString() === str).length,
          updates:   all.filter(a => a.type === 'update'   && new Date(a.timestamp).toDateString() === str).length,
        });
      }
      return days;
    },
  },

  /* ══════════════════════════════════════════════════════════
     ERROR MESSAGES — Firebase Auth error codes → Swahili
     ══════════════════════════════════════════════════════════ */
  _authError(code) {
    const map = {
      'auth/email-already-in-use':   'Email hii tayari imesajiliwa.',
      'auth/invalid-email':          'Muundo wa barua pepe si sahihi.',
      'auth/weak-password':          'Nywila ni dhaifu sana — herufi 8 au zaidi.',
      'auth/user-not-found':         'Hakuna akaunti yenye barua pepe hii.',
      'auth/wrong-password':         'Nywila si sahihi. Jaribu tena.',
      'auth/invalid-credential':     'Barua pepe au nywila si sahihi.',
      'auth/too-many-requests':      'Majaribio mengi sana. Jaribu baadaye.',
      'auth/network-request-failed': 'Tatizo la mtandao. Angalia muunganisho wako.',
      'auth/user-disabled':          'Akaunti yako imezimwa.',
      'auth/requires-recent-login':  'Tafadhali ingia tena kisha jaribu kubadilisha nywila.',
    };
    return map[code] || 'Hitilafu imetokea. Jaribu tena.';
  },
};

window.FB = FB;
