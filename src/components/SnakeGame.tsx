import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = 'UP';

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setScore(0);
    setIsGameOver(false);
    setIsPaused(true);
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] };

      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check collisions
      if (
        head.x < 0 || head.x >= GRID_SIZE ||
        head.y < 0 || head.y >= GRID_SIZE ||
        prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check food
      if (head.x === food.x && head.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused((p) => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, 150);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake]);

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-black border-2 border-cyan-neon">
      <div className="flex justify-between w-full items-center px-2">
        <div className="text-cyan-neon font-pixel text-xl tracking-tighter">
          DATA_HARVEST: <span className="text-magenta-neon">{score.toString().padStart(4, '0')}</span>
        </div>
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="p-2 border-2 border-magenta-neon text-magenta-neon hover:bg-magenta-neon hover:text-black transition-all"
        >
          {isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
        </button>
      </div>

      <div 
        className="relative bg-black border-4 border-white/10 overflow-hidden"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-20 pointer-events-none">
           {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
             <div key={i} className="border-[0.5px] border-cyan-neon/30" />
           ))}
        </div>

        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={`${segment.x}-${segment.y}-${i}`}
            className={`absolute ${i === 0 ? 'bg-cyan-neon z-10' : 'bg-cyan-neon/40'}`}
            style={{
              width: 20,
              height: 20,
              left: segment.x * 20,
              top: segment.y * 20,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute bg-magenta-neon animate-pulse"
          style={{
            width: 16,
            height: 16,
            left: food.x * 20 + 2,
            top: food.y * 20 + 2,
          }}
        />

        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20"
            >
              {isGameOver ? (
                <>
                  <h2 className="text-2xl font-pixel text-magenta-neon mb-6 glitch-text" data-text="CORE_FAILURE">CORE_FAILURE</h2>
                  <button 
                    onClick={resetGame}
                    className="p-4 border-4 border-cyan-neon text-cyan-neon hover:bg-cyan-neon hover:text-black transition-all"
                  >
                    <RotateCcw size={32} />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  <div className="p-6 border-4 border-magenta-neon text-magenta-neon">
                    <Pause size={64} fill="currentColor" />
                  </div>
                  <span className="text-cyan-neon font-pixel text-lg tracking-[0.2em] uppercase">PROCESS_HALTED</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-white/40 text-[10px] font-mono tracking-widest uppercase">
        INPUT_DEVICE: ARROWS // INTERRUPT: SPACE
      </div>
    </div>
  );
};
