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
    "HUGGINGFACE_API_TOKEN not set. Summarization will fail without it."
  );
}

export async function summarizeText(text) {
  try {
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

    summary = summary
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/Â/g, "")
      .replace(/\s+/g, " ")
      .replace(/[^\x00-\x7F]+/g, "")
      .trim();

    return summary;
  } catch (err) {
    console.error("Hugging Face summarization failed:", err.message || err);
    return "Summary error.";
  }
}

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

      const unique = new Map();
      allItems.forEach((it) => {
        if (!unique.has(it.link)) unique.set(it.link, it);
      });

      let ingested = 0;

      for (const item of unique.values()) {
        const q = await db
          .collection("articles")
          .where("link", "==", item.link)
          .limit(1)
          .get();
        if (!q.empty) continue;

        const summary = await summarizeText(item.content || item.title || "");

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
