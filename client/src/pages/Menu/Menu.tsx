import React, { useContext } from 'react';
import { IBasePage, PAGES } from '../PageManager';
import Button from '../../components/Button/Button';
import { ServerContext } from '../../App';

const Menu: React.FC<IBasePage> = (props: IBasePage) => {
    const { setPage } = props;
    const server = useContext(ServerContext);

    const classShopClickHandler = () => {
        setPage(PAGES.CLASS_SHOP);
    };

    const startingGameMenuClickHandler = () => {
        setPage(PAGES.STARTING_GAME_MENU);
    };

    const exitAccountClickHandler = async () => {
        await server.logout();
        setPage(PAGES.LOGIN);
    };

    return (<>
        <div>Меню</div>
        <Button onClick={classShopClickHandler} text='Назад' />
        <Button onClick={startingGameMenuClickHandler} text='Начать игру' />
        <Button onClick={exitAccountClickHandler} text='Выйти из аккаунта' />
        <button onClick={() => setPage(PAGES.GAME)}>Временная кнопка для открытия самой игры</button>
    </>)
}

export default Menu;