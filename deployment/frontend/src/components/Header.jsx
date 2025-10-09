import {
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaEnvelope,
  FaMobile,
} from "react-icons/fa";

export default function Header() {
  return (
    <header
      style={{
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        color: "#fff",
        padding: "16px 24px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>
          TrendBoard
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            fontSize: "0.9rem",
            opacity: 0.95,
          }}
        >
          <a
            href="https://github.com/AdwitiyaKhare"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: "#fff",
            }}
          >
            <FaGithub /> GitHub
          </a>
          <a
            href="https://linkedin.com/in/adwitiyakhare"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: "#fff",
            }}
          >
            <FaLinkedin /> LinkedIn
          </a>
          <a
            href="https://adwitiyakhare.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: "#fff",
            }}
          >
            <FaGlobe /> Portfolio
          </a>
          <a
            href="https://leetcode.com/u/adwitiyakhare/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: "#fff",
            }}
          >
            <FaGlobe /> LeetCode
          </a>
          <a
            href="tel:+91999325615"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: "#fff",
            }}
          >
            <FaMobile /> +91 999325615
          </a>
          <a
            href="mailto:adwitiyakhare222004@gmail.com"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: "#fff",
            }}
          >
            <FaEnvelope /> Mail
          </a>
        </div>
      </div>
    </header>
  );
}
