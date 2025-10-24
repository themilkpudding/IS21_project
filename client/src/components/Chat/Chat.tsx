import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import { ServerContext, StoreContext } from '../../App';
import { TMessages } from '../../services/server/types';
import Button from '../Button/Button';
import './Chat.scss'

interface IChat {
    isOpen: boolean;
    onToggle: (isOpen: boolean) => void;
}

const Chat: React.FC<IChat> = ({ isOpen, onToggle }) => {
    const server = useContext(ServerContext);
    const store = useContext(StoreContext);
    const [messages, setMessages] = useState<TMessages>([]);
    const [_, setHash] = useState<string>('');
    const messageRef = useRef<HTMLInputElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
    const user = store.getUser();

    const cancelAutoClose = () => {
        if (autoCloseTimerRef.current) {
            clearTimeout(autoCloseTimerRef.current);
            autoCloseTimerRef.current = null;
        }
    };

    const startAutoClose = () => {
        cancelAutoClose();
        autoCloseTimerRef.current = setTimeout(() => {
            if (isOpen) {
                onToggle(false);
            }
        }, 3000);
    };

    useEffect(() => {
        if (isOpen && !isHovered) {
            startAutoClose();
        } else {
            cancelAutoClose();
        }

        return cancelAutoClose;
    }, [isOpen, isHovered]);

    useEffect(() => {
        const newMessages = (hash: string) => {
            const currentMessages = store.getMessages();
            if (currentMessages?.length) {
                setMessages(currentMessages);
                setHash(hash);

                if (currentMessages.length > messages.length) {
                    onToggle(true);
                }
            }
        }

        if (user) {
            server.startChatMessages(newMessages);
        }

        return () => {
            server.stopChatMessages();
        }
    }, [user, server, store, isOpen, startAutoClose, cancelAutoClose]);

    const input = useMemo(() => <input ref={messageRef} placeholder='сообщение' />, []);

    const sendClickHandler = () => {
        if (messageRef.current) {
            const message = messageRef.current.value;

            if (message) {
                server.sendMessage(message);
                messageRef.current.value = '';
            }
        }
    }

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const toggleChat = () => {
        onToggle(!isOpen);
    };

    return (<div
        className={`chat ${isOpen ? 'chat-open' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
    >

        <div className="chat-toggle" onClick={toggleChat}>
            {isOpen ? 'Закрыть чат' : 'Открыть чат'}
        </div>

        {isOpen && (
            <div className="chat-window">
                <div className="chat-header">
                    <span>Чат</span>
                </div>

                <div className="chat-messages">
                    {messages.length === 0 ? (
                        <div className="chat-empty">
                            Нет сообщений
                        </div>
                    ) : (
                        messages.reverse().map((message, index) =>
                            <div key={index}>
                                {`${message.author} (${message.created}): ${message.message}`}
                            </div>)

                    )}
                </div>

                <div className="chat-input">
                    {input}
                    <Button
                        className="chat-send-button"
                        text="➤"
                        onClick={sendClickHandler}
                    />
                </div>
            </div>
        )}

    </div>)
}

export default Chat;