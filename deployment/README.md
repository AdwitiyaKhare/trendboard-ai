# TrendBoard

**TrendBoard** is a full-stack AI-powered dashboard that aggregates the latest financial and market news from trusted RSS feeds, summarizes them using Hugging Face models, and presents them in an elegant and interactive web interface.  

Built with **React + TailwindCSS (frontend)**, **Node.js + Express (backend)**, and **Firebase (Firestore)** for persistent storage.  

While the backend loads, users can enjoy a **mini Snake game** on the loading screen — a creative touch to keep engagement high!

---

## Features

### AI Summarization
- Fetches latest news from multiple RSS feeds (CNBC, WSJ, etc.)
- Uses Hugging Face’s `bart-large-cnn-samsum` model for automatic summarization.
- Removes noise, formatting artifacts, and redundant information.

### Dashboard
- Clean and responsive UI built with **React + TailwindCSS**.
- Displays summarized articles with title, source, publish date, tags, and direct link.
- Integrated **search**, **sorting**, and **tag-based analytics** (visualized via Recharts).
- Dynamic “Fetch & Summarize” button triggers live ingestion of new content.

### Loading Screen Game
- Interactive **Snake Game** while backend initializes.
- Tracks high scores locally using `localStorage`.
- Fully mobile-friendly with touch controls.

### Tech Stack-
| Layer     | Technologies                                           |
|-----------|--------------------------------------------------------|
| Frontend  | React, Vite, TailwindCSS, Framer Motion, Recharts      |
| Backend   | Node.js, Express, Firebase Admin SDK, Hugging Face API |
| Database  | Google Firestore                                       |
| APIs      | CNBC RSS, WSJ RSS, Hugging Face Inference API          |
| Hosting   | Vercel (Frontend) + Render / Firebase Hosting (Backend)|

---

## Folder Structure
trendboard/deployment
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Header.jsx
│ │ │ ├── ArticleCard.jsx
│ │ │ ├── LoadingScreen.jsx
│ │ │ └── SnakeGame.jsx
│ │ ├── pages/
│ │ │ └── Dashboard.jsx
│ │ ├── services/
│ │ │ ├── api.js
│ │ │ └── firebase.js
│ │ ├── App.jsx
│ │ ├── App.css
│ │ └── main.jsx
│ └── vite.config.js
│
├── backend/
│ └── index.js
│
├── .env.example
└── README.md


---

## Environment Variables

Create `.env` files in both **frontend** and **backend** directories.

### Backend `.env`

PORT=5000
FRONTEND_URL=http://localhost:5173

FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_admin_sdk_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----"

HUGGINGFACE_API_TOKEN=your_huggingface_token

### Frontend .env
VITE_BACKEND_URL=http://localhost:5000

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

## Setup Instructions

### Clone the repository
git clone https://github.com/yourusername/trendboard.git
cd trendboard

### Install dependencies
Backend
cd backend
npm install
npm run start

Frontend
cd frontend
npm install
npm run dev

Deployment

Frontend: Deployed on Vercel - https://trendboard-ai.vercel.app/
Backend: Deployed on Render - https://trendboard-ai.onrender.com

Set environment variables in the deployment dashboard for both.

## Visualization Preview

### Dashboard

Displays live summarized articles
Trending topics shown using bar charts

### Snake Game

Appears during backend initialization
Simple, responsive, and fun mini-game with persistent high scores

## Author

**Adwitiya Khare**

- [Portfolio](https://adwitiyakhare.vercel.app)
- [LinkedIn](https://linkedin.com/in/adwitiyakhare)
- [GitHub](https://github.com/AdwitiyaKhare)
- [Email](mailto:adwitiyakhare222004@gmail.com)

---

## License

This project is licensed under the **MIT License** — free to use and modify with credit.

## Acknowledgements

Hugging Face Transformers API
Firebase Firestore
CNBC RSS Feeds
Wall Street Journal RSS
Framer Motion