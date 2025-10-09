import express from "express";
import admin from "firebase-admin";
import Parser from "rss-parser";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

const parser = new Parser();

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
  console.log("Firebase Admin initialized successfully");
} catch (err) {
  console.error("Failed to initialize Firebase Admin:", err.message);
}

const db = admin.firestore();

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

function sanitizeText(text) {
  if (!text) return "";
  return text
    .replace(/<!\[CDATA\[.*?\]\]>/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/Â/g, "")
    .replace(/\s+/g, " ")
    .replace(/[^\x00-\x7F]+/g, "")
    .trim();
}

async function summarizeText(text) {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/philschmid/bart-large-cnn-samsum",
      {
        inputs: text,
        parameters: {
          min_length: 50,
          max_length: 200,
          clean_up_tokenization_spaces: true,
        },
      },
      {
        headers: { Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}` },
        timeout: 60000,
      }
    );
    let summary = response.data[0]?.summary_text || "No summary generated.";
    return sanitizeText(summary);
  } catch (err) {
    console.error("Summarization failed:", err.message);
    return "Summary error.";
  }
}

async function fetchFeed(url) {
  try {
    const response = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 15000,
      responseType: "text",
    });
    const feed = await parser.parseString(response.data);
    return feed;
  } catch (err) {
    console.error("Failed to fetch feed:", url, err.message);
    return null;
  }
}

app.post("/fetch-and-summarize", async (req, res) => {
  try {
    const feeds = [
      "https://www.cnbc.com/id/10001147/device/rss/rss.html",
      "https://feeds.a.dj.com/rss/RSSMarketsMain.xml",
    ];

    const allItems = [];

    for (const url of feeds) {
      const feed = await fetchFeed(url);
      if (!feed) continue;
      feed.items.forEach((item) => {
        allItems.push({
          source: feed.title || url,
          title: sanitizeText(item.title),
          link: item.link,
          content: sanitizeText(
            (item.contentSnippet || item.content || item.summary || "").slice(
              0,
              3000
            )
          ),
          pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
        });
      });
    }

    const unique = new Map();
    allItems.forEach((it) => {
      if (!unique.has(it.link)) unique.set(it.link, it);
    });

    let ingested = 0;

    for (const item of unique.values()) {
      try {
        const existing = await db
          .collection("articles")
          .where("link", "==", item.link)
          .limit(1)
          .get();
        if (!existing.empty) continue;

        const summary = await summarizeText(item.content || item.title || "");

        await db.collection("articles").add({
          title: item.title || "Untitled",
          link: item.link || null,
          summary,
          source: item.source,
          publishedAt: item.pubDate instanceof Date ? item.pubDate : new Date(),
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          tags: [],
          importance: "normal",
        });

        ingested++;
      } catch (err) {
        console.warn("Skipping article due to error:", item.link, err.message);
      }
    }

    res.json({ success: true, ingested });
  } catch (err) {
    console.error("Error during RSS summarization:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/articles", async (req, res) => {
  try {
    const snapshot = await db
      .collection("articles")
      .orderBy("publishedAt", "desc")
      .get();

    const articles = [];
    snapshot.docs.forEach((doc) => {
      try {
        const data = doc.data();
        articles.push({
          id: doc.id,
          ...data,
          publishedAt:
            data.publishedAt?.toDate?.() instanceof Date
              ? data.publishedAt.toDate().toISOString()
              : new Date().toISOString(),
          createdAt:
            data.createdAt?.toDate?.() instanceof Date
              ? data.createdAt.toDate().toISOString()
              : new Date().toISOString(),
        });
      } catch (err) {
        console.warn("Skipping invalid doc:", doc.id, err.message);
      }
    });

    res.json(articles);
  } catch (err) {
    console.error("Failed to fetch articles:", err.message);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

app.get("/", (req, res) => res.send("Backend is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
