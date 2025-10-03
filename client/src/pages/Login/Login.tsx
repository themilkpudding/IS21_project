import React, { useContext, useEffect, useRef, useState } from 'react';
import { ServerContext } from '../../App';
import Button from '../../components/Button/Button';
import { IBasePage, PAGES } from '../PageManager';
import { TError } from '../../services/server/types';
import './Login.css'
import logo from '../../assets/img/logo/logo.svg';

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
        if (loginRef.current) loginRef.current.value = '';
        if (passwordRef.current) passwordRef.current.value = '';
        setIsFormValid(false);
    };

    const showError = (): boolean => {
        const login = loginRef.current?.value || '';
        const password = passwordRef.current?.value || '';

        if (login.length > 15 || login.length < 6) {
            setError('Логин должен быть от 6 до 15 символов');
            return false;
        }

        if (password.length > 25 || password.length < 6) {
            setError('Пароль должен быть от 6 до 25 символов');
            return false;
        }

        return true;
    };

    useEffect(() => {
        const token = server.store.getToken();
        const savedRememberMe = server.store.getRememberMe();

        server.showError((err: TError) => {
            if (err.code === 1002 || err.code === 1005) setError('Неверный логин или пароль');
            clearAuthFields();
        });

        if (token && savedRememberMe) {
            setPage(PAGES.MENU);
        }
    }, []);

    const loginClickHandler = async () => {
        if (!showError()) {
            return;
        }
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


    return (<div className='login'>
        <img src={logo} className='logo' />
            <div className="input-group login-group">
                <p className='p-log'>логин</p>
                <input
                    ref={loginRef}
                    type="text"
                    placeholder="Ваш Логин"
                    onChange={hideErrorOnInput}
                    onKeyUp={checkFormValidity}
                    className='input-log'
                />
            </div>

            <div className="input-group password-group">
            <p className='p-pass'>пароль</p>
            <input
                ref={passwordRef}
                type="password"
                placeholder="Ваш Пароль"
                onChange={hideErrorOnInput}
                onKeyUp={checkFormValidity}
                className='input-pass'
            />
            </div>
        
        <div className='login-buttons'>
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
            <Button
                onClick={loginClickHandler}
                text='Продолжить'
                isDisabled={!isFormValid}
            />
            <Button onClick={registrationClickHandler} text='Создать учетную запись' />
            <button onClick={() => setPage(PAGES.GAME)}>Временная кнопка для открытия самой игры</button>
        </div>
    </div>)
}

export default Login;