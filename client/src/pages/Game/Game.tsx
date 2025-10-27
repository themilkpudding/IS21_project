import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import { ServerContext } from '../../App';
import CONFIG from '../../config';
import Button from '../../components/Button/Button';
import { IBasePage, PAGES } from '../PageManager';
import Game from '../../game/Game';
import Canvas from '../../services/canvas/Canvas';
import useCanvas from '../../services/canvas/useCanvas';
import Store from '../../services/store/Store';
import Server from '../../services/server/Server';
import Chat from '../../components/Chat/Chat';

const GAME_FIELD = 'game-field';
const GREEN = '#00e81c';
const WALL_COLOR = '#8B4513';

const GamePage: React.FC<IBasePage> = (props: IBasePage) => {
    const server = useContext(ServerContext);
    const { WINDOW } = CONFIG;
    const { setPage } = props;
    const [isChatOpen, setIsChatOpen] = useState(false);
    const gameRef = useRef<Game | null>(null);
    const canvasRef = useRef<Canvas | null>(null);
    const animationFrameRef = useRef<number>(0);
    let isAttacking = false;

    const keysPressedRef = useRef({
        w: false,
        a: false,
        s: false,
        d: false
    });

    // Функция для отрисовки
    function printGameObject(
        canvas: Canvas,
        { x = 0, y = 0, width = 0, height = 0 }: { x: number; y: number; width: number; height: number },
        color: string
    ): void {
        canvas.rectangle(x, y, width, height, color);
    }

    // Использование функции render:
    const render = (FPS: number): void => {
        if (canvasRef.current && gameRef.current) {
            canvasRef.current.clear();
            const scene = gameRef.current.getScene();
            const { Hero, Walls, Sword, Arrows } = scene;

            // Рисуем стены
            Walls.forEach(wall => {
                printGameObject(canvasRef.current!, {
                    x: wall.x,
                    y: wall.y,
                    width: wall.width,
                    height: wall.height
                }, WALL_COLOR);
            });

            // Рисуем героя
            printGameObject(canvasRef.current, Hero.rect, 'blue');

            // Рисуем меч
            if (isAttacking) {
                printGameObject(canvasRef.current, Sword, 'red');
            }

            // Рисуем стрелы
            Arrows.forEach(arrow => {
                // Проверяем, активна ли стрела перед отрисовкой
                printGameObject(canvasRef.current!, {
                    x: arrow.rect.x,
                    y: arrow.rect.y,
                    width: arrow.rect.width,
                    height: arrow.rect.height
                }, "red");
            });

            // Рисуем FPS
            canvasRef.current.text(WINDOW.LEFT + 20, WINDOW.TOP + 50, String(FPS), GREEN);

            canvasRef.current.render();
        }
    };

    const CanvasComponent = useCanvas(render);

    const backClickHandler = () => {
        setPage(PAGES.MENU);
    };

    const mouseClick = () => {
        isAttacking = true;
        setTimeout(() => {
            isAttacking = false;
        }, 500);
    };

    const mouseRightClick = () => {
        gameRef.current?.addArrow();
    };

    const handleMovement = useCallback(() => {
        const { w, a, s, d } = keysPressedRef.current;

        let dx = 0;
        let dy = 0;

        if (a) dx -= 1;
        if (d) dx += 1;
        if (w) dy -= 1;
        if (s) dy += 1;

        if (dx !== 0 || dy !== 0) {
            gameRef.current?.setMovement(dx, dy);
        } else {
            gameRef.current?.setMovement(0, 0);
        }
    }, []);

    useEffect(() => {
        // Инициализация игры
        gameRef.current = new Game(server);

        // Инициализация канваса
        canvasRef.current = CanvasComponent({
            parentId: GAME_FIELD,
            WIDTH: WINDOW.WIDTH,
            HEIGHT: WINDOW.HEIGHT,
            WINDOW,
            callbacks: {
                mouseMove: () => { },
                mouseClick,
                mouseRightClick,
            },
        });

        // Игровой цикл
        const gameLoop = () => {
            handleMovement();
            animationFrameRef.current = requestAnimationFrame(gameLoop);
        };

        animationFrameRef.current = requestAnimationFrame(gameLoop);

        return () => {
            // Очистка ресурсов
            cancelAnimationFrame(animationFrameRef.current);
            gameRef.current?.destructor();
            canvasRef.current?.destructor();
            canvasRef.current = null;
            gameRef.current = null;
        };
    }, [handleMovement, WINDOW]);

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
                <p>Управление: WASD - движение, ЛКМ - атака мечом, ПКМ - выстрел из лука</p>
            </div>
            <div id={GAME_FIELD} className={GAME_FIELD}></div>
            <Chat
                isOpen={isChatOpen}
                onToggle={setIsChatOpen}
            />
        </div>
    );
};

export default GamePage;