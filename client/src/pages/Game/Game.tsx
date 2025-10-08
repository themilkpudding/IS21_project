import React, { useEffect, useState, useRef } from 'react';
import CONFIG from '../../config';
import Button from '../../components/Button/Button';
import { IBasePage, PAGES } from '../PageManager';
import Game from '../../game/Game';
import Canvas from '../../services/canvas/Canvas';
import useCanvas from '../../services/canvas/useCanvas';
import useSprites from './hooks/useSprites';

const GAME_FIELD = 'game-field';
const GREEN = '#00e81c';
const WALL_COLOR = '#8B4513';
const ARROW_COLOR = '#8B4513';

type AttackMode = 'sword' | 'bow';

const GamePage: React.FC<IBasePage> = (props: IBasePage) => {
    const { WINDOW } = CONFIG;
    const { setPage } = props;

    const gameRef = useRef<Game | null>(null);
    const canvasRef = useRef<Canvas | null>(null);
    const swordVisibleRef = useRef(false);
    const swordTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [attackMode, setAttackMode] = useState<AttackMode>('sword');
    const attackModeRef = useRef<AttackMode>('sword');

    const keysPressedRef = useRef({
        w: false,
        a: false,
        s: false,
        d: false,
        space: false
    });

    const [debugInfo, setDebugInfo] = useState({
        arrowsCount: 0,
        hasBow: false,
        attackMode: 'sword'
    });

    const movementIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const gameUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const shootingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const CanvasComponent = useCanvas(render);
    const [
        [spritesImage],
        getSprite,
    ] = useSprites();

    function printHero(canvas: Canvas, { x = 0, y = 0, width = 0, height = 0 }): void {
        canvas.rectangle(x, y, width, height, 'blue');
    }

    function printWall(canvas: Canvas, { x = 0, y = 0, width = 0, height = 0 }): void {
        canvas.rectangle(x, y, width, height, WALL_COLOR);
    }

    function printSword(canvas: Canvas, { x = 0, y = 0, width = 0, height = 0 }): void {
        canvas.rectangle(x, y, width, height, 'red');
    }

    function printArrow(canvas: Canvas, { x = 0, y = 0, width = 0, height = 0 }): void {
        canvas.rectangle(x, y, width, height, ARROW_COLOR);
    }

    function render(FPS: number): void {
        if (canvasRef.current && gameRef.current) {
            canvasRef.current.clear();
            const scene = gameRef.current.getScene();
            const { Hero, Walls, Sword, Arrows } = scene;

            // Рисуем стены
            if (Walls && Walls.length > 0) {
                Walls.forEach(wall => {
                    printWall(canvasRef.current!, {
                        x: wall.x,
                        y: wall.y,
                        width: wall.width,
                        height: wall.height
                    });
                });
            }

            // Рисуем стрелы
            if (Arrows && Arrows.length > 0) {
                Arrows.forEach(arrow => {
                    printArrow(canvasRef.current!, {
                        x: arrow.x,
                        y: arrow.y,
                        width: arrow.width,
                        height: arrow.height
                    });
                });
            }

            // Рисуем меч
            if (swordVisibleRef.current && attackModeRef.current === 'sword') {
                printSword(canvasRef.current!, {
                    x: Sword.x,
                    y: Sword.y,
                    width: Sword.width,
                    height: Sword.height
                });
            }

            // Рисуем героя
            const { x, y, width, height } = Hero;
            printHero(canvasRef.current, { x, y, width, height });

            // Рисуем FPS
            canvasRef.current.text(WINDOW.LEFT + 20, WINDOW.TOP + 50, String(FPS), GREEN);

            canvasRef.current.render();
            updateDebugInfo();
        }
    }

    const updateDebugInfo = () => {
        if (gameRef.current) {
            const hero = gameRef.current.getHero();
            const hasBow = hero.getInventory().some(item => item.toLowerCase().includes('bow')) ||
                hero.getEquipment().some(item => item.toLowerCase().includes('bow'));

            setDebugInfo({
                arrowsCount: gameRef.current.getArrows().length,
                hasBow,
                attackMode: attackModeRef.current
            });
        }
    };

    const backClickHandler = () => {
        setPage(PAGES.NOT_FOUND);
    };

    const mouseClick = (_x: number, _y: number) => {
        if (attackModeRef.current === 'sword') {
            // Используем меч
            swordVisibleRef.current = true;

            if (swordTimerRef.current) {
                clearTimeout(swordTimerRef.current);
            }

            swordTimerRef.current = setTimeout(() => {
                swordVisibleRef.current = false;
            }, 500);
        } else if (attackModeRef.current === 'bow') {
            // Используем лук
            if (gameRef.current) {
                gameRef.current.shoot();
            }
        }
    };

    // Функция для переключения режима атаки
    const switchAttackMode = (mode: AttackMode) => {
        setAttackMode(mode);
        attackModeRef.current = mode;
        updateDebugInfo();
    };

    const normalizeVector = (dx: number, dy: number): { dx: number; dy: number } => {
        if (dx === 0 && dy === 0) {
            return { dx, dy };
        }

        const length = Math.sqrt(dx * dx + dy * dy);
        const normalizedDx = dx / length;
        const normalizedDy = dy / length;

        const delta = 3;
        return {
            dx: normalizedDx * delta,
            dy: normalizedDy * delta
        };
    };

    const handleMovement = () => {
        if (swordVisibleRef.current || !gameRef.current) {
            return;
        }

        const delta = 3;
        const { w, a, s, d } = keysPressedRef.current;

        let dx = 0;
        let dy = 0;

        if (a) dx -= delta;
        if (d) dx += delta;
        if (w) dy -= delta;
        if (s) dy += delta;

        const normalized = normalizeVector(dx, dy);

        if (dx !== 0 || dy !== 0) {
            gameRef.current.move(normalized.dx, normalized.dy);
        }
    };

    const handleShooting = () => {
    };

    useEffect(() => {
        // Инициализация игры
        gameRef.current = new Game();

        // Инициализация канваса
        canvasRef.current = CanvasComponent({
            parentId: GAME_FIELD,
            WIDTH: WINDOW.WIDTH,
            HEIGHT: WINDOW.HEIGHT,
            WINDOW,
            callbacks: {
                mouseMove: () => { },
                mouseClick,
                mouseRightClick: () => { },
            },
        });

        // Добавляем лук для тестирования
        gameRef.current.addBowToInventory();

        // Интервалы для обновления игры
        movementIntervalRef.current = setInterval(handleMovement, 8);
        shootingIntervalRef.current = setInterval(handleShooting, 100);

        // Интервал для обновления состояния игры (стрел)
        gameUpdateIntervalRef.current = setInterval(() => {
            if (gameRef.current) {
                gameRef.current.update();
            }
        }, 8);

        return () => {
            // Очистка ресурсов
            gameRef.current?.destructor();
            canvasRef.current?.destructor();
            canvasRef.current = null;
            gameRef.current = null;

            if (movementIntervalRef.current) {
                clearInterval(movementIntervalRef.current);
            }
            if (gameUpdateIntervalRef.current) {
                clearInterval(gameUpdateIntervalRef.current);
            }
            if (shootingIntervalRef.current) {
                clearInterval(shootingIntervalRef.current);
            }
            if (swordTimerRef.current) {
                clearTimeout(swordTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const keyDownHandler = (event: KeyboardEvent) => {
            const keyCode = event.keyCode ? event.keyCode : event.which ? event.which : 0;

            switch (keyCode) {
                case 65: // a
                    keysPressedRef.current.a = true;
                    break;
                case 68: // d
                    keysPressedRef.current.d = true;
                    break;
                case 87: // w
                    keysPressedRef.current.w = true;
                    break;
                case 83: // s
                    keysPressedRef.current.s = true;
                    break;
                case 49: // 1 - переключение на меч
                    switchAttackMode('sword');
                    break;
                case 50: // 2 - переключение на лук
                    switchAttackMode('bow');
                    break;
                default:
                    break;
            }
        };

        const keyUpHandler = (event: KeyboardEvent) => {
            const keyCode = event.keyCode ? event.keyCode : event.which ? event.which : 0;

            switch (keyCode) {
                case 65: // a
                    keysPressedRef.current.a = false;
                    break;
                case 68: // d
                    keysPressedRef.current.d = false;
                    break;
                case 87: // w
                    keysPressedRef.current.w = false;
                    break;
                case 83: // s
                    keysPressedRef.current.s = false;
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', keyDownHandler);
        document.addEventListener('keyup', keyUpHandler);

        return () => {
            document.removeEventListener('keydown', keyDownHandler);
            document.removeEventListener('keyup', keyUpHandler);
        };
    }, []);

    return (
        <div className='game'>
            <h1>Игра</h1>
            <Button onClick={backClickHandler} text='Назад' />
            <div className="debug-info">
                <p>Стрелы: {debugInfo.arrowsCount} | Лук: {debugInfo.hasBow ? 'Есть' : 'Нет'} | Режим: {debugInfo.attackMode}</p>
                <p>Управление: WASD - движение, ЛКМ - атака, 1 - меч, 2 - лук</p>
            </div>
            <div id={GAME_FIELD} className={GAME_FIELD}></div>
        </div>
    );
};

export default GamePage;