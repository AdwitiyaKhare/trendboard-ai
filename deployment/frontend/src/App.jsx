import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import LoadingScreen from "./components/LoadingScreen";

export default function App() {
  const [backendReady, setBackendReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkBackend = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/articles`);
        if (!isMounted) return;

        if (res.ok) {
          setBackendReady(true); 
        } else {
          setTimeout(checkBackend, 1000);
        }
      } catch (err) {
        setTimeout(checkBackend, 1000);
      }
    };

    checkBackend();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #f0f4ff, #d9e8ff, #c1dcff)",
        backgroundSize: "400% 400%",
        animation: "gradientAnimation 15s ease infinite",
      }}
    >
      <Header />
      <main style={{ flex: 1, padding: 16 }}>
        {!backendReady ? <LoadingScreen /> : <Dashboard />}
      </main>

      <style>
        {`
          @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
}
