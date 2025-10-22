import { EDIRECTION, TRect } from "../../config";

class Unit {
    public rect: TRect = { x: 0, y: 0, width: 0, height: 0 };
    public direction: EDIRECTION = EDIRECTION.RIGHT;
    public name: string = "";
    public health: number = 0;
    public damage: number = 0;
    public speed: number = 0;

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