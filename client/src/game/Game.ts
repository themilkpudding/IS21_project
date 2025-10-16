import CONFIG, { FPoint } from "../config";
import { Map } from "./map";
import Hero, { KNIGHT } from "./hero";
import { Projectile } from "./hero"
import Server from "../services/server/Server";

// heroes
// bots
// arrows
// walls
// pits (?)

class Game {
    private server: Server;
    private hero: Hero;
    private Walls: FPoint[];
    private Sword: FPoint;
    private gameMap: Map;
    private Arrows: Projectile[];
    private interval: NodeJS.Timer | null = null;

    constructor(server: Server) {
        this.server = server;
        this.hero = new Hero(650, 400, KNIGHT);
        this.gameMap = new Map();
        this.Walls = this.gameMap.getWalls();
        this.Sword = this.hero.getAttackPosition();
        this.Arrows = [];

        this.server.startGetScene(() => this.getSceneFromBackend());
        this.startUpdateScene();
    }

    destructor() {
        this.stopUpdateScene();
        this.server.stopGetScene();
    }

    getScene() {
        return {
            Hero: this.hero.getPosition(),
            Walls: this.Walls,
            Sword: this.Sword,
            Arrows: this.Arrows.map(arrow => arrow.getPosition()),
        };
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

    // 20, 50 ms
    private updateScene() {
        let isUpdated = false;
        // передвинуть героев
        // передвинуть ботов
        // передвинуть стрелы
        // воткнуть стрелы
        // нанести удары ботами
        // посчитать нанесённую дамагу
        // умереть всех причастных
        if (isUpdated && this.userIsOwner()) {
            //JSON.stringify()
            this.server.updateScene();
        }
    }

    /*

    move(dx: number, dy: number): void {
        const currentPos = this.hero.getPosition();
        let newX = currentPos.x;
        let newY = currentPos.y;

        if (dx !== 0) {
            newX = currentPos.x + dx;
            const collidingWall = this.Walls.find(wall =>
                this.check_collision(newX, currentPos.y, wall)
            );
            if (!collidingWall) {
                this.hero.move(dx, 0);
            }
        }

        if (dy !== 0) {
            newY = currentPos.y + dy;
            const collidingWall = this.Walls.find(wall =>
                this.check_collision(currentPos.x, newY, wall)
            );
            if (!collidingWall) {
                this.hero.move(0, dy);
            }
        }

        this.Sword = this.hero.getAttackPosition();
    }

    update(): void {
        this.hero.updateProjectiles();
        this.syncArrowsWithHero();
        this.checkArrowCollisions();
    }

    private syncArrowsWithHero(): void {
        const heroArrows = this.hero.getProjectiles();
        this.Arrows = heroArrows.filter(arrow => arrow.isActive);
    }

    shoot(): void {
        this.hero.shoot();
    }

    private checkArrowCollisions(): void {
        this.Arrows.forEach(arrow => {
            if (!arrow.isActive) return;

            const arrowPos = arrow.getPosition();
            const wallCollision = this.Walls.find(wall =>
                this.check_rect_collision(arrowPos, wall)
            );

            if (wallCollision) {
                arrow.isActive = false;
            }
        });
    }

    addBowToInventory(): void {
        this.hero.addToInventory("Bow");
        this.hero.addToInventory("Arrows");
    }

    getHero(): Hero {
        return this.hero;
    }

    getMap(): Map {
        return this.gameMap;
    }

    getArrows(): Projectile[] {
        return [...this.Arrows];
    }
    */
}

export default Game;