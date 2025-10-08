const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Parser = require("rss-parser");
const fetch = require("node-fetch");
const cors = require("cors")({ origin: true });
const { GoogleGenerativeAI } = require("@google/generative-ai");

admin.initializeApp();
const db = admin.firestore();
const parser = new Parser();

require('dotenv').config();

const geminiKey = process.env.GEMINI_API_KEY;
if (!geminiKey) {
  console.warn(
    "⚠️ GEMINI_API_KEY not set. Summarization will fail without it."
  );
}

const genAI = new GoogleGenerativeAI(geminiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Helper: summarize text using Gemini
async function summarizeText(text) {
  if (!geminiKey) {
    return "Summary unavailable (Gemini key missing).";
  }
  try {
    const prompt = `Summarize the following financial news article in 2-3 short, neutral sentences suitable for a dashboard card UI:\n\n${text}`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text().trim();

    return summary || "No summary generated.";
  } catch (err) {
    console.error("Gemini summarization error:", err.message || err);
    return "Summary error.";
  }
}

// HTTP function to fetch and summarize RSS feeds
exports.fetchAndSummarize = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    try {
      const feeds = [
        "https://www.reutersagency.com/feed/?best-topics=business-finance&post_type=best",
        "https://feeds.finance.yahoo.com/rss/2.0/headline?s=yhoo&region=US&lang=en-US",
      ];

      const allItems = [];
      for (const url of feeds) {
        try {
          const feed = await parser.parseURL(url);
          feed.items.forEach((item) => {
            allItems.push({
              source: feed.title || url,
              title: item.title,
              link: item.link,
              content: (
                item.contentSnippet ||
                item.content ||
                item.summary ||
                ""
              ).slice(0, 3000),
              pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
            });
          });
        } catch (err) {
          console.warn("Failed to parse feed", url, err.message || err);
        }
      }

      // Deduplicate articles by link
      const unique = new Map();
      allItems.forEach((it) => {
        if (!unique.has(it.link)) unique.set(it.link, it);
      });

      const batch = db.batch();
      let ingested = 0;

      for (const item of unique.values()) {
        // Skip if already in Firestore
        const q = await db
          .collection("articles")
          .where("link", "==", item.link)
          .limit(1)
          .get();
        if (!q.empty) continue;

        // Summarize content using Gemini
        const textToSummarize = item.content || item.title || "";
        const summary = await summarizeText(textToSummarize);

        const docRef = db.collection("articles").doc();
        const docData = {
          title: item.title || "Untitled",
          link: item.link || null,
          summary,
          source: item.source,
          publishedAt: item.pubDate,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          tags: [],
          importance: "normal",
        };

        batch.set(docRef, docData);
        ingested++;
      }

      if (ingested > 0) await batch.commit();

      res.json({ success: true, ingested });
    } catch (err) {
      console.error("Error during RSS summarization:", err);
      res.status(500).json({ error: err.message || String(err) });
    }
  });
});
