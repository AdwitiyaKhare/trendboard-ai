import React from "react";
import { format } from "date-fns";

export default function ArticleCard({ article }) {
  return (
    <article
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        background: "#fff",
      }}
    >
      <a
        href={article.link || "#"}
        target="_blank"
        rel="noreferrer"
        style={{ textDecoration: "none", color: "#0b132b" }}
      >
        <h3 style={{ marginTop: 0 }}>{article.title}</h3>
      </a>
      <div style={{ color: "#475569", marginBottom: 8, fontSize: 13 }}>
        <span>{article.source}</span> •{" "}
        <span>
          {article.publishedAt
            ? format(
                new Date(article.publishedAt.seconds * 1000),
                "MMM d, yyyy HH:mm"
              )
            : ""}
        </span>
      </div>
      <p style={{ marginTop: 0, color: "#334155" }}>{article.summary}</p>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        <a href={article.link || "#"} target="_blank" rel="noreferrer">
          Read full
        </a>
        <div style={{ opacity: 0.7, fontSize: 13 }}>
          {article.tags && article.tags.join(", ")}
        </div>
      </div>
    </article>
  );
}
