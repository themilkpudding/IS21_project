import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import { ServerContext } from '../../App';
import CONFIG from '../../config';
import Button from '../../components/Button/Button';
import { IBasePage, PAGES } from '../PageManager';
import MenuGame from '../../menu/MenuGame';
import Canvas from '../../services/canvas/Canvas';
import useCanvas from '../../services/canvas/useCanvas';
import Chat from '../../components/Chat/Chat';
import background from '../../assets/img/menu/background.png';
import './Menu.scss'
import LobbyManager from '../../components/LobbyManager/LobbyManager';

const MENU_FIELD = 'menu-field';
const GREEN = '#00e81c';
const WALL_COLOR = 'transparent';

const Menu: React.FC<IBasePage> = (props: IBasePage) => {
    const { setPage } = props;
    const server = useContext(ServerContext);
    const { WINDOW } = CONFIG;
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isLobbyManagerOpen, setIsLobbyManagerOpen] = useState(false);
    const gameRef = useRef<MenuGame | null>(null);
    const canvasRef = useRef<Canvas | null>(null);
    const animationFrameRef = useRef<number>(0);
    const backgroundImageRef = useRef<HTMLImageElement>(new Image());
    const [showStartButton, setShowStartButton] = useState(false);
    const [showShopButton, setShowShopButton] = useState(false);

    const keysPressedRef = useRef({
        w: false,
        a: false,
        s: false,
        d: false
    });

    // Функция для отрисовки
    function printGameObject(
        canvas: Canvas,
        { x = 0, y = 0, width = 100, height = 100 }: { x: number; y: number; width: number; height: number },
        color: string
    ): void {
        canvas.rectangle(x, y, width, height, color);
    }

    useEffect(() => {
        backgroundImageRef.current.src = background;
    }, []);

    // Использование функции render:
    const render = (FPS: number): void => {
        if (canvasRef.current && gameRef.current && backgroundImageRef.current) {
            canvasRef.current.clearImage(backgroundImageRef.current);
            const scene = gameRef.current.getScene();
            const { Heroes, Walls } = scene;

            const hero = scene.Heroes[0];

            if (hero.rect.x > 814 && hero.rect.x < 1105 &&
                hero.rect.y > 685 && hero.rect.y < 770) {
                setShowStartButton(true);
            } else {
                setShowStartButton(false);
            }

            if (hero.rect.x > 1455 && hero.rect.x < 1821 &&
                hero.rect.y > 866 && hero.rect.y < 951) {
                setShowShopButton(true);
            } else {
                setShowShopButton(false);
            }

            // Рисуем стены
            Walls.forEach(wall => {
                printGameObject(canvasRef.current!, {
                    x: wall.x,
                    y: wall.y,
                    width: wall.width,
                    height: wall.height
                }, WALL_COLOR);
            });

            // Рисуем всех героев
            Heroes.forEach((hero, index) => {
                // Основной герой игрока - синий, остальные - другие цвета
                const color = index === 0 ? 'blue' : ['green', 'yellow', 'purple'][index % 3];
                printGameObject(canvasRef.current!, hero.rect, color);
            });

            // Рисуем FPS
            canvasRef.current.text(WINDOW.LEFT + 20, WINDOW.TOP + 50, String(FPS), GREEN);

            canvasRef.current.render();
        }
    };

    const CanvasComponent = useCanvas(render);

    const handleMovement = useCallback(() => {
        const { w, a, s, d } = keysPressedRef.current;

        let dx = 0;
        let dy = 0;

        if (a) dx -= 1;
        if (d) dx += 1;
        if (w) dy -= 1;
        if (s) dy += 1;

        // Получаем сцену и устанавливаем движение для основного героя
        if (gameRef.current) {
            const scene = gameRef.current.getScene();
            scene.Heroes[0].movement.dx = dx;
            scene.Heroes[0].movement.dy = dy;
        }
    }, []);

    useEffect(() => {
        // Инициализация игры
        gameRef.current = new MenuGame(server);

        const scene = gameRef.current.getScene();
        scene.Heroes[0].rect.x = 740;
        scene.Heroes[0].rect.y = 800;

        // Инициализация канваса
        canvasRef.current = CanvasComponent({
            parentId: MENU_FIELD,
            WIDTH: 1920,
            HEIGHT: 1080,
            WINDOW: {
                WIDTH: 1920,
                HEIGHT: 1080,
                LEFT: 0,
                TOP: 0
            },
            callbacks: {
                mouseMove: () => { },
                mouseClick: () => { },
                mouseRightClick: () => { },
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
                case 70: // f
                    event.preventDefault();
                    if (showStartButton) {
                        startingGameMenuClickHandler();
                    } else if (showShopButton) {
                        classShopClickHandler();
                    }
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
    }, [showStartButton, showShopButton]);


    const classShopClickHandler = () => {
        setPage(PAGES.CLASS_SHOP);
    };

    const startingGameMenuClickHandler = () => {
        setPage(PAGES.STARTING_GAME_MENU);
    };

    return (<div className='menu'>
        <div className="canvas-container">
            {showStartButton && (
                <Button
                    onClick={startingGameMenuClickHandler}
                    className='startGame-button'
                    id='test-menu-startGame-button'
                />
            )}
            {showShopButton && (
                <Button
                    onClick={classShopClickHandler}
                    className='classShop-button'
                    id='test-menu-classShop-button'
                />
            )}
            <LobbyManager
                setPage={setPage}
                isOpen={isLobbyManagerOpen}
                onToggle={setIsLobbyManagerOpen}
            />
            <div id={MENU_FIELD} className={MENU_FIELD}></div>
            <Chat
                isOpen={isChatOpen}
                onToggle={setIsChatOpen}
            />
        </div>
    </div>)
}

export default Menu;