import CONFIG, { TPoint, FPoint } from "../config";
const { WIDTH, HEIGHT } = CONFIG;

class Game {
    private Hero: FPoint;
    private Walls: FPoint[];
    private Sword: FPoint;

    constructor() {
        this.Hero = { x: 650, y: 400, width: 100, height: 100 };
        this.Walls = [
            { x: 0, y: 0, width: 10, height: 800 },
            { x: 0, y: 0, width: 1300, height: 10 },
            { x: 1290, y: 0, width: 10, height: 800 },
            { x: 0, y: 790, width: 1300, height: 10 },
        ];
        this.Sword = { x: 650, y: 400, width: 100, height: 100 }
    }

    destructor() {
        //...
    }

    getScene() {
        return {
            Hero: this.Hero,
            Walls: this.Walls,
            Sword: this.Sword
        };
    }

    check_collision(heroX: number, heroY: number, wall: FPoint): boolean {
        return ((heroX + this.Hero.width) > wall.x) &&
            (heroX < (wall.x + wall.width)) &&
            ((heroY + this.Hero.height) > wall.y) &&
            (heroY < (wall.y + wall.height));
    }

    move(dx: number, dy: number): void {
        let newX = this.Hero.x;
        let newY = this.Hero.y;

        // Для движения по X
        if (dx !== 0) {
            if (dx > 0) {
                this.Sword.x = this.Hero.x + 100;
            }
            if (dx < 0) {
                this.Sword.x = this.Hero.x - 100;
            }
            newX = this.Hero.x + dx;

            const collidingWall = this.Walls.find(wall =>
                this.check_collision(newX, this.Hero.y, wall)
            );

            if (!collidingWall) {
                this.Hero.x = newX;
            }
        }

        // Для движения по Y
        if (dy !== 0) {
            this.Sword.y = this.Hero.y + dy;
            newY = this.Hero.y + dy;

            const collidingWall = this.Walls.find(wall =>
                this.check_collision(this.Hero.x, newY, wall)
            );

            if (!collidingWall) {
                this.Hero.y = newY;
            }
        }
    }
}


export default Game;