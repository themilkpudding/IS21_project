import { EDIRECTION, TRect } from "../../config";

class Unit {
    public rect: TRect;
    public direction: EDIRECTION;
    public name: string;
    public health: number;
    public damage: number;
    public speed: number;

    constructor() {
        this.rect = { x: 0, y: 0, width: 0, height: 0 };
        this.direction = EDIRECTION.RIGHT;
        this.name = "";
        this.health = 0;
        this.damage = 0;
        this.speed = 0;
    }

    get() {
        return {
            rect: this.rect,
            direction: this.direction,
            name: this.name,
            health: this.health,
            damage: this.damage,
            speed: this.speed
        };
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

export default Unit;