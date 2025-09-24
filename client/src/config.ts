export type TPoint = {
    x: number;
    y: number;
}

export type FPoint = {
    x: number;
    y: number;
    width: number;
    height: number;
}

export enum EDIRECTION {
    LEFT = 'left',
    RIGHT = 'right',
    UP = 'up',
    DOWN = 'down',
};

export type TWINDOW = {
    LEFT: number;
    TOP: number;
    HEIGHT: number;
    WIDTH: number;
}

const CONFIG = {
    HOST: 'http://knightwars.local/api',

    CHAT_TIMESTAMP: 200, //ms

    SPRITE_SIZE: 64, // размер спрайта в пикселях
    LINE_OF_SPRITES: 10, // количество спрайтов в карте спрайтов
    WIDTH: 50, // ширина карты
    HEIGHT: 32, // высота карты 
    // игровое окно, видимое пользователю
    WINDOW: {
        LEFT: 0,
        TOP: 0,
        HEIGHT: 800,
        WIDTH: 1300,
    },
};

export default CONFIG;