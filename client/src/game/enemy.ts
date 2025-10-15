import { FPoint } from "../config";

export type Direction = 'left' | 'right';

class Enemy {
    private position: FPoint;
    private direction: Direction = 'right';
    private health: number;
    private maxHealth: number;
    private alive: boolean = true;

    constructor(
        x: number,
        y: number,
        health: number = 100
    ) {
        this.position = {
            x,
            y,
            width: 100,
            height: 100
        };
        this.health = health;
        this.maxHealth = health;
    }

    getPosition(): FPoint {
        return { ...this.position };
    }

    getDirection(): Direction {
        return this.direction;
    }

    getHealth(): number {
        return this.health;
    }

    getMaxHealth(): number {
        return this.maxHealth;
    }

    isAlive(): boolean {
        return this.alive;
    }

    takeDamage(damage: number): void {
        if (!this.alive) return;

        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.alive = false;
        }
    }

    move(dx: number, dy: number): void {
        if (!this.alive) return;

        this.position.x += dx;
        this.position.y += dy;

        if (dx > 0) this.direction = 'right';
        if (dx < 0) this.direction = 'left';
    }

    setDirection(direction: Direction): void {
        this.direction = direction;
    }

    setPosition(x: number, y: number): void {
        this.position.x = x;
        this.position.y = y;
    }

    getAttackPosition(): FPoint {
        const swordOffset = 100;
        const swordSize = 100;

        const x = this.direction === 'right'
            ? this.position.x + swordOffset
            : this.position.x - swordOffset;

        return {
            x,
            y: this.position.y,
            width: swordSize,
            height: swordSize
        };
    }
}

export default Enemy;