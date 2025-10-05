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
            setError('логин должен быть от 6 до 15 символов');
            return false;
        }

        if (password.length > 25 || password.length < 6) {
            setError('пароль должен быть от 6 до 25 символов');
            return false;
        }

        return true;
    };

    useEffect(() => {
        const token = server.store.getToken();
        const savedRememberMe = server.store.getRememberMe();

        server.showError((err: TError) => {
            if (err.code === 1002 || err.code === 1005) setError('неверный логин или пароль');
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
            <p className='p-login'>логин</p>
            <input
                ref={loginRef}
                type="text"
                placeholder="ваш логин"
                onChange={hideErrorOnInput}
                onKeyUp={checkFormValidity}
                className='input-login'
            />
        </div>

        <div className="input-group password-group">
            <p className='p-password'>пароль</p>
            <input
                ref={passwordRef}
                type="password"
                placeholder="ваш пароль"
                onChange={hideErrorOnInput}
                onKeyUp={checkFormValidity}
                className='input-password'
            />
        </div>

        <label className='label-remember'>
            <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(prev => !prev)}
                className='checkbox-remember'
            />
            <span className="label-remember-span">не выходить из учетной записи</span>
        </label>

        {error && <p className='p-error'>{error}</p>}
        <Button
            onClick={loginClickHandler}
            text=''
            isDisabled={!isFormValid}
            className='button-login'
        />
        <Button
            onClick={registrationClickHandler}
            text='создать учетную запись'
            className='button-registration'
        />
    </div>)
}

export default Login;