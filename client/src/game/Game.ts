import CONFIG, { TRect, EDIRECTION } from "../config";
import Map from "./types/Map";
import Hero from "./types/Hero";
import Server from "../services/server/Server";
import Projectile from "./types/Projectile";
import Unit from "./types/Unit";

class Game {
    private server: Server;
    private hero: Hero;
    private Walls: TRect[];
    private Sword: TRect;
    private gameMap: Map;
    private Arrows: Projectile[];
    private Bots: Unit[];
    private interval: NodeJS.Timer | null = null;
    private movement: { dx: number; dy: number } = { dx: 0, dy: 0 };
    private lastUpdateTime: number = 0;

    constructor(server: Server) {
        this.server = server;
        this.hero = new Hero();
        this.gameMap = new Map();
        this.Walls = this.gameMap.getWalls();
        this.Sword = this.hero.getAttackPosition();
        this.Arrows = [];
        this.Bots = [];
        this.lastUpdateTime = Date.now();

        //this.server.startGetScene(() => this.getSceneFromBackend());
        this.startUpdateScene();
    }

    destructor() {
        this.stopUpdateScene();
        //this.server.stopGetScene();
    }

    getScene() {
        return {
            Hero: this.hero,
            Walls: this.Walls,
            Sword: this.Sword,
            Arrows: this.Arrows.map(arrow => arrow),
            Bots: this.Bots.map(bot => bot),
        };
    }

    setMovement(dx: number, dy: number): void {
        this.movement = { dx, dy };
    }

    private userIsOwner() {
    }

    private startUpdateScene() {
        if (this.interval) {
            this.stopUpdateScene();
        }
        this.interval = setInterval(
            () => this.updateScene(),
            CONFIG.GAME_UPDATE_TIMESTAMP
        );
    }

    private stopUpdateScene() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    // 100 ms
    private getSceneFromBackend() {
        // если пришёл ответ
        // распарсить его
        // принудительно применить к сцене игры
    }

    private updateScene() {
        const currentTime = Date.now();
        this.lastUpdateTime = currentTime;

        let isUpdated = false;

        // Применяем движение
        if (this.movement.dx || this.movement.dy) {
            isUpdated = true;
            this.hero.move(this.movement.dx * this.hero.speed, this.movement.dy * this.hero.speed)
        }

        // Передвинуть ботов
        // Передвинуть стрелы
        // Обновляем позицию меча после всех перемещений
        this.Sword = this.hero.getAttackPosition();

        if (isUpdated) {
            // Логика отправки на сервер
        }
    }

}

export default Game;