const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export async function triggerIngest() {
  try {
    const res = await fetch(`${BASE_URL}/fetch-and-summarize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Ingest failed");
    return await res.json();
  } catch (err) {
    console.error("triggerIngest error:", err);
    throw err;
  }
}

// Fetch all summarized articles
export async function fetchArticles() {
  try {
    const res = await fetch(`${BASE_URL}/articles`);
    if (!res.ok) throw new Error("Failed to fetch articles");
    return await res.json();
  } catch (err) {
    console.error("fetchArticles error:", err);
    throw err;
  }
}

// (Optional) Summarize a specific article if you later add that route
export async function summarizeSingleArticle(articleId) {
  try {
    const res = await fetch(
      `${BASE_URL}/summarizeArticle?articleId=${articleId}`
    );
    if (!res.ok) throw new Error("Failed to summarize article");
    return await res.json();
  } catch (err) {
    console.error("summarizeSingleArticle error:", err);
    throw err;
  }
}
