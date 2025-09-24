import React, { useContext, useEffect, useRef, useState } from 'react';
import { ServerContext } from '../../App';
import Button from '../../components/Button/Button';
import { IBasePage, PAGES } from '../PageManager';

const Login: React.FC<IBasePage> = (props: IBasePage) => {
    const { setPage } = props;
    const server = useContext(ServerContext);
    const loginRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    const checkFormValidity = () => {
        if (loginRef.current && passwordRef.current) {
            const login = loginRef.current.value.trim();
            const password = passwordRef.current.value.trim();
            setIsFormValid(login.length > 0 && password.length > 0);
        }
    };

    const hideErrorOnInput = () => {
        setError('');
        checkFormValidity();
    };

    const clearAuthFields = () => {
        if (loginRef.current && passwordRef.current) {
            loginRef.current.value = '';
            passwordRef.current.value = '';
            checkFormValidity();
        }
    };

    const handlePasswordInput = (e: React.FormEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        if (input.value.length > 20) {
            input.value = input.value.slice(0, 20);
        }
        hideErrorOnInput();
    };

    useEffect(() => {
        const token = server.store.getToken();
        const savedRememberMe = server.store.getRememberMe();
        if (token && savedRememberMe) {
            setPage(PAGES.MENU);
        }
        server.showError(err => {
            if (err.code === 1002 || err.code === 1005) {
                setError('Неверный логин или пароль');
                clearAuthFields();
            }
        });
    }, []);

    const loginClickHandler = async () => {
        setError('');
        if (loginRef.current && passwordRef.current) {
            const login = loginRef.current.value;
            const password = passwordRef.current.value;

            const user = await server.login(login, password);

            if (user) {
                server.store.setUser(user, rememberMe)
                setPage(PAGES.MENU);
            }
        }
    }

    const registrationClickHandler = () => {
        setPage(PAGES.REGISTRATION)
    };
    const passwordRecoveryClickHandler = () => {
        setPage(PAGES.PASSWORD_RECOVERY)
    };


    return (<div className='login'>
        <h1>Knight Wars</h1>
        <div className='login-wrapper'>
            <p>Логин</p>
            <input
                ref={loginRef}
                type="text"
                placeholder="Ваш Логин"
                onChange={hideErrorOnInput}
                onKeyUp={checkFormValidity}
            />
            <p>Пароль</p>
            <input
                ref={passwordRef}
                type="password"
                placeholder="Ваш Пароль"
                maxLength={20}
                onChange={handlePasswordInput}
                onKeyUp={checkFormValidity}
            />
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(prev => !prev)}
                    />
                    Не выходить из учетной записи
                </label>
            </div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div className='login-buttons'>
                <Button
                    onClick={loginClickHandler}
                    text='Продолжить'
                    isDisabled={!isFormValid}
                />
                <Button onClick={passwordRecoveryClickHandler} text='Не можете войти?' />
                <Button onClick={registrationClickHandler} text='Создать учетную запись' />
                <button onClick={() => setPage(PAGES.GAME)}>Временная кнопка для открытия самой игры</button>
            </div>
        </div>
    </div>)
}

export default Login;