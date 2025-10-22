import { EDIRECTION, TRect } from "../../config";

class Unit {
    public rect: TRect;
    public direction: EDIRECTION;
    public name: string;
    public health: number;
    public damage: number;
    public speed: number;

    constructor(rect = { x: 0, y: 0, width: 0, height: 0 }, direction = EDIRECTION.RIGHT, name = "", health = 0, damage = 0, speed = 0) {
        this.rect = rect;
        this.direction = direction;
        this.name = name;
        this.health = health;
        this.damage = damage;
        this.speed = speed;
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