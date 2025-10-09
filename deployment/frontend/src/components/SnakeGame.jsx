import { useEffect, useRef, useState } from "react";

export default function SnakeGame() {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([[8, 8]]);
  const [food, setFood] = useState([12, 12]);
  const [dir, setDir] = useState([0, -1]);
  const [nextDir, setNextDir] = useState([0, -1]); // to prevent reverse moves
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem("snakeHighScore")) || 0
  );
  const [gameOver, setGameOver] = useState(false);
  const [headAngle, setHeadAngle] = useState(0); // rotation in radians

  const gridSize = 16;
  const cellSize = 20;

  const directionToAngle = {
    "0,-1": -Math.PI / 2,
    "0,1": Math.PI / 2,
    "-1,0": Math.PI,
    "1,0": 0,
  };

  const isValidDirection = (newDir) =>
    !(newDir[0] === -dir[0] && newDir[1] === -dir[1]);

  useEffect(() => {
    const handleKey = (e) => {
      if (gameOver) return;
      let newDir;
      switch (e.key) {
        case "ArrowUp":
          if (dir[1] !== 1) newDir = [0, -1];
          break;
        case "ArrowDown":
          if (dir[1] !== -1) newDir = [0, 1];
          break;
        case "ArrowLeft":
          if (dir[0] !== 1) newDir = [-1, 0];
          break;
        case "ArrowRight":
          if (dir[0] !== -1) newDir = [1, 0];
          break;
      }
      if (newDir && isValidDirection(newDir)) {
        setNextDir(newDir);
        setHeadAngle(directionToAngle[newDir.toString()]);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dir, gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setDir(nextDir);
      setSnake((prev) => {
        let head = [prev[0][0] + nextDir[0], prev[0][1] + nextDir[1]];
        head[0] = (head[0] + gridSize) % gridSize;
        head[1] = (head[1] + gridSize) % gridSize;

        const newSnake = [head, ...prev];

        for (let i = 1; i < newSnake.length; i++) {
          if (head[0] === newSnake[i][0] && head[1] === newSnake[i][1]) {
            setGameOver(true);
            if (score > highScore) {
              setHighScore(score);
              localStorage.setItem("snakeHighScore", score);
            }
            return prev;
          }
        }

        if (head[0] === food[0] && head[1] === food[1]) {
          setScore((s) => s + 1);
          setFood([
            Math.floor(Math.random() * gridSize),
            Math.floor(Math.random() * gridSize),
          ]);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [nextDir, food, gameOver, score, highScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#1f2937";
    ctx.fillRect(0, 0, gridSize * cellSize, gridSize * cellSize);

    ctx.fillStyle = "red";
    ctx.fillRect(
      food[0] * cellSize,
      food[1] * cellSize,
      cellSize - 2,
      cellSize - 2
    );

    snake.forEach(([x, y], idx) => {
      ctx.fillStyle = "lime";
      ctx.fillRect(x * cellSize, y * cellSize, cellSize - 2, cellSize - 2);

      if (idx === 0) {
        ctx.save();
        ctx.translate(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
        ctx.rotate(headAngle);
        ctx.fillStyle = "black";
        ctx.font = "14px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        let face = ":)";
        if (gameOver) face = ":(";
        else {
          const range = 3;
          const adjacent =
            Math.abs(x - food[0]) <= range && Math.abs(y - food[1]) <= range;
          face = adjacent ? ":O" : ":)";
        }
        ctx.fillText(face, 0, 0);
        ctx.restore();
      }
    });
  }, [snake, food, gameOver, headAngle]);

  const handleRetry = () => {
    setSnake([[8, 8]]);
    setFood([
      Math.floor(Math.random() * gridSize),
      Math.floor(Math.random() * gridSize),
    ]);
    setDir([0, -1]);
    setNextDir([0, -1]);
    setScore(0);
    setGameOver(false);
    setHeadAngle(-Math.PI / 2);
  };

  const handleTouchControl = (newDir) => {
    if (!isValidDirection(newDir)) return;
    setNextDir(newDir);
    setHeadAngle(directionToAngle[newDir.toString()]);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-80 mb-2 text-gray-200">
        <span>Score: {score}</span>
        <span>Highscore: {highScore}</span>
      </div>

      <canvas
        ref={canvasRef}
        width={gridSize * cellSize}
        height={gridSize * cellSize}
        className="border-2 border-gray-600 mb-2 max-w-full"
      />

      {gameOver && (
        <div className="flex flex-col items-center">
          <p className="text-red-500 font-bold text-lg mb-2">💀 Game Over!</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Retry
          </button>
        </div>
      )}

      {!gameOver && (
        <div className="flex flex-col items-center w-full">
          <p className="mt-1 text-sm text-gray-400 mb-2 text-center">
            Use arrow keys (desktop) or on-screen buttons (mobile) to move 🐍
          </p>

          <div className="flex flex-col items-center sm:hidden">
            <div className="flex">
              <button
                onClick={() => handleTouchControl([0, -1])}
                className="px-6 py-3 m-1 bg-gray-700 text-white rounded"
              >
                ↑
              </button>
            </div>
            <div className="flex">
              <button
                onClick={() => handleTouchControl([-1, 0])}
                className="px-6 py-3 m-1 bg-gray-700 text-white rounded"
              >
                ←
              </button>
              <button
                onClick={() => handleTouchControl([1, 0])}
                className="px-6 py-3 m-1 bg-gray-700 text-white rounded"
              >
                →
              </button>
            </div>
            <div className="flex">
              <button
                onClick={() => handleTouchControl([0, 1])}
                className="px-6 py-3 m-1 bg-gray-700 text-white rounded"
              >
                ↓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
