# 🛡️ AuthSystem Dashboard

A production-ready Firebase authentication and user management dashboard with full multi-language support (English, Swahili, Arabic) and real-time Firestore integration.

![AuthSystem](https://img.shields.io/badge/Firebase-Firestore-orange?logo=firebase)
![Languages](https://img.shields.io/badge/Languages-EN%20%7C%20SW%20%7C%20AR-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### 🔐 Authentication
- Email & Password login / registration
- Google OAuth (one-click sign-in)
- Forgot password via Firebase email reset
- "Remember Me" persistent session
- Password strength meter on register

### 📊 Dashboard
- Real-time stats (total users, active, logins today, new this week)
- Weekly activity chart (Chart.js) — logins, registrations, updates
- Activity feed with live timestamps
- User profile card with avatar support

### 👥 User Management (Admin)
- View all registered users in a searchable table
- **Activate / Deactivate** users with one click
- **Delete** users from Firestore
- Role-based access (admin / user)
- All actions synced to Firestore in real-time

### 🌐 Multi-Language (i18n)
| Language | Code | Direction |
|----------|------|-----------|
| 🇬🇧 English | `en` | LTR |
| 🇹🇿 Kiswahili | `sw` | LTR |
| 🇸🇦 العربية | `ar` | RTL (Cairo font) |

- Full dashboard updates instantly on language change
- Arabic auto-transliteration of user names
- RTL layout support for Arabic
- Locale-aware dates and chart labels
- Language preference saved to Firestore

### ⚙️ Settings
- Dark / Light mode toggle (saved to Firestore)
- Notification preferences
- Danger zone: clear activity history, force logout
- All settings synced to Firebase

### 🎨 UI / UX
- Advanced animated preloader (1.8s minimum, progress bar + steps)
- Toast notification system
- Notification bell with activity feed
- Smooth language dropdown with caret animation
- Responsive mobile-friendly layout

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/Zabepro/authsystem-dashboard.git
cd authsystem-dashboard
```

### 2. Configure Firebase

Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com), then update `js/firebase-config.js`:

```js
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
};
```

### 3. Enable Firebase Services
In Firebase Console:
- **Authentication** → Enable: Email/Password + Google
- **Firestore Database** → Create database (production mode)

### 4. Deploy Firestore Rules
Copy the contents of `firestore.rules` into:
> Firebase Console → Firestore Database → Rules → **Publish**

### 5. Open in browser
```
index.html        ← Login page
register.html     ← Registration page
dashboard.html    ← Main dashboard (requires login)
```

> No build tools required — pure HTML/CSS/JS with Firebase CDN.

---

## 📁 Project Structure

```
authsystem-dashboard/
├── index.html              # Login page
├── register.html           # Registration page
├── dashboard.html          # Main dashboard
├── firestore.rules         # Firestore security rules
├── css/
│   ├── style.css           # Base / shared styles
│   ├── auth.css            # Login & register styles
│   └── dashboard.css       # Dashboard styles
└── js/
    ├── firebase-config.js  # Firebase initialization
    ├── firebase-db.js      # Firestore + Auth operations
    ├── dashboard.js        # Dashboard logic & UI
    ├── auth.js             # Login / register logic
    ├── i18n.js             # Multi-language system
    └── storage.js          # Storage utilities
```

---

## 🔒 Firestore Security Rules Summary

| Collection | Operation | Who |
|------------|-----------|-----|
| `users` | Read | Any authenticated user |
| `users` | Create | Owner only (role must be `user`) |
| `users` | Update | Owner (no role change) OR Admin |
| `users` | Delete | Admin only |
| `activity` | Read | Any authenticated user |
| `activity` | Create | Owner only (own userId) |
| `activity` | Delete | Owner OR Admin |
| `activity` | Update | ❌ Never |

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| Firebase Auth | Authentication |
| Firebase Firestore | Database |
| Chart.js | Weekly activity chart |
| Lucide Icons | UI icons |
| Google Fonts (Cairo) | Arabic typography |
| Vanilla JS | No framework needed |

---

## ⚠️ Security Note

> `firebase-config.js` contains your Firebase API keys. These are **safe to expose** for client-side Firebase apps (protected by Firestore Rules and Auth), but for extra security:
> - Add allowed domains in Firebase Console → Authentication → Settings
> - Never expose your Firebase Admin SDK private key

---

## 📄 License

MIT — free to use, modify, and distribute.

---

Made with ❤️ by [Zabepro](https://github.com/Zabepro)
