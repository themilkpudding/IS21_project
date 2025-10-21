import { TRect } from "../../config";
import CharacterClass, { KNIGHT } from "./CharacterClass";
import Unit from "./Unit";

class Hero extends Unit {
    private characterClass: CharacterClass = KNIGHT;
    private equipment: string[] = [];
    private inventory: string[] = [...KNIGHT.inventory];

    constructor() {
        super();
        this.rect.x = 100;
        this.rect.y = 100;
        this.speed = 20;
        this.rect.width = 100;
        this.rect.height = 100
    };

    getCharacterClass(): CharacterClass {
        return this.characterClass;
    }

    getEquipment(): string[] {
        return [...this.equipment];
    }

    getInventory(): string[] {
        return [...this.inventory];
    }

    getAttackPosition(): TRect {
        const swordOffset = 100;
        const swordSize = 100;

        const x = this.direction === 'right'
            ? this.rect.x + swordOffset
            : this.rect.x - swordOffset;

        return {
            x,
            y: this.rect.y,
            width: swordSize,
            height: swordSize
        };
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