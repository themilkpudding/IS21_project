import CONFIG, { TRect, EDIRECTION } from "../config";
import Map from "./types/Map";
import Hero from "./types/Hero";
import Server from "../services/server/Server";
import Projectile from "./types/Projectile";
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

    addArrow(): void {
        const arrow = new Projectile();

        arrow.direction = this.hero.direction;
        arrow.rect.x = arrow.direction == "right" ? this.hero.rect.x + this.hero.rect.width + 1 : this.hero.rect.x - 31;
        arrow.rect.y = this.hero.rect.y + (this.hero.rect.height / 2);
        this.Arrows.push(arrow);
    }

    private userIsOwner() {
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

    private canMove(newX: number, newY: number): boolean {
        const newRect: TRect = {
            x: newX,
            y: newY,
            width: this.hero.rect.width,
            height: this.hero.rect.height
        };

        // Проверяем коллизию с каждой стеной
        for (const wall of this.Walls) {
            if (this.hero.checkRectCollision(newRect, wall)) {
                return false;
            }
        }

        return true;
    }

    private updateScene() {
        const currentTime = Date.now();
        this.lastUpdateTime = currentTime;

        let isUpdated = false;

        // Применяем движение с проверкой коллизий
        if (this.movement.dx || this.movement.dy) {
            const dx = this.movement.dx * this.hero.speed;
            const dy = this.movement.dy * this.hero.speed;

            // Пробуем переместиться
            if ((dx || dy) && this.canMove(this.hero.rect.x + dx, this.hero.rect.y + dy)) {
                this.hero.move(dx, dy);
                isUpdated = true;
            }
        }

        // Передвинуть ботов
        // Передвинуть стрелы
        if (this.Arrows) {
            this.Arrows.forEach(arrow => {
                if (arrow.direction == "right") {
                    arrow.move(10, 0)
                } else {
                    arrow.move(-10, 0)
                }
            });
        }
        // Обновляем позицию меча после всех перемещений
        this.Sword = this.hero.getAttackPosition();

        if (isUpdated) {
            // Логика отправки на сервер
        }
    }
}

export default Game;