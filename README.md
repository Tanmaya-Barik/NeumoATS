# ⚡ NeumoATS PDF Suite
### Deterministic Multimodal PDF Parser & Forensic ATS Analyzer

> **Zero-Login • RAM-Only Processing • Dark Neumorphic 3D Aesthetics • Multimodal Gemini AI**

NeumoATS is a high-performance, privacy-first ATS (Applicant Tracking System) intelligence platform designed for both job candidates and technical recruiters. Built with a bespoke dark neumorphic design system, it delivers deterministic skill cross-examination, candidate profile dossiers, forensic keyword-stuffing detection, and live session leaderboards without storing files on disk or tracking user logins.

---

## 🌟 Key Features

- **🛡️ RAM-Only Forensic Architecture**: Uploaded PDF files are buffered strictly in memory (RAM). Zero database writes, zero disk storage, zero login requirements.
- **✨ Multimodal AI Document Parsing**: Powered by Google Gemini structured outputs with an automated resilient multi-model cascade (`gemini-3-flash-preview`, `gemini-3.5-flash`, `gemini-3.8-flash`).
- **🎯 Deterministic ATS Scoring**:
  $$\text{Score} = \text{round}\left(\frac{V \times 1.0 + U \times 0.45}{V + U + M}\right) \times 100$$
  *(where $V$ = Verified Skills, $U$ = Unverified Skills, and $M$ = Missing Skills. Penalized by $-30$ points if cheat manipulation is detected).*
- **🕵️ Forensic Cheat Shield**: Uncovers white-text stuffing, invisible keywords, prompt injection, and verbatim copy-paste JD manipulation.
- **🔄 Smart Swap & Auto-Detection**: Detects inverted uploads (e.g. Resume placed in JD slot) and allows instant 1-click swapping.
- **🔒 Card Locking & Selective Clear**: Lock individual cards to compare multiple candidate resumes against a fixed Job Description, or clear unlocked cards with a single click.
- **📊 Recruiter Live Session Leaderboard**: Real-time sorting and ranking of evaluated candidates with smooth animations.
- **🎨 Dark Neumorphic 3D UI**: Tailored `#212529` dark neumorphic palette with realistic inset/outset drop-shadow physics, dynamic circular score gauges, and confetti celebrations.

---

## 🏗️ Project Architecture

```
NeumoATS/
├── backend/
│   └── server.js            # Express API, in-memory Multer, Gemini model cascade
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Primary UI, neumorphic system & application state
│   │   ├── components/      # Modular components (Leaderboard, SessionTable, etc.)
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── package.json             # Root concurrency scripts
├── .env.example             # Environment variable template
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Google Gemini API Key](https://aistudio.google.com/)

### 1. Installation

Clone the repository and install root dependencies:

```bash
git clone https://github.com/Tanmaya-Barik/NeumoATS.git
cd NeumoATS
npm install
npm --prefix frontend install
```

### 2. Environment Setup

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Add your Gemini API Key to `.env`:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Servers

Run both the backend API and frontend Vite dev server concurrently:

```bash
npm run dev
```

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## ☁️ Deploying to Vercel

NeumoATS is ready for zero-config Vercel Serverless deployment with RAM-only processing and 60-second function timeouts.

### Option 1: Unified Fullstack Deployment (Recommended)
Deploy both the React frontend and Express backend under a single Vercel project and domain:

1. Import your GitHub repository into [Vercel](https://vercel.com/new).
2. Set **Root Directory** to `./` (the repository root).
3. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Google Gemini API key.
4. Click **Deploy**. Vercel will build the frontend into `frontend/dist` and mount `/api/*` to the serverless backend function in `api/index.js`.

### Option 2: Standalone Backend Deployment
If you already deployed the frontend separately and want the backend on its own Vercel URL:

1. Import the repository into Vercel as a new project (e.g. `neumoats-backend`).
2. Set **Root Directory** to `./`.
3. Add `GEMINI_API_KEY` under **Environment Variables**.
4. In your frontend Vercel project settings, set:
   - `VITE_API_URL`: `https://your-backend-project.vercel.app`
5. Redeploy your frontend.

---

## 📜 License

MIT License. Crafted with precision by Tanmaya Barik.
