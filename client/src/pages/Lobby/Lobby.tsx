import React from 'react';
import { IBasePage, PAGES } from '../PageManager';
import Button from '../../components/Button/Button';

const Lobby: React.FC<IBasePage> = (props: IBasePage) => {
const { setPage } = props;
    const classShopClickHandler = () => {
        setPage(PAGES.CLASS_SHOP);
    };

    const startingGameMenuClickHandler = () => {
        setPage(PAGES.STARTING_GAME_MENU);
    };

    return (<>
        <div>Лобби</div>
        <Button onClick={classShopClickHandler} text='Магазин классов' />
        <Button onClick={startingGameMenuClickHandler} text='Начать игру' />
    </>)
}

export default Lobby;