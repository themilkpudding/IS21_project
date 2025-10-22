import { TRect } from "../../config";

class Map {
    walls: TRect[];

    constructor() {
        this.walls = [
            { x: 0, y: 0, width: 10, height: 800 },
            { x: 0, y: 0, width: 1300, height: 10 },
            { x: 1290, y: 0, width: 10, height: 800 },
            { x: 0, y: 790, width: 1300, height: 10 },
        ];
    }
}
export default Map;