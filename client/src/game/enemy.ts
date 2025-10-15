import { FPoint } from "../config";

export type Direction = 'left' | 'right';

class Enemy {
    private position: FPoint;
    private direction: Direction = 'right';

    constructor(
        x: number,
        y: number,
    ) {
        this.position = {
            x,
            y,
            width: 100,
            height: 100
        };
    }

    getPosition(): FPoint {
        return { ...this.position };
    }

    getDirection(): Direction {
        return this.direction;
    }

    move(dx: number, dy: number): void {
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