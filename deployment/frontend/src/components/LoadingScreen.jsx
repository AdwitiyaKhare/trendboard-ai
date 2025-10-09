// LoadingScreen.jsx
import { useState, useEffect } from "react";
import SnakeGame from "./SnakeGame";

function GameCard({ title, description, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer w-48 p-3 m-2 border border-gray-600 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
    >
      <h2 className="text-md font-semibold mb-1">{title}</h2>
      <p className="text-gray-300 text-xs">{description}</p>
    </div>
  );
}

export default function LoadingScreen() {
  const [activeGame, setActiveGame] = useState(null);
  const [serverTime, setServerTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setServerTime((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const games = [
    {
      id: "snake",
      title: "Snake",
      description: "Classic snake game. Eat the food and grow!",
      component: <SnakeGame />,
    },
    {
      id: "dummy",
      title: "Coming Soon",
      description: "More mini-games will appear here!",
      component: null,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] bg-gray-900 text-white py-8">
      {/* Server loading header */}
      <h1 className="text-lg mb-4 animate-pulse">
        Waking up server... {formatTime(serverTime)}
      </h1>

      {activeGame ? (
        <div className="w-full flex flex-col items-center">
          <button
            onClick={() => setActiveGame(null)}
            className="mb-3 px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition text-sm"
          >
            ← Back
          </button>
          {games.find((g) => g.id === activeGame)?.component}
        </div>
      ) : (
        <div className="flex flex-wrap justify-center">
          {games.map((game) => (
            <GameCard
              key={game.id}
              title={game.title}
              description={game.description}
              onClick={() => setActiveGame(game.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
