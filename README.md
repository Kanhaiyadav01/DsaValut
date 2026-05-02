# NeuroDSA 🧠

> Never forget a DSA problem again.

A spaced repetition tracker built for competitive programmers. Automatically schedules revision intervals so every problem you solve actually sticks.

---

## Live Demo

[neurodsa.web.app](https://neurodsa.web.app) ← update after deploy

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Auth | Firebase Auth (Email + Google) |
| Database | Firebase Firestore |
| Hosting | Firebase Hosting |
| Icons | Lucide React |

---

## Features

- Email + Google authentication
- Auto-scheduled revision intervals — +3, +7, +15, +25, +37, +120 days
- Today's dashboard — see exactly what to revise
- Mark done or missed — intervals adjust automatically
- Filter by topic, difficulty, status
- Stats page — mastery %, topic breakdown, difficulty breakdown
- Browser notifications for morning reminders
- Cloud sync — data follows you across devices
- Fully responsive — sidebar on desktop, bottom nav on mobile

---

## Folder Structure

```
src/
├── firebase/
│   └── config.js          # Firebase setup
├── context/
│   └── AuthContext.jsx     # Global auth state
├── pages/
│   ├── Landing.jsx         # Landing page
│   ├── Login.jsx           # Login page
│   ├── Signup.jsx          # Signup page
│   └── Dashboard.jsx       # Main app shell
├── components/
│   ├── ProtectedRoute.jsx  # Route guard
│   └── Dashboard/
│       ├── Navbar.jsx
│       ├── Sidebar.jsx
│       ├── BottomNav.jsx
│       ├── QuestionCard.jsx
│       ├── TodayView.jsx
│       ├── AllQuestions.jsx
│       ├── AddQuestion.jsx
│       └── StatsView.jsx
├── App.jsx
├── main.jsx
└── index.css
```

---

## Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/neurodsa.git

# 2. Go into folder
cd neurodsa

# 3. Install dependencies
npm install

# 4. Create .env file
cp .env.example .env
# Fill in your Firebase keys

# 5. Run dev server
npm run dev
```

---

## Environment Variables

Create a `.env` file in root:

```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> Never commit `.env` to GitHub. It is in `.gitignore`.

---

## Spaced Repetition Intervals

| Stage | Days After Previous |
|---|---|
| 1st revision | +3 days |
| 2nd revision | +7 days |
| 3rd revision | +15 days |
| 4th revision | +25 days |
| 5th revision | +37 days |
| Final revision | +120 days |

After all 6 stages — problem is marked **Mastered**. 

---

## Deployment

Deployed on Firebase Hosting.

```bash
npm run build
firebase deploy
```

---

## Author

Built with ♥ 