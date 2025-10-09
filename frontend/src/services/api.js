// small helper to call your cloud function endpoint (if you want to trigger ingestion manually)
export async function triggerIngest(functionUrl) {
  try {
    const res = await fetch(functionUrl, { method: "POST" });
    if (!res.ok) throw new Error("Ingest failed");
    const json = await res.json();
    return json;
  } catch (err) {
    console.error("triggerIngest error:", err);
    throw err;
  }
}

// helper to summarize a single article by its Firestore ID
export async function summarizeSingleArticle(functionUrl, articleId) {
  try {
    const url = `${functionUrl}/summarizeArticle?articleId=${articleId}`;
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) throw new Error("Failed to summarize article");
    const json = await res.json();
    return json;
  } catch (err) {
    console.error("summarizeSingleArticle error:", err);
    throw err;
  }
}
