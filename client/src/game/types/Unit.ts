import Movement from "./Movement";

class Unit extends Movement {
    public name: string;
    public health: number;
    public damage: number;

    constructor(name = "", health = 0, damage = 0) {
        super()
        this.name = name;
        this.health = health;
        this.damage = damage;
    }

    getUnit() {
        return {
            name: this.name,
            health: this.health,
            damage: this.damage,
        };
    }
}

export default Unit;