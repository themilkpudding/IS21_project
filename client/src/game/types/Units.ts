import { EDIRECTION } from "../../config";



export type Direction = EDIRECTION.LEFT | EDIRECTION.RIGHT;

class Unit {
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private direction: Direction = EDIRECTION.RIGHT;
    public name: string;
    public health: number;
    public damage: number;
    public speed: number;

    constructor() {

    }

    get() {
        return {

        }
    }

    move(dx: number, dy: number): void {
        this.x += dx;
        this.y += dy;
        this.direction = dx >= 0 ? EDIRECTION.RIGHT : EDIRECTION.LEFT;
    }

    setDirection(direction: Direction): void {
        this.direction = direction;
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
}

export default Unit;