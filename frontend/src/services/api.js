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
