import React, { useEffect, useRef } from 'react';

export interface Player {
    x: number;
    y: number;
    size: number;
}

export interface Wall {
    x: number;
    y: number;
    width: number;
    height: number;
}

export type ControlKeys = 'w' | 'a' | 's' | 'd' | 'ц' | 'ф' | 'ы' | 'в';

interface CanvasProps {
    player: Player;
    walls: Wall[];
    onResize: (canvas: HTMLCanvasElement) => void;
}

export const Canvas: React.FC<CanvasProps> = ({ player, walls, onResize }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            onResize(canvas);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, [onResize]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Рисуем стены
        ctx.fillStyle = '#888';
        for (const wall of walls) {
            ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
        }

        // Рисуем игрока
        ctx.fillStyle = 'blue';
        ctx.fillRect(player.x, player.y, player.size, player.size);
    }, [player, walls]);

    return (
        <canvas
            ref={canvasRef}
            style={{ display: 'block', backgroundColor: '#f0f0f0' }}
        />
    );
};