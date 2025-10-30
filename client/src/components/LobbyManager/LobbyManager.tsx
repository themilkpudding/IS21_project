import React, { useContext, useState } from 'react';
import { ServerContext, StoreContext } from '../../App';
import Button from '../Button/Button';
import { IBasePage, PAGES } from '../../pages/PageManager';
import './LobbyManager.scss'
import { TRoom } from '../../services/server/types';

interface ILobbyManagerProps extends IBasePage {
    isOpen: boolean;
    onToggle: (isOpen: boolean) => void;
}


const LobbyManager: React.FC<ILobbyManagerProps> = (props) => {
    const { setPage, isOpen, onToggle } = props;
    const server = useContext(ServerContext);
    const store = useContext(StoreContext);
    const [currentRoom, setCurrentRoom] = useState<number | null>(null);
    const [rooms, setRooms] = useState<TRoom[]>([]);

    const toggleLobbyManager = () => {
        onToggle(!isOpen);
    };

    const createRoomClickHandler = async () => {
        await server.createRoom();
        setPage(PAGES.LOBBY);
    }

    const joinToRoomClickHandler = async (roomId: number) => {
        await server.joinToRoom(roomId);
        setCurrentRoom(roomId);
    }

    const leaveRoomClickHandler = async () => {
        await server.leaveRoom();
        setCurrentRoom(null);
    }

    const dropFromRoomClickHandler = async () => {
        await server.deleteUser();
        setPage(PAGES.LOGIN);
    }

    const deleteUserClickHandler = async () => {
        await server.deleteUser();
        setPage(PAGES.LOGIN);
    }

    const startGameClickHandler = async () => {
        await server.startGame();
    }

    const getRoomsClickHandler = async () => {
        await server.deleteUser();
        setPage(PAGES.LOGIN);
    }

    const exitAccountClickHandler = async () => {
        await server.logout();
        setPage(PAGES.LOGIN);
    };

    return (<div
        className={`lobby-manager ${isOpen ? 'lobby-manager-open' : ''}`}
    >

        <div className="lobby-manager-toggle" onClick={toggleLobbyManager}>
            {isOpen ? '☰' : '☰'}
        </div>

        {isOpen && (
            <div className="lobby-manager-window">
                <Button onClick={createRoomClickHandler} text='Создать комнату' />
                <Button onClick={joinToRoomClickHandler} text='Присоединиться к комнате' />
                <Button onClick={leaveRoomClickHandler} text='Покинуть комнату' />
                <Button onClick={dropFromRoomClickHandler} text='Выгнать из комнаты' />
                <Button onClick={deleteUserClickHandler} text='Удалить аккаунт' />
                <Button onClick={startGameClickHandler} text='Начать игру' />
                <Button onClick={getRoomsClickHandler} text='Получить комнаты' />
                <Button onClick={exitAccountClickHandler} text='Выйти из аккаунта' />
            </div>
        )}

    </div>)
}

export default LobbyManager;