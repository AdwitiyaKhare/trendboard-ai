import React from "react";

export default function Header() {
  return (
    <header
      style={{ background: "#0b132b", color: "#fff", padding: "12px 24px" }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 20 }}>Trendboard</h1>
        <div style={{ fontSize: 14, opacity: 0.9 }}>
          Financial News • Summarized
        </div>
      </div>
    </header>
  );
}
