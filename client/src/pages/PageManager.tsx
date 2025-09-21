import React, { useState } from 'react';

import Login from './Login/Login';
import GamePage from './Game/Game';
import NotFound from './NotFound/NotFound';
import Menu from './Menu/Menu';
import Registration from './Registration/Registration';
import PasswordRecovery from './PasswordRecovery/PasswordRecovery';
import ClassShop from './ClassShop/ClassShop';
import StartingGameMenu from './StartingGameMenu/StartingGameMenu';
import Lobby from './Lobby/Lobby';


export enum PAGES {
    LOGIN,
    GAME,
    NOT_FOUND,
    MENU,
    PASSWORD_RECOVERY,
    REGISTRATION,
    CLASS_SHOP,
    STARTING_GAME_MENU,
    LOBBY
}

export interface IBasePage {
    setPage: (name: PAGES) => void
}

const PageManager: React.FC = () => {
    const [page, setPage] = useState<PAGES>(PAGES.LOGIN);

    return (
        <>
            {page === PAGES.LOGIN && <Login setPage={setPage} />}
            {page === PAGES.GAME && <GamePage setPage={setPage} />}
            {page === PAGES.NOT_FOUND && <NotFound setPage={setPage} />}
            {page === PAGES.MENU && <Menu setPage={setPage} />}
            {page === PAGES.PASSWORD_RECOVERY && <PasswordRecovery setPage={setPage} />}
            {page === PAGES.REGISTRATION && <Registration setPage={setPage} />}
            {page === PAGES.CLASS_SHOP && <ClassShop setPage={setPage} />}
            {page === PAGES.STARTING_GAME_MENU && <StartingGameMenu setPage={setPage} />}
            {page === PAGES.LOBBY && <Lobby setPage={setPage} />}
        </>
    );
}

export default PageManager;