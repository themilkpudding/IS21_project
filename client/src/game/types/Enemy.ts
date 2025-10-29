import { TRect, EDIRECTION } from "../../config";
import Unit from "./Unit";

class Enemy extends Unit {
    private detectionRange: number;

    constructor() {
        super();
        this.rect.x = 500;
        this.rect.y = 200;
        this.speed = 5;
        this.rect.width = 80;
        this.rect.height = 80;
        this.health = 100;
        this.damage = 20;
        this.detectionRange = 300;
        this.direction = EDIRECTION.RIGHT;
    }

    update(targetHero: Unit, walls: TRect[]): void {
        this.moveTowardsTarget(targetHero, walls);
        //attack()
    }

    private moveTowardsTarget(targetHero: Unit, walls: TRect[]): void {
        const dx = targetHero.rect.x - this.rect.x;
        const dy = targetHero.rect.y - this.rect.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Если цель слишком далеко, не двигаться
        if (distance > this.detectionRange) {
            this.movement.dx = 0;
            this.movement.dy = 0;
            return;
        }

        // Нормализуем направление
        const normalizedDx = dx / distance;
        const normalizedDy = dy / distance;

        // Рассчитываем новую позицию
        const newX = this.rect.x + normalizedDx * this.speed;
        const newY = this.rect.y + normalizedDy * this.speed;

        // Проверяем возможность движения
        if (this.canMove({ x: newX, y: newY, width: this.rect.width, height: this.rect.height }, walls)) {
            this.move(normalizedDx * this.speed, normalizedDy * this.speed)

            // Обновляем направление
            if (normalizedDx !== 0) {
                this.direction = normalizedDx > 0 ? EDIRECTION.RIGHT : EDIRECTION.LEFT;
            }
        }

        this.movement.dx = normalizedDx;
        this.movement.dy = normalizedDy;
    }

    private canMove(newRect: TRect, walls: TRect[]): boolean {
        return !walls.some(wall => this.checkRectCollision(newRect, wall));
    }

    getAttackPosition(): TRect {
        const swordOffset = 80;
        const swordSize = 80;

        const x = this.direction === EDIRECTION.RIGHT
            ? this.rect.x + swordOffset
            : this.rect.x - swordOffset;

        return {
            x,
            y: this.rect.y,
            width: swordSize,
            height: swordSize
        };
    }

    isAlive(): boolean {
        return this.health > 0;
    }
}

export default Enemy;