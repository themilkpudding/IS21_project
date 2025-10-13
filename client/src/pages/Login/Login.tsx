import React, { useContext, useEffect, useRef, useState } from 'react';
import useCheckLogin from './hooks/useCheckLogin';
import { ServerContext } from '../../App';
import { IBasePage, PAGES } from '../PageManager';
import { TError } from '../../services/server/types';
import Button from '../../components/Button/Button';
import logo from '../../assets/img/logo/logo.svg';
import './Login.scss'

const Login: React.FC<IBasePage> = (props: IBasePage) => {
    const { setPage } = props;
    const server = useContext(ServerContext);
    const loginRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const { isFormValid, error,  setError, checkFilled, showError } = useCheckLogin();
    const [rememberMe, setRememberMe] = useState(false);

    const hideErrorOnInput = () => {
        setError('');
        checkFilled(loginRef.current!.value, passwordRef.current!.value);
    };

    const clearAuthFields = () => {
        loginRef.current!.value = '';
        passwordRef.current!.value = '';
        checkFilled(loginRef.current!.value, passwordRef.current!.value);
    };

    const loginClickHandler = async () => {
        const login = loginRef.current!.value;
        const password = passwordRef.current!.value;

        if (!showError(login, password)) return;

        const user = await server.login(login, password);

        if (user) {
            server.store.setUser(user, rememberMe)
            setPage(PAGES.MENU);
        }
    }

    const registrationClickHandler = () => { setPage(PAGES.REGISTRATION) };

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

    return (<div className='login'>
        <img src={logo} className='logo' />
        <div className="input-group login-group">
            <p className='p-login'>логин</p>
            <input
                ref={loginRef}
                type="text"
                placeholder="ваш логин"
                onChange={hideErrorOnInput}
                onKeyUp={() => checkFilled(loginRef.current!.value, passwordRef.current!.value)}
                className='input-login'
                id='test-input-login'
            />
        </div>

        <div className="input-group password-group">
            <p className='p-password'>пароль</p>
            <input
                ref={passwordRef}
                type="password"
                placeholder="ваш пароль"
                onChange={hideErrorOnInput}
                onKeyUp={() => checkFilled(loginRef.current!.value, passwordRef.current!.value)}
                className='input-password'
                id='test-input-password'
            />
        </div>

        <label className='label-remember'>
            <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className='checkbox-remember'
                id='test-checkbox-remember'
            />
            <span id='test-span-remember' className="span-remember">не выходить из учетной записи</span>
        </label>

        {error && <p className='p-error'>{error}</p>}
        <Button
            onClick={loginClickHandler}
            isDisabled={!isFormValid}
            className='button-login'
            id='test-button-login'
        />
        <Button
            onClick={registrationClickHandler}
            text='создать учетную запись'
            className='button-registration'
            id='test-button-registration'
        />
    </div>)
}

export default Login;