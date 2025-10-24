import React, { useContext, useState } from 'react';
import { IBasePage, PAGES } from '../PageManager';
import Button from '../../components/Button/Button';
import { ServerContext } from '../../App';
import Chat from '../../components/Chat/Chat';

const Menu: React.FC<IBasePage> = (props: IBasePage) => {
    const { setPage } = props;
    const server = useContext(ServerContext);
    const [isChatOpen, setIsChatOpen] = useState(false);

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

    const deleteUserClickHandler = async () => {
        await server.deleteUser();
        setPage(PAGES.LOGIN);
    }

    return (<>
        <div>Меню</div>
        <Button onClick={classShopClickHandler} text='Назад' />
        <Button onClick={startingGameMenuClickHandler} text='Начать игру' />
        <Button onClick={exitAccountClickHandler} text='Выйти из аккаунта' />
        <Button onClick={deleteUserClickHandler} text='Удалить аккаунт' />
        <Chat
            isOpen={isChatOpen}
            onToggle={setIsChatOpen}
        />
        <button onClick={() => setPage(PAGES.GAME)}>Временная кнопка для открытия самой игры</button>
    </>)
}

export default Menu;