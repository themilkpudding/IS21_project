import CONFIG, { TRect, EDIRECTION } from "../config";
import { Map } from "./Map";
import Hero from "./Hero";
import Server from "../services/server/Server";
import Projectile from "./Projectile";
import Unit from "./types/Unit";

class Game {
    private server: Server;
    private hero: Hero;
    private Walls: TRect[];
    private Sword: TRect;
    private gameMap: Map;
    private Arrows: Projectile[];
    private Bots: Unit[];
    private interval: NodeJS.Timer | null = null;
    private movement: { dx: number; dy: number } = { dx: 0, dy: 0 };
    private lastUpdateTime: number = 0;

    constructor(server: Server) {
        this.server = server;
        this.hero = new Hero();
        this.gameMap = new Map();
        this.Walls = this.gameMap.getWalls();
        this.Sword = this.hero.getAttackPosition();
        this.Arrows = [];
        this.Bots = [];
        this.lastUpdateTime = Date.now();

        //this.server.startGetScene(() => this.getSceneFromBackend());
        this.startUpdateScene();
    }

    destructor() {
        this.stopUpdateScene();
        //this.server.stopGetScene();
    }

    getScene() {
        return {
            Hero: this.hero,
            Walls: this.Walls,
            Sword: this.Sword,
            Arrows: this.Arrows.map(arrow => arrow),
            Bots: this.Bots.map(bot => bot),
        };
    }

    setMovement(dx: number, dy: number): void {
        this.movement = { dx, dy };
    }

    move(dx: number, dy: number): void {
        this.setMovement(dx, dy);
    }

    private startUpdateScene() {
        if (this.interval) {
            this.stopUpdateScene();
        }
        this.interval = setInterval(
            () => this.updateScene(),
            CONFIG.GAME_UPDATE_TIMESTAMP
        );
    }

    private stopUpdateScene() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    // 100 ms
    private getSceneFromBackend() {
        // если пришёл ответ
        // распарсить его
        // принудительно применить к сцене игры
    }

    private updateScene() {
        const currentTime = Date.now();
        this.lastUpdateTime = currentTime;

        let isUpdated = false;

        // Применяем движение
        if (this.moveHero()) {
            isUpdated = true;
        }

        // Передвинуть ботов
        // Передвинуть стрелы
        // Обновляем позицию меча после всех перемещений
        this.Sword = this.hero.getAttackPosition();

        if (isUpdated) {
            // Логика отправки на сервер
        }
    }

    private moveHero(): boolean {
        if (this.movement.dx !== 0 || this.movement.dy !== 0) {
            // Нормализуем вектор движения для диагонального движения
            let dx = this.movement.dx;
            let dy = this.movement.dy;

            // Если движение по диагонали, нормализуем вектор
            if (dx !== 0 && dy !== 0) {
                const length = Math.sqrt(dx * dx + dy * dy);
                dx = (dx / length) * this.hero.speed;
                dy = (dy / length) * this.hero.speed;
            } else {
                // Прямое движение
                dx = dx !== 0 ? (dx > 0 ? this.hero.speed : -this.hero.speed) : 0;
                dy = dy !== 0 ? (dy > 0 ? this.hero.speed : -this.hero.speed) : 0;
            }

            // Проверяем коллизии перед перемещением
            const newX = this.hero.rect.x + dx;
            const newY = this.hero.rect.y + dy;

            // Проверяем коллизии с каждой стеной
            let canMoveX = true;
            let canMoveY = true;

            for (const wall of this.Walls) {
                if (this.hero.checkRectCollision(this.hero.rect, wall)) {
                    // Если есть коллизия по X
                    const tempRectX = { ...this.hero.rect, x: newX };
                    if (this.hero.checkRectCollision(tempRectX, wall)) {
                        canMoveX = false;
                    }

                    // Если есть коллизия по Y
                    const tempRectY = { ...this.hero.rect, y: newY };
                    if (this.hero.checkRectCollision(tempRectY, wall)) {
                        canMoveY = false;
                    }
                }
            }

            // Применяем движение с учетом коллизий
            if (canMoveX) {
                this.hero.rect.x = newX;
            }
            if (canMoveY) {
                this.hero.rect.y = newY;
            }

            // Обновляем направление только если было движение
            if (canMoveX && dx !== 0) {
                this.hero.direction = dx >= 0 ? EDIRECTION.RIGHT : EDIRECTION.LEFT;
            }

            return canMoveX || canMoveY;
        }
        return false;
    }
}

export default Game;