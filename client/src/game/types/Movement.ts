import { EDIRECTION, TRect } from "../../config";

class Movement {
    public rect: TRect;
    public direction: EDIRECTION;
    public speed: number;
    public movement: { dx: number, dy: number };

    constructor(rect = { x: 0, y: 0, width: 0, height: 0 }, direction = EDIRECTION.RIGHT, speed = 0) {
        this.rect = rect;
        this.direction = direction;
        this.speed = speed;
        this.movement = { dx: 0, dy: 0 }
    }

    getMovement() {
        return {
            rect: this.rect,
            direction: this.direction,
            speed: this.speed
        };
    }

    setMovement(dx: number, dy: number): void {
        this.movement = { dx, dy };
    }

    move(dx: number, dy: number): void {
        this.rect.x += dx;
        this.rect.y += dy;
        if (dx) {
            this.direction = dx > 0 ? EDIRECTION.RIGHT : EDIRECTION.LEFT;
        }
    }

    checkRectCollision(rect1: TRect, rect2: TRect): boolean {
        return (rect1.x + rect1.width > rect2.x) &&
            (rect1.x < rect2.x + rect2.width) &&
            (rect1.y + rect1.height > rect2.y) &&
            (rect1.y < rect2.y + rect2.height);
    }
}

export default Movement;