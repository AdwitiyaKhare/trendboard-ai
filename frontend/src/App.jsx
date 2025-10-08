import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";

export default function App() {
  return (
    <div>
      <Header />
      <main style={{ padding: 16 }}>
        <Dashboard />
      </main>
    </div>
  );
}
