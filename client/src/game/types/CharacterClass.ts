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

export default CharacterClass;