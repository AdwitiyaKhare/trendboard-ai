import React, { useEffect, useState } from "react";
import ArticleCard from "../components/ArticleCard";
import {
  db,
  query,
  collection,
  orderBy,
  onSnapshot,
} from "../services/firebase";
import { triggerIngest } from "../services/api";

export default function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingIngest, setLoadingIngest] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "articles"), orderBy("publishedAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArticles(items);
      },
      (err) => {
        console.error("Firestore listen error", err);
      }
    );
    return () => unsubscribe();
  }, []);

  const filtered = articles.filter((a) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      (a.title || "").toLowerCase().includes(term) ||
      (a.summary || "").toLowerCase().includes(term)
    );
  });

  async function handleIngest() {
    const fnUrl = process.env.VITE_FUNCTION_URL; // set in .env
    if (!fnUrl) {
      alert("Function URL missing. Set VITE_FUNCTION_URL in env.");
      return;
    }
    try {
      setLoadingIngest(true);
      await triggerIngest(fnUrl);
      alert("Ingest triggered — check articles in a moment.");
    } catch (err) {
      alert("Ingest failed. See console.");
    } finally {
      setLoadingIngest(false);
    }
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title or summary..."
          style={{
            flex: 1,
            padding: 8,
            marginRight: 12,
            borderRadius: 6,
            border: "1px solid #cbd5e1",
          }}
        />
        <button
          onClick={handleIngest}
          disabled={loadingIngest}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            background: "#0b132b",
            color: "#fff",
            border: "none",
          }}
        >
          {loadingIngest ? "Triggering..." : "Fetch & Summarize"}
        </button>
      </div>

      <div>
        {filtered.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: "#64748b" }}>
            No articles yet. Click “Fetch & Summarize” or wait for the ingestion
            process.
          </div>
        ) : (
          filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        )}
      </div>
    </div>
  );
}
