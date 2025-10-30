import Game from '../game/Game';
import Server from '../services/server/Server';
import MenuMap from './MenuMap';

class MenuGame extends Game {
    constructor(server: Server) {
        super(server);

        const menuMap = new MenuMap();
        // @ts-ignore
        this.Walls = menuMap.walls;
        // @ts-ignore
        this.gameMap.walls = menuMap.walls;
    }
}
export default MenuGame;