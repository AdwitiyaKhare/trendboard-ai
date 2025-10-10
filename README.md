# TrendBoard

**TrendBoard** is a full-stack, AI-powered news dashboard that automatically **fetches, summarizes, and visualizes trending articles** from multiple sources in real time.  
It integrates **Firebase**, **Hugging Face summarization**, and a modern **React + Tailwind** frontend for a clean, interactive experience.

---

## Features

- Automatic RSS ingestion using Firebase Cloud Functions
- AI summarization powered by Hugging Face (BART-based model)
- Search and sorting for articles by title, date, or content
- Modern responsive UI built with Tailwind CSS and Framer Motion
- Cloud Firestore integration for live updates
- Soft gradient visuals and light animation effects

---

## Project Structure

```
trendboard/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ArticleCard.jsx       # Displays summarized articles
│   │   │   └── Header.jsx            # Top navigation bar
│   │   ├── pages/
│   │   │   └── Dashboard.jsx         # Main dashboard UI
│   │   ├── services/
│   │   │   ├── api.js                # Cloud Function API helpers
│   │   │   └── firebase.js           # Firebase config and Firestore setup
│   │   ├── App.jsx                   # Root app layout
│   │   ├── main.jsx                  # Entry point
│   │   └── App.css                   # Global Tailwind + styles
│   └── package.json
│
├── functions/
│   └── index.js                      # Firebase Cloud Function for fetching & summarizing articles
│
└── deployment/                       # Contains deployed version (see its README for details)
```

---

##  Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/AdwitiyaKhare/trendboard.git
cd trendboard
```

### 2. Set up the frontend

```bash
cd frontend
npm install
```

### 3. Set up environment variables

Create a `.env` file inside the `frontend/` folder:

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_FUNCTION_URL=https://your-cloud-function-url
```

### 4. Run locally

```bash
npm run dev
```

Visit **[http://localhost:5173](http://localhost:5173)** to view the app.

---

## Backend: Firebase Cloud Function

Located in the `/functions` directory.  
It:

- Fetches news from multiple RSS feeds (e.g., CNBC, WSJ)
- Summarizes them using **Hugging Face BART-Large-CNN model**
- Stores results in Firestore in real time

### Environment variable (required)

```
HUGGINGFACE_API_TOKEN=your_token_here
```

To deploy the function:

```bash
firebase deploy --only functions
```

---

## How It Works

1. Click **Fetch & Summarize** on the dashboard.
2. The Firebase Function fetches new articles → summarizes via Hugging Face → saves to Firestore.
3. The React frontend listens to Firestore for new entries and updates instantly.
4. Trending topics are visualized based on tag frequency.

---

## Tech Stack

| Layer                | Technologies                                                 |
| -------------------- | ------------------------------------------------------------ |
| **Frontend**         | React, Tailwind CSS, Framer Motion, Recharts                 |
| **Backend**          | Firebase Cloud Functions, Firestore                          |
| **AI Summarization** | Hugging Face BART model                                      |
| **APIs**             | RSS Parser, Axios, Node Fetch                                |
| **Deployment**       | Render/Vercel Hosting _(see /deployment folder)              |

---

## Author

**Adwitiya Khare**

- [Portfolio](https://adwitiyakhare.vercel.app)
- [LinkedIn](https://linkedin.com/in/adwitiyakhare)
- [GitHub](https://github.com/AdwitiyaKhare)
- [Email](mailto:adwitiyakhare222004@gmail.com)

---

## License

This project is licensed under the **MIT License** — free to use and modify with credit.
