import { useState, useEffect, useRef } from "react";
import "./style.css";

const GRID_SIZE = 17;
const INITIAL_SNAKE = [[5, 5]];
const DEFAULT_SPEED = 150;

const eatSound = new Audio("./eat.mp3");
const gameOverSound = new Audio("./gameover.mp3");

function generateFood(snakeBody) {
  let newFood;
  do {
    newFood = [
      Math.floor(Math.random() * GRID_SIZE),
      Math.floor(Math.random() * GRID_SIZE),
    ];
  } while (snakeBody.some(([sx, sy]) => sx === newFood[0] && sy === newFood[1]));
  return newFood;
}

function SnakeGame() {
  const [snakeBody, setSnakeBody] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(generateFood(INITIAL_SNAKE));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    localStorage.getItem("highScore") ? parseInt(localStorage.getItem("highScore")) : 0
  );
  const [isGameOver, setIsGameOver] = useState(false);
  const [speed, setSpeed] = useState(
    localStorage.getItem("speed") ? parseInt(localStorage.getItem("speed")) : DEFAULT_SPEED
  );

  const directionRef = useRef([1, 0]);

  useEffect(() => {
    if (isGameOver) {
      gameOverSound.play();
      return;
    }

    const gameInterval = setInterval(() => {
      setSnakeBody((prevSnakeBody) => {
        const newHead = [
          prevSnakeBody[0][0] + directionRef.current[0],
          prevSnakeBody[0][1] + directionRef.current[1],
        ];

        if (
          newHead[0] < 0 ||
          newHead[0] >= GRID_SIZE ||
          newHead[1] < 0 ||
          newHead[1] >= GRID_SIZE ||
          prevSnakeBody.some(([sx, sy]) => sx === newHead[0] && sy === newHead[1])
        ) {
          setIsGameOver(true);
          return prevSnakeBody;
        }

        const newSnakeBody = [newHead, ...prevSnakeBody];

        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          eatSound.play();
          setFood(generateFood(newSnakeBody));
          setScore((prev) => {
            const newScore = prev + 1;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem("highScore", newScore);
            }
            return newScore;
          });
        } else {
          newSnakeBody.pop();
        }

        return newSnakeBody;
      });
    }, speed);

    function handleDirection(e) {
      if (isGameOver) return;
      const keyMap = {
        ArrowDown: [0, 1],
        ArrowUp: [0, -1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
      };

      if (
        keyMap[e.key] &&
        !(directionRef.current[0] === -keyMap[e.key][0] && directionRef.current[1] === -keyMap[e.key][1])
      ) {
        directionRef.current = keyMap[e.key];
      }
    }

    window.addEventListener("keydown", handleDirection);
    return () => {
      clearInterval(gameInterval);
      window.removeEventListener("keydown", handleDirection);
    };
  }, [food, isGameOver, speed, highScore]);

  function restartGame() {
    setSnakeBody(INITIAL_SNAKE);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
    directionRef.current = [1, 0];
  }

  function increaseSpeed() {
    setSpeed((prev) => {
      const newSpeed = Math.max(50, prev - 20);
      localStorage.setItem("speed", newSpeed);
      return newSpeed;
    });
  }

  function decreaseSpeed() {
    setSpeed((prev) => {
      const newSpeed = Math.min(300, prev + 20);
      localStorage.setItem("speed", newSpeed);
      return newSpeed;
    });
  }

  function getSpeedLabel() {
    if (speed <= 70) return "Fast";
    if (speed <= 150) return "Medium";
    return "Slow";
  }

  return (
    <div className="game-container">
     <h1 className="game-title ">SNAKE GAME</h1> {/* Heading */}
      <div className="score">Score: {score}</div>
      <div className="high-score">High Score: {highScore}</div>
      <div className="speed-display">Speed: {speed}ms ({getSpeedLabel()})</div>
      <div className="controls">
        <button onClick={increaseSpeed} className="speed_btn">Increase Speed</button>
        <button onClick={decreaseSpeed} className="speed_btn">Decrease Speed</button>
      </div>
      <div>
      <button onClick={restartGame} className="restart-btn">Restart</button>

      </div>
      <div className={`grid ${isGameOver ? "game-over" : ""}`}>
        {Array.from({ length: GRID_SIZE }, (_, yc) =>
          Array.from({ length: GRID_SIZE }, (_, xc) => (
            <div
              key={`${xc}-${yc}`}
              className={`cell ${
                snakeBody.some(([sx, sy]) => sx === xc && sy === yc) ? "snake" : ""
              } ${food[0] === xc && food[1] === yc ? "food" : ""}`}
            ></div>
          ))
        )}
      </div>
    </div>
  );
}

export default SnakeGame;