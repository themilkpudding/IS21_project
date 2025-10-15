import CONFIG, { FPoint } from "../config";
import { Map } from "./map";
import Hero, { KNIGHT } from "./hero";
import { Projectile } from "./hero";
import Enemy from "./enemy";

class Game {
    private hero: Hero;
    private Walls: FPoint[];
    private Sword: FPoint;
    private gameMap: Map;
    private Arrows: Projectile[];
    private Enemies: Enemy[]; // Добавляем массив врагов

    constructor() {
        this.hero = new Hero(650, 400, KNIGHT);
        this.gameMap = new Map();
        this.Walls = this.gameMap.getWalls();
        this.Sword = this.hero.getAttackPosition();
        this.Arrows = [];
        this.Enemies = [];
        this.initializeEnemies();
    }

    private initializeEnemies(): void {
        this.Enemies.push(new Enemy(300, 300));
    }

    destructor() {
        this.Arrows = [];
        this.Enemies = [];
    }

    getScene() {
        return {
            Hero: this.hero.getPosition(),
            Walls: this.Walls,
            Sword: this.Sword,
            Arrows: this.Arrows.map(arrow => arrow.getPosition()),
            Enemies: this.Enemies.map(enemy => ({
                position: enemy.getPosition(),
                direction: enemy.getDirection()
            }))
        };
    }

    check_collision(heroX: number, heroY: number, wall: FPoint): boolean {
        const heroPos = this.hero.getPosition();
        return ((heroX + heroPos.width) > wall.x) &&
            (heroX < (wall.x + wall.width)) &&
            ((heroY + heroPos.height) > wall.y) &&
            (heroY < (wall.y + wall.height));
    }

    check_rect_collision(rect1: FPoint, rect2: FPoint): boolean {
        return (rect1.x + rect1.width > rect2.x) &&
            (rect1.x < rect2.x + rect2.width) &&
            (rect1.y + rect1.height > rect2.y) &&
            (rect1.y < rect2.y + rect2.height);
    }

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
        this.updateEnemies();
    }

    private updateEnemies(): void {
        this.Enemies.forEach(enemy => {
            const currentPos = enemy.getPosition();
            // Если враг достиг границы, меняем направление
            if (currentPos.x > 900) {
                enemy.setDirection('left');
            } else if (currentPos.x < 200) {
                enemy.setDirection('right');
            }

            const speed = 2;
            const dx = enemy.getDirection() === 'right' ? speed : -speed;
            enemy.move(dx, 0);
        });
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

    getEnemies(): Enemy[] {
        return [...this.Enemies];
    }

}

export default Game;