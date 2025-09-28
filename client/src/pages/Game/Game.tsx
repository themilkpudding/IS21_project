import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import CONFIG from '../../config';
import Button from '../../components/Button/Button';
import { IBasePage, PAGES } from '../PageManager';
import Game from '../../game/Game';
import Canvas from '../../services/canvas/Canvas';
import useCanvas from '../../services/canvas/useCanvas';
import useSprites from './hooks/useSprites';

const GAME_FIELD = 'game-field';
const GREEN = '#00e81c';
const WALL_COLOR = '#8B4513'; // коричневый цвет для стен

const GamePage: React.FC<IBasePage> = (props: IBasePage) => {
    const { WINDOW, SPRITE_SIZE } = CONFIG;
    const { setPage } = props;
    let game: Game | null = null;
    const swordVisibleRef = useRef(false);
    const swordTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Храним состояние нажатых клавиш
    const keysPressedRef = useRef({
        w: false,
        a: false,
        s: false,
        d: false
    });

    // инициализация канваса
    let canvas: Canvas | null = null;
    const Canvas = useCanvas(render);
    let interval: NodeJS.Timer | null = null;
    // инициализация карты спрайтов
    const [
        [spritesImage],
        getSprite,
    ] = useSprites();

    function printFillSprite(image: HTMLImageElement, canvas: Canvas, { x = 0, y = 0 }, points: number[]): void {
        canvas.spriteFull(image, x, y, points[0], points[1], points[2]);
    }

    function printHero(canvas: Canvas, { x = 0, y = 0, width = 0, height = 0 }, points: number[]): void {
        canvas.rectangle(x, y, width, height, 'blue');
    }

    function printWall(canvas: Canvas, { x = 0, y = 0, width = 0, height = 0 }): void {
        canvas.rectangle(x, y, width, height, WALL_COLOR);
    }

    function printSword(canvas: Canvas, { x = 0, y = 0, width = 0, height = 0 }): void {
        canvas.rectangle(x, y, width, height, 'red');
    }

    // функция отрисовки одного кадра сцены
    function render(FPS: number): void {
        if (canvas && game) {
            canvas.clear();
            const { Hero, Walls, Sword } = game.getScene();

            /**********************/
            /* нарисовать стены */
            /**********************/
            if (Walls && Walls.length > 0 && canvas) {
                Walls.forEach(wall => {
                    printWall(canvas!, { x: wall.x, y: wall.y, width: wall.width, height: wall.height });
                });
            }

            /************************/
            /* нарисовать меч*/
            /************************/
            if (swordVisibleRef.current) {
                printSword(canvas!, { x: Sword.x, y: Sword.y, width: Sword.width, height: Sword.height });
            }

            /************************/
            /* нарисовать Героя */
            /************************/
            const { x, y, width, height } = Hero;
            printHero(canvas, { x, y, width, height }, getSprite(1));

            /******************/
            /* нарисовать FPS */
            /******************/
            canvas.text(WINDOW.LEFT + 20, WINDOW.TOP + 50, String(FPS), GREEN);
            /************************/
            /* отрендерить картинку */
            /************************/
            canvas.render();
        }
    }

    const backClickHandler = () => {
        setPage(PAGES.NOT_FOUND);
    };

    /****************/
    /* Mouse Events */
    /****************/
    const mouseMove = (_x: number, _y: number) => {
    }

    const mouseClick = (_x: number, _y: number) => {
        // Показываем меч на 500 мс
        swordVisibleRef.current = true;

        // Очищаем предыдущий таймер
        if (swordTimerRef.current) {
            clearTimeout(swordTimerRef.current);
        }

        // Устанавливаем таймер для скрытия меча
        swordTimerRef.current = setTimeout(() => {
            swordVisibleRef.current = false;
        }, 500);
    }

    const mouseRightClick = () => {
        console.log('ПКМ: использование второй руки');
    }
    /****************/

    const normalizeVector = (dx: number, dy: number): { dx: number; dy: number } => {
        if (dx === 0 || dy === 0) {
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
        if (swordVisibleRef.current || !game) {
            return;
        }

        const delta = 3
        const { w, a, s, d } = keysPressedRef.current;

        let dx = 0;
        let dy = 0;

        // Горизонтальное движение
        if (a) dx -= delta;
        if (d) dx += delta;

        // Вертикальное движение
        if (w) dy -= delta;
        if (s) dy += delta;

        // Нормализуем вектор движения для диагонального движения
        const normalized = normalizeVector(dx, dy);

        // Если есть движение по любой из осей
        if (dx !== 0 || dy !== 0) {
            game.move(normalized.dx, normalized.dy);
        }
    };

    useEffect(() => {
        // инициализация игры
        game = new Game();
        canvas = Canvas({
            parentId: GAME_FIELD,
            WIDTH: WINDOW.WIDTH,
            HEIGHT: WINDOW.HEIGHT,
            WINDOW,
            callbacks: {
                mouseMove,
                mouseClick,
                mouseRightClick,
            },
        });

        interval = setInterval(handleMovement, 8);

        return () => {
            // деинициализировать все экземпляры
            game?.destructor();
            canvas?.destructor();
            canvas = null;
            game = null;
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
        }
    });

    useEffect(() => {
        const keyDownHandler = (event: KeyboardEvent) => {
            const keyCode = event.keyCode ? event.keyCode : event.which ? event.which : 0;

            // Обновляем состояние нажатых клавиш
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
            }
        }

        const keyUpHandler = (event: KeyboardEvent) => {
            const keyCode = event.keyCode ? event.keyCode : event.which ? event.which : 0;

            // Обновляем состояние нажатых клавиш
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
            }
        }

        document.addEventListener('keydown', keyDownHandler);
        document.addEventListener('keyup', keyUpHandler);

        return () => {
            document.removeEventListener('keydown', keyDownHandler);
            document.removeEventListener('keyup', keyUpHandler);
        }
    });

    return (<div className='game'>
        <h1>Игра</h1>
        <Button onClick={backClickHandler} text='Назад' />
        <div id={GAME_FIELD} className={GAME_FIELD}></div>
    </div>)
}

export default GamePage;