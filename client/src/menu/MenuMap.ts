import Map from "../game/types/Map";

class MenuMap extends Map {
    constructor() {
        super();
        
        this.walls = [
            { x: 0, y: 0, width: 1920, height: 685 },
            { x: 62, y: 685, width: 426, height: 359 },
            { x: 1245, y: 685, width: 141, height: 266 },
            { x: 1356, y: 673, width: 564, height: 193 },
            { x: 0, y: 0, width: 0, height: 1080 },
            { x: 0, y: 1080, width: 1920, height: 0 },
            { x: 1920, y: 0, width: 0, height: 1080 },
        ];
    }
}

export default MenuMap;