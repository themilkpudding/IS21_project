import React from 'react';
import { IBasePage, PAGES } from '../PageManager';
import Button from '../../components/Button/Button';

const Menu: React.FC<IBasePage> = (props: IBasePage) => {
const { setPage } = props;
    const classShopClickHandler = () => {
        setPage(PAGES.CLASS_SHOP);
    };

    const startingGameMenuClickHandler = () => {
        setPage(PAGES.STARTING_GAME_MENU);
    };

    return (<>
        <div>Меню</div>
        <Button onClick={classShopClickHandler} text='Назад' />
        <Button onClick={startingGameMenuClickHandler} text='Начать игру' />
    </>)
}

export default Menu;