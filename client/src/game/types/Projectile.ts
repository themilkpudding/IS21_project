import Unit from "./Unit";

export class Projectile extends Unit {
    constructor() {
        super();
        this.rect.width = 30;
        this.rect.height = 10;
        this.damage = 10;
        this.speed = 5;
    }
}

export default Projectile;