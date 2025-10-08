import { FPoint } from "../config";

// Базовый класс персонажа
class CharacterClass {
    name: string;
    health: number;
    damage: number;
    speed: number;
    inventory: string[];

    constructor(name: string, health: number, damage: number, speed: number, inventory: string[]) {
        this.name = name;
        this.health = health;
        this.damage = damage;
        this.speed = speed;
        this.inventory = inventory;
    }
}

// Классы персонажей
export const KNIGHT = new CharacterClass(
    "KNIGHT",
    100,
    15,
    5,
    ["Iron Sword", "Wooden Shield", "Leather Armor"]
);

export type Direction = 'left' | 'right';

class Hero {
    private position: FPoint;
    private direction: Direction;
    private characterClass: CharacterClass;
    private equipment: string[];
    private inventory: string[];

    constructor(x: number, y: number, characterClass: CharacterClass = KNIGHT) {
        this.position = {
            x,
            y,
            width: 100,
            height: 100
        };
        this.direction = 'right';
        this.characterClass = characterClass;
        this.equipment = [];
        this.inventory = [...characterClass.inventory];
    }

    // Геты для позиции и характеристик
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

    // Методы для движения и изменения направления
    move(dx: number, dy: number): void {
        this.position.x += dx;
        this.position.y += dy;

        // Обновляем направление в зависимости от движения
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

    // Метод для получения позиции меча в зависимости от направления
    getAttackPosition(): FPoint {
        const swordOffset = 100;
        const swordSize = 100;

        if (this.direction === 'right') {
            return {
                x: this.position.x + swordOffset,
                y: this.position.y,
                width: swordSize,
                height: swordSize
            };
        } else { // left
            return {
                x: this.position.x - swordOffset,
                y: this.position.y,
                width: swordSize,
                height: swordSize
            };
        }
    }

    // Методы для управления инвентарем и экипировкой
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
        // Будущая логика экипировки предмета
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