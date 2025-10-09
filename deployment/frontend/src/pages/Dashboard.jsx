import { useEffect, useState } from "react";
import ArticleCard from "../components/ArticleCard";
import { fetchArticles, triggerIngest } from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingIngest, setLoadingIngest] = useState(false);
  const [flashMessage, setFlashMessage] = useState(null);
  const [sortOption, setSortOption] = useState("dateDesc");
  const [loading, setLoading] = useState(true);

  // 🟢 Fetch articles from Express backend
  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    setLoading(true);
    try {
      const data = await fetchArticles();
      setArticles(data || []);
    } catch (err) {
      console.error("Failed to load articles:", err);
      showFlash("Error fetching articles. Check console.", "error");
    } finally {
      setLoading(false);
    }
  }

  // 🟢 Filter & sort logic
  const filtered = articles
    .filter((a) => {
      const term = search.trim().toLowerCase();
      if (!term) return true;
      return (
        (a.title || "").toLowerCase().includes(term) ||
        (a.summary || "").toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      if (sortOption === "dateDesc")
        return new Date(b.publishedat) - new Date(a.publishedat);
      if (sortOption === "dateAsc")
        return new Date(a.publishedat) - new Date(b.publishedat);
      if (sortOption === "titleAsc")
        return (a.title || "").localeCompare(b.title || "");
      if (sortOption === "titleDesc")
        return (b.title || "").localeCompare(a.title || "");
      return 0;
    });

  // 🟢 Prepare chart data
  const tagCounts = {};
  articles.forEach((a) => {
    (a.tags || []).forEach((t) => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });
  const chartData = Object.keys(tagCounts).map((t) => ({
    tag: t,
    count: tagCounts[t],
  }));

  // 🟢 Flash messages
  const showFlash = (message, type = "success") => {
    setFlashMessage({ message, type });
    setTimeout(() => setFlashMessage(null), 4000);
  };

  // 🟢 Trigger ingest (fetch + summarize new articles)
  async function handleIngest() {
    setLoadingIngest(true);
    try {
      await triggerIngest();
      showFlash("Articles fetching & summarization triggered!", "success");
      await loadArticles();
    } catch (err) {
      console.error("Ingest error:", err);
      showFlash("Something went wrong during ingest.", "error");
    } finally {
      setLoadingIngest(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Flash Message */}
      <AnimatePresence>
        {flashMessage && (
          <motion.div
            key="flash"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-4 p-4 rounded shadow text-white flex justify-between items-center ${
              flashMessage.type === "success"
                ? "bg-green-500 bg-gradient-to-r from-green-400 to-green-600"
                : "bg-red-500 bg-gradient-to-r from-red-400 to-red-600"
            }`}
          >
            <span>{flashMessage.message}</span>
            <button
              onClick={() => setFlashMessage(null)}
              className="font-bold text-xl"
            >
              &times;
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or summary..."
          className="flex-1 px-4 py-2 border rounded-lg border-gray-500 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-700"
        />

        <div className="flex items-center gap-2">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-40 px-1.5 py-2 border rounded-lg border-gray-500 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-gray-700"
          >
            <option value="dateDesc">Date: Newest First</option>
            <option value="dateAsc">Date: Oldest First</option>
            <option value="titleAsc">Title: A-Z</option>
            <option value="titleDesc">Title: Z-A</option>
          </select>

          <motion.button
            onClick={handleIngest}
            disabled={loadingIngest}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 ${
              loadingIngest
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gray-900 hover:bg-gray-700"
            }`}
          >
            {loadingIngest ? "Fetching..." : "Fetch & Summarize"}
          </motion.button>
        </div>
      </div>

      {/* Trending Topics */}
      {chartData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mb-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Trending Topics</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData.slice(0, 10)}>
              <XAxis dataKey="tag" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0b132b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Articles */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        style={{ gridAutoRows: "1fr" }}
      >
        <AnimatePresence>
          {loading ? (
            <motion.div
              className="col-span-full text-center text-gray-500 py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Loading articles...
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div
              className="col-span-full text-center text-gray-500 py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No articles yet. Click “Fetch & Summarize” to load news.
            </motion.div>
          ) : (
            filtered.map((article, idx) => (
              <motion.div
                key={article.id}
                className="h-full flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <ArticleCard article={article} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
