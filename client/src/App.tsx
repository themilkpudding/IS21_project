import React, { useEffect, useRef, useState } from 'react';

interface Player {
  x: number;
  y: number;
  size: number;
}

interface Wall {
  x: number;
  y: number;
  width: number;
  height: number;
}

type ControlKeys = 'w' | 'a' | 's' | 'd' | 'ц' | 'ф' | 'ы' | 'в';

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [player, setPlayer] = useState<Player>({ x: 100, y: 100, size: 20 });
  const keys = useRef<Record<ControlKeys, boolean>>({
    w: false,
    a: false,
    s: false,
    d: false,
    ц: false,
    ф: false,
    ы: false,
    в: false
  });

  const walls = useRef<Wall[]>([
    { x: 200, y: 100, width: 50, height: 200 },
    { x: 400, y: 300, width: 150, height: 30 },
    { x: 100, y: 400, width: 30, height: 150 },
    { x: 600, y: 100, width: 40, height: 300 }
  ]);

  const checkCollision = (x: number, y: number, size: number): boolean => {
    for (const wall of walls.current) {
      if (x + size > wall.x &&
        x < wall.x + wall.width &&
        y + size > wall.y &&
        y < wall.y + wall.height) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (Object.keys(keys.current).includes(key)) {
        keys.current[key as ControlKeys] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (Object.keys(keys.current).includes(key)) {
        keys.current[key as ControlKeys] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setPlayer(prev => {
        const speed = 5;
        let moveX = 0;
        let moveY = 0;

        if (keys.current.w || keys.current.ц) moveY -= 1;
        if (keys.current.s || keys.current.ы) moveY += 1;
        if (keys.current.a || keys.current.ф) moveX -= 1;
        if (keys.current.d || keys.current.в) moveX += 1;

        if (moveX !== 0 && moveY !== 0) {
          moveX *= 0.7071;
          moveY *= 0.7071;
        }

        let newX = prev.x + moveX * speed;
        let newY = prev.y;

        if (checkCollision(newX, newY, prev.size)) {
          newX = prev.x;
        }

        newY = prev.y + moveY * speed;

        if (checkCollision(newX, newY, prev.size)) {
          newY = prev.y;
        }

        const canvas = canvasRef.current;
        if (canvas) {
          newX = Math.max(0, Math.min(canvas.width - prev.size, newX));
          newY = Math.max(0, Math.min(canvas.height - prev.size, newY));
        }

        return { ...prev, x: newX, y: newY };
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем стены
    ctx.fillStyle = '#888';
    for (const wall of walls.current) {
      ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    }

    // Рисуем игрока
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.size, player.size);
  }, [player]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', backgroundColor: '#f0f0f0' }}
    />
  );
};

export default Game;