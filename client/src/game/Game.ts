import CONFIG, { FPoint } from "../config";
import { Map } from "./map";
import Hero, { KNIGHT } from "./hero";

const { WIDTH, HEIGHT } = CONFIG;

class Game {
    private hero: Hero;
    private Walls: FPoint[];
    private Sword: FPoint;
    private gameMap: Map;

    constructor() {
        this.hero = new Hero(650, 400, KNIGHT);
        this.gameMap = new Map();
        this.Walls = this.gameMap.getWalls();
        this.Sword = this.hero.getAttackPosition();
    }

    destructor() {
        //...
    }

    getScene() {
        return {
            Hero: this.hero.getPosition(),
            Walls: this.Walls,
            Sword: this.Sword
        };
    }

    check_collision(heroX: number, heroY: number, wall: FPoint): boolean {
        const heroPos = this.hero.getPosition();
        return ((heroX + heroPos.width) > wall.x) &&
            (heroX < (wall.x + wall.width)) &&
            ((heroY + heroPos.height) > wall.y) &&
            (heroY < (wall.y + wall.height));
    }

    move(dx: number, dy: number): void {
        const currentPos = this.hero.getPosition();
        let newX = currentPos.x;
        let newY = currentPos.y;

        // Для движения по X
        if (dx !== 0) {
            newX = currentPos.x + dx;

            const collidingWall = this.Walls.find(wall =>
                this.check_collision(newX, currentPos.y, wall)
            );

            if (!collidingWall) {
                this.hero.move(dx, 0);
            }
        }

        // Для движения по Y
        if (dy !== 0) {
            newY = currentPos.y + dy;

            const collidingWall = this.Walls.find(wall =>
                this.check_collision(currentPos.x, newY, wall)
            );

            if (!collidingWall) {
                this.hero.move(0, dy);
            }
        }

        // Обновляем позицию меча после движения
        this.Sword = this.hero.getAttackPosition();
    }

    // Метод для доступа к герою извне
    getHero(): Hero {
        return this.hero;
    }

    // Метод для доступа к карте извне
    getMap(): Map {
        return this.gameMap;
    }
}

export default Game;