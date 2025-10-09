import functions from "firebase-functions";
import admin from "firebase-admin";
import Parser from "rss-parser";
import corsPkg from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const cors = corsPkg({ origin: true });
admin.initializeApp();
const db = admin.firestore();
const parser = new Parser();

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;
if (!HUGGINGFACE_API_TOKEN) {
  console.warn(
    "⚠️ HUGGINGFACE_API_TOKEN not set. Summarization will fail without it."
  );
}

// ✅ Summarize text using Hugging Face model
export async function summarizeText(text) {
  try {
    // Send only the raw article text
    const prompt = `${text}`;

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/philschmid/bart-large-cnn-samsum",
      {
        inputs: prompt,
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

    // --- Clean up weird characters & HTML entities ---
    summary = summary
      .replace(/&nbsp;/gi, " ") // replace non-breaking spaces
      .replace(/&amp;/gi, "&") // replace &amp;
      .replace(/Â/g, "") // remove stray Â
      .replace(/\s+/g, " ") // collapse multiple spaces
      .replace(/[^\x00-\x7F]+/g, "") // remove non-ASCII weird chars
      .trim();

    return summary;
  } catch (err) {
    console.error("Hugging Face summarization failed:", err.message || err);
    return "Summary error.";
  }
}

// ✅ HTTP function to fetch and summarize RSS feeds progressively
export const fetchAndSummarize = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    try {
      const feeds = [
        "https://www.cnbc.com/id/10001147/device/rss/rss.html",
        "https://feeds.a.dj.com/rss/RSSMarketsMain.xml",
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

      // Remove duplicates
      const unique = new Map();
      allItems.forEach((it) => {
        if (!unique.has(it.link)) unique.set(it.link, it);
      });

      let ingested = 0;

      // ✅ Process each article sequentially so Firestore updates immediately
      for (const item of unique.values()) {
        const q = await db
          .collection("articles")
          .where("link", "==", item.link)
          .limit(1)
          .get();
        if (!q.empty) continue;

        const summary = await summarizeText(item.content || item.title || "");

        // ✅ Save immediately (no batch delay)
        await db.collection("articles").add({
          title: item.title || "Untitled",
          link: item.link || null,
          summary,
          source: item.source,
          publishedAt: item.pubDate,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          tags: [],
          importance: "normal",
        });

        ingested++;
      }

      res.json({ success: true, ingested });
    } catch (err) {
      console.error("Error during RSS summarization:", err);
      res.status(500).json({ error: err.message || String(err) });
    }
  });
});
