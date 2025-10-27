import CONFIG, { TRect, EDIRECTION } from "../config";
import Map from "./types/Map";
import Hero from "./types/Hero";
import Server from "../services/server/Server";
import Projectile from "./types/Projectile";
import Unit from "./types/Unit";

class Game {
    private server: Server;
    private Heroes: Hero[];
    private Walls: TRect[];
    private Swords: TRect[];
    private gameMap: Map;
    private Arrows: Projectile[];
    private Bots: Unit[];
    private interval: NodeJS.Timer | null = null;
    private movement: { dx: number; dy: number } = { dx: 0, dy: 0 };

    constructor(server: Server) {
        this.server = server;
        this.Heroes = [new Hero(), new Hero()];
        this.gameMap = new Map();
        this.Walls = this.gameMap.walls;
        this.Swords = [];
        this.Arrows = [];
        this.Bots = [];

        //this.server.startGetScene(() => this.getSceneFromBackend());
        this.startUpdateScene();
    }

    destructor() {
        this.stopUpdateScene();
        //this.server.stopGetScene();
    }

    getScene() {
        return {
            Heroes: this.Heroes.map(hero => hero),
            Walls: this.Walls,
            Swords: this.Swords.map(hero => hero),
            Arrows: this.Arrows.map(arrow => arrow),
            Bots: this.Bots.map(bot => bot),
        };
    }

    addArrow(heroIndex: number = 0): void {
        if (heroIndex >= this.Heroes.length) return;

        const hero = this.Heroes[heroIndex];
        const arrow = new Projectile();

        arrow.direction = hero.direction;
        arrow.rect.x = arrow.direction == "right" ? hero.rect.x + hero.rect.width + 1 : hero.rect.x - 31;
        arrow.rect.y = hero.rect.y + (hero.rect.height / 2);
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

    private canMove(hero: Hero, newX: number, newY: number): boolean {
        const newRect: TRect = {
            x: newX,
            y: newY,
            width: hero.rect.width,
            height: hero.rect.height
        };

        // Проверяем коллизию с каждой стеной
        if (this.Walls.find(wall => hero.checkRectCollision(newRect, wall))) {
            return false;
        }

        return true;
    }

    private checkArrowCollisions(): void {
        this.Arrows = this.Arrows.filter(arrow => {
            if (this.Walls.find(wall => {
                // Используем любого героя для проверки коллизий
                // (предполагается, что метод checkRectCollision одинаков для всех героев)
                return this.Heroes.length > 0 ?
                    this.Heroes[0].checkRectCollision(arrow.rect, wall) : false;
            })) {
                return false;
            }
            return true;
        });
    }

    private updateScene() {
        let isUpdated = false;

        // Обновляем всех героев
        this.Heroes.forEach(hero => {
            const dx = hero.movement.dx * hero.speed;
            const dy = hero.movement.dy * hero.speed;

            // Пробуем переместиться
            if (this.canMove(hero, hero.rect.x + dx, hero.rect.y + dy)) {
                hero.move(dx, dy);
                isUpdated = true;
            }
        });

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
            this.checkArrowCollisions();
        }

        // Обновляем позиции мечей для всех героев
        this.Swords = this.Heroes.map(hero => hero.getAttackPosition());

        if (isUpdated) {
            // Логика отправки на сервер
        }
    }
}

export default Game;