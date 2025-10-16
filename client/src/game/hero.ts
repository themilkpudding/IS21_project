import { FPoint } from "../config";

class CharacterClass {
    constructor(
        public name: string,
        public health: number,
        public damage: number,
        public speed: number,
        public inventory: string[]
    ) { }
}

export const KNIGHT = new CharacterClass(
    "KNIGHT",
    100,
    20,
    5,
    ["Iron Sword", "Wooden Shield", "Leather Armor"]
);

export type Direction = 'left' | 'right';

export class Projectile {
    position: FPoint;
    isActive: boolean = true;

    constructor(
        x: number,
        y: number,
        public direction: Direction,
        public speed: number,
        public damage: number
    ) {
        this.position = {
            x,
            y,
            width: 30,
            height: 10
        };
    }

    update(): void {
        if (!this.isActive) return;

        if (this.direction === 'right') {
            this.position.x += this.speed;
        } else {
            this.position.x -= this.speed;
        }
    }

    getPosition(): FPoint {
        return { ...this.position };
    }
}

class Hero {
    private position: FPoint;
    private direction: Direction = 'right';
    private projectiles: Projectile[] = [];
    private lastShotTime: number = 0;
    private readonly shotCooldown: number = 500;

    constructor(
        x: number,
        y: number,
        private characterClass: CharacterClass = KNIGHT,
        private equipment: string[] = [],
        private inventory: string[] = [...KNIGHT.inventory]
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

    getCharacterClass(): CharacterClass {
        return this.characterClass;
    }

    getEquipment(): string[] {
        return [...this.equipment];
    }

    getInventory(): string[] {
        return [...this.inventory];
    }

    getProjectiles(): Projectile[] {
        return this.projectiles.filter(projectile => projectile.isActive);
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

    shoot(): boolean {
        const currentTime = Date.now();

        if (currentTime - this.lastShotTime < this.shotCooldown) {
            return false;
        }

        const hasBow = [...this.inventory, ...this.equipment]
            .some(item => item.toLowerCase().includes('bow'));

        if (!hasBow) {
            return false;
        }

        const arrowX = this.direction === 'right'
            ? this.position.x + this.position.width
            : this.position.x - 30;

        const arrowY = this.position.y + this.position.height / 2 - 5;

        const arrow = new Projectile(
            arrowX,
            arrowY,
            this.direction,
            10,
            this.characterClass.damage
        );

        this.projectiles.push(arrow);
        this.lastShotTime = currentTime;

        return true;
    }

    updateProjectiles(): void {
        this.projectiles.forEach(projectile => projectile.update());

        this.projectiles = this.projectiles.filter(projectile => projectile.isActive);
    }

    deactivateProjectile(projectile: Projectile): void {
        projectile.isActive = false;
    }

    addToInventory(item: string): void {
        this.inventory.push(item);
    }

    removeFromInventory(item: string): void {
        const index = this.inventory.indexOf(item);
        if (index > -1) {
            this.inventory.splice(index, 1);
        }
    }

    equipItem(item: string): void {
        this.equipment.push(item);
    }

    unequipItem(item: string): void {
        const index = this.equipment.indexOf(item);
        if (index > -1) {
            this.equipment.splice(index, 1);
        }
    }
}

export default Hero;