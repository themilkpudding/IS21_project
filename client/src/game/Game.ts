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
    private Enemies: Enemy[];
    private swordActive: boolean = false;
    private swordTimer: NodeJS.Timeout | null = null;
    private damagedEnemies: Set<Enemy> = new Set();

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
        this.Enemies.push(new Enemy(500, 200, 100));
    }

    destructor() {
        this.Arrows = [];
        this.Enemies = [];
        if (this.swordTimer) {
            clearTimeout(this.swordTimer);
        }
        this.damagedEnemies.clear();
    }

    getScene() {
        return {
            Hero: this.hero.getPosition(),
            Walls: this.Walls,
            Sword: this.Sword,
            Arrows: this.Arrows.map(arrow => arrow.getPosition()),
            Enemies: this.Enemies.map(enemy => ({
                position: enemy.getPosition(),
                direction: enemy.getDirection(),
                health: enemy.getHealth(),
                maxHealth: enemy.getMaxHealth(),
                isAlive: enemy.isAlive()
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

        const tempHeroPos: FPoint = {
            x: currentPos.x,
            y: currentPos.y,
            width: currentPos.width,
            height: currentPos.height
        };

        if (dx !== 0) {
            newX = currentPos.x + dx;
            tempHeroPos.x = newX;

            const collidingWall = this.Walls.find(wall =>
                this.check_rect_collision(tempHeroPos, wall)
            );

            const collidingEnemy = this.Enemies.find(enemy =>
                enemy.isAlive() && this.check_rect_collision(tempHeroPos, enemy.getPosition())
            );

            if (!collidingWall && !collidingEnemy) {
                this.hero.move(dx, 0);
            } else {
                tempHeroPos.x = currentPos.x;
            }
        }

        if (dy !== 0) {
            newY = currentPos.y + dy;
            tempHeroPos.y = newY;

            const collidingWall = this.Walls.find(wall =>
                this.check_rect_collision(tempHeroPos, wall)
            );

            const collidingEnemy = this.Enemies.find(enemy =>
                enemy.isAlive() && this.check_rect_collision(tempHeroPos, enemy.getPosition())
            );

            if (!collidingWall && !collidingEnemy) {
                this.hero.move(0, dy);
            }
        }

        this.Sword = this.hero.getAttackPosition();
    }

    update(): void {
        this.hero.updateProjectiles();
        this.syncArrowsWithHero();
        this.checkArrowCollisions();
        this.checkSwordCollisions();
        this.updateEnemies();
        this.removeDeadEnemies();
    }

    private updateEnemies(): void {
        const heroPos = this.hero.getPosition();

        this.Enemies.forEach((enemy, index) => {
            if (!enemy.isAlive()) return;

            const enemyPos = enemy.getPosition();

            const dx = heroPos.x - enemyPos.x;
            const dy = heroPos.y - enemyPos.y;

            const distance = Math.sqrt(dx * dx + dy * dy);
            const speed = 2;

            if (distance > 0) {
                const normalizedDx = (dx / distance) * speed;
                const normalizedDy = (dy / distance) * speed;

                const newX = enemyPos.x + normalizedDx;
                const newY = enemyPos.y + normalizedDy;

                const tempEnemyPos: FPoint = {
                    x: newX,
                    y: newY,
                    width: enemyPos.width,
                    height: enemyPos.height
                };

                const wallCollision = this.Walls.find(wall =>
                    this.check_rect_collision(tempEnemyPos, wall)
                );

                const heroCollision = this.check_rect_collision(tempEnemyPos, heroPos);

                const enemyCollision = this.Enemies.some((otherEnemy, otherIndex) => {
                    if (index === otherIndex || !otherEnemy.isAlive()) return false;
                    const otherPos = otherEnemy.getPosition();
                    return this.check_rect_collision(tempEnemyPos, otherPos);
                });

                if (!wallCollision && !enemyCollision) {
                    enemy.move(normalizedDx, normalizedDy);
                }

                if (heroCollision) {
                    enemy.move(-normalizedDx, -normalizedDy);
                }
            }
        });
    }

    private checkSwordCollisions(): void {
        if (!this.Sword || !this.swordActive) return;

        this.Enemies.forEach(enemy => {
            if (!enemy.isAlive()) return;

            if (this.damagedEnemies.has(enemy)) return;

            const enemyPos = enemy.getPosition();
            if (this.check_rect_collision(this.Sword, enemyPos)) {
                const damage = this.hero.getCharacterClass().damage;
                enemy.takeDamage(damage);
                this.damagedEnemies.add(enemy);
            }
        });
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
                return;
            }

            this.Enemies.forEach(enemy => {
                if (!enemy.isAlive()) return;

                const enemyPos = enemy.getPosition();
                if (this.check_rect_collision(arrowPos, enemyPos)) {
                    enemy.takeDamage(arrow.damage);
                    arrow.isActive = false;
                }
            });
        });
    }

    private removeDeadEnemies(): void {
        this.Enemies = this.Enemies.filter(enemy => enemy.isAlive());
    }

    private syncArrowsWithHero(): void {
        const heroArrows = this.hero.getProjectiles();
        this.Arrows = heroArrows.filter(arrow => arrow.isActive);
    }

    activateSword(): void {
        this.swordActive = true;
        this.damagedEnemies.clear();

        if (this.swordTimer) {
            clearTimeout(this.swordTimer);
        }

        this.swordTimer = setTimeout(() => {
            this.swordActive = false;
            this.damagedEnemies.clear();
        }, 500);
    }

    shoot(): void {
        this.hero.shoot();
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

    isSwordActive(): boolean {
        return this.swordActive;
    }
}

export default Game;