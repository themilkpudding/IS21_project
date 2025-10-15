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

        // Создаем временную позицию для проверки коллизий
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

            const collidingEnemy = this.Enemies.find(enemy => {
                const enemyPos = enemy.getPosition();
                return this.check_rect_collision(tempHeroPos, enemyPos);
            });

            if (!collidingWall && !collidingEnemy) {
                this.hero.move(dx, 0);
            } else {
                // Если есть коллизия, сбрасываем X координату для проверки Y
                tempHeroPos.x = currentPos.x;
            }
        }

        if (dy !== 0) {
            newY = currentPos.y + dy;
            tempHeroPos.y = newY;

            const collidingWall = this.Walls.find(wall =>
                this.check_rect_collision(tempHeroPos, wall)
            );

            const collidingEnemy = this.Enemies.find(enemy => {
                const enemyPos = enemy.getPosition();
                return this.check_rect_collision(tempHeroPos, enemyPos);
            });

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
        this.updateEnemies();
    }

    private updateEnemies(): void {
        const heroPos = this.hero.getPosition();

        this.Enemies.forEach((enemy, index) => {
            const enemyPos = enemy.getPosition();

            // Преследование героя
            const dx = heroPos.x - enemyPos.x;
            const dy = heroPos.y - enemyPos.y;

            // Нормализация направления
            const distance = Math.sqrt(dx * dx + dy * dy);
            const speed = 2;

            if (distance > 0) {
                const normalizedDx = (dx / distance) * speed;
                const normalizedDy = (dy / distance) * speed;

                // Проверка коллизии перед движением
                const newX = enemyPos.x + normalizedDx;
                const newY = enemyPos.y + normalizedDy;

                // Создаем временный прямоугольник для проверки коллизии
                const tempEnemyPos: FPoint = {
                    x: newX,
                    y: newY,
                    width: enemyPos.width,
                    height: enemyPos.height
                };

                // Проверяем коллизию со стенами
                const wallCollision = this.Walls.find(wall =>
                    this.check_rect_collision(tempEnemyPos, wall)
                );

                // Проверяем коллизию с героем
                const heroCollision = this.check_rect_collision(tempEnemyPos, heroPos);

                // Проверяем коллизию с другими врагами
                const enemyCollision = this.Enemies.some((otherEnemy, otherIndex) => {
                    if (index === otherIndex) return false;
                    const otherPos = otherEnemy.getPosition();
                    return this.check_rect_collision(tempEnemyPos, otherPos);
                });

                // Двигаем врага только если нет коллизий
                if (!wallCollision && !enemyCollision) {
                    enemy.move(normalizedDx, normalizedDy);
                }

                // Обработка столкновения с героем
                if (heroCollision) {
                    // Здесь можно добавить логику урона герою
                    console.log("Враг столкнулся с героем!");
                    // Можно оттолкнуть врага немного назад
                    enemy.move(-normalizedDx * 2, -normalizedDy * 2);
                }
            }
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