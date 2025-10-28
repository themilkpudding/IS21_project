import Movement from "./Movement";
import { EDIRECTION, TRect } from "../../config";

export class Projectile extends Movement {
    public damage: number;
    constructor(direction = EDIRECTION.RIGHT, x = 0, y = 0) {
        super();
        this.direction = direction;
        this.rect.x = x;
        this.rect.y = y;
        this.rect.width = 30;
        this.rect.height = 10;
        this.damage = 10;
        this.speed = 5;
    }
}

export default Projectile;