import CONFIG, { TRect, EDIRECTION } from "../config";
import Map from "./types/Map";
import Hero from "./types/Hero";
import Server from "../services/server/Server";
import Projectile from "./types/Projectile";
import Unit from "./types/Unit";
import Enemy from "./types/Enemy";

class Game {
    private server: Server;
    private Heroes: Hero[];
    private Walls: TRect[];
    private Swords: TRect[];
    private gameMap: Map;
    private Arrows: Projectile[];
    private Bots: Unit[];
    private Enemies: Enemy[];
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
        this.Enemies = [new Enemy()];
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
            Enemies: this.Enemies.map(enemy => enemy),
        };
    }

    addArrow(heroIndex: number = 0): void {
        if (heroIndex >= this.Heroes.length) return;

        const hero = this.Heroes[heroIndex];
        const arrow = new Projectile(hero.direction, hero.direction == "right" ? hero.rect.x + hero.rect.width + 1 : hero.rect.x - 31, hero.rect.y + (hero.rect.height / 2));
        this.Arrows.push(arrow);
    }

    // Новый метод для обновления сцены с учетом состояния атаки
    updateSceneWithAttack(isAttacking: boolean): void {
        this.updateScene(isAttacking);
    }

    private userIsOwner() {
    }

    private startUpdateScene() {
        if (this.interval) {
            this.stopUpdateScene();
        }
        this.interval = setInterval(
            () => this.updateScene(false),
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

        if (this.Walls.find(wall => hero.checkRectCollision(newRect, wall))) {
            return false;
        }

        return true;
    }

    private checkSwordCollisions(isAttacking: boolean): void {
        // Если не атакуем, не проверяем столкновения с мечом
        if (!isAttacking) return;

        this.Heroes.forEach(hero => {
            const swordRect = hero.getAttackPosition();

            this.Enemies.forEach(enemy => {
                if (this.Heroes[0].checkRectCollision(swordRect, enemy.rect)) {
                    enemy.health -= hero.damage;
                }
            });
        });
    }

    private checkArrowCollisions(): void {
        this.Arrows = this.Arrows.filter(arrow => {
            // Проверка столкновений со стенами
            const hitWall = this.Walls.find(wall => {
                return this.Heroes.length > 0 ?
                    this.Heroes[0].checkRectCollision(arrow.rect, wall) : false;
            });

            // Проверка столкновений с врагами
            const hitEnemy = this.Enemies.find(enemy => {
                const hit = this.Heroes.length > 0 ?
                    this.Heroes[0].checkRectCollision(arrow.rect, enemy.rect) : false;

                if (hit) {
                    // Наносим урон врагу
                    enemy.health -= arrow.damage;
                }

                return hit;
            });

            return !hitWall && !hitEnemy;
        });
    }

    private updateEnemies(): void {

        this.Enemies.forEach(enemy => {
            if (enemy.isAlive()) {
                enemy.update(this.Heroes[0], this.Walls);
            }
        });

        // Удаляем мертвых врагов
        this.Enemies = this.Enemies.filter(enemy => enemy.isAlive());
    }

    private updateScene(isAttacking: boolean) {
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

        // Обновляем врагов
        this.updateEnemies();

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

        // Передаем состояние атаки в проверку столкновений меча
        this.checkSwordCollisions(isAttacking);

        if (isUpdated) {
            // Логика отправки на сервер
        }
    }
}

export default Game;