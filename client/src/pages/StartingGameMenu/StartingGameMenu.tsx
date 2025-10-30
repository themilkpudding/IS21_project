import React from 'react';
import { IBasePage, PAGES } from '../PageManager';

const StartingGameMenu: React.FC<IBasePage> = (props: IBasePage) => {
    const { setPage } = props;
    return (<>
        <div>Меню начала игры</div>
        <button onClick={() => setPage(PAGES.GAME)}>Игра</button>
        <button onClick={() => setPage(PAGES.MENU)}>Назад</button>
    </>)
}

export default StartingGameMenu;