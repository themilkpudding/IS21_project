import React, { useEffect, useRef, useState } from 'react';

const Game = () => {
  const canvasRef = useRef(null);
  const [player, setPlayer] = useState({ x: 100, y: 100, size: 20 });
  const keys = useRef({ w: false, a: false, s: false, d: false, ц: false, ф: false, ы: false, в: false });

  const walls = useRef([
    { x: 200, y: 100, width: 50, height: 200 },
    { x: 400, y: 300, width: 150, height: 30 },
    { x: 100, y: 400, width: 30, height: 150 },
    { x: 600, y: 100, width: 40, height: 300 }
  ]);

  const checkCollision = (x, y, size) => {
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
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['w', 'a', 's', 'd', 'ц', 'ф', 'ы', 'в'].includes(e.key)) {
        keys.current[e.key] = true;
      }
    };

    const handleKeyUp = (e) => {
      if (['w', 'a', 's', 'd', 'ц', 'ф', 'ы', 'в'].includes(e.key)) {
        keys.current[e.key] = false;
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

        if (keys.current.w) moveY -= 1;
        if (keys.current.s) moveY += 1;
        if (keys.current.a) moveX -= 1;
        if (keys.current.d) moveX += 1;
        if (keys.current.ц) moveY -= 1;
        if (keys.current.ы) moveY += 1;
        if (keys.current.ф) moveX -= 1;
        if (keys.current.в) moveX += 1;

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
        newX = Math.max(0, Math.min(canvas.width - prev.size, newX));
        newY = Math.max(0, Math.min(canvas.height - prev.size, newY));

        return { ...prev, x: newX, y: newY };
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#888';
    for (const wall of walls.current) {
      ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    }
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