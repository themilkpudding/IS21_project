import React, { useContext, useRef, useState } from 'react';
import useChecRegistration from './hooks/useCheckRegistration';
import Button from '../../components/Button/Button';
import { IBasePage, PAGES } from '../PageManager';
import { ServerContext } from '../../App';
import { TError } from '../../services/server/types';
import logo from '../../assets/img/logo/logo.svg'
import './Registration.css';

const Registration: React.FC<IBasePage> = (props: IBasePage) => {
    const { setPage } = props;
    const server = useContext(ServerContext);
    const loginRef = useRef<HTMLInputElement>(null!);
    const nicknameRef = useRef<HTMLInputElement>(null!);
    const passwordRef = useRef<HTMLInputElement>(null!);
    const confirmPasswordRef = useRef<HTMLInputElement>(null!);
    const { isFormValid, error, setError, checkFilled, showError } = useChecRegistration();

    const hideErrorOnInput = () => {
        setError('');
        checkFilled(loginRef.current.value, nicknameRef.current.value, passwordRef.current.value, confirmPasswordRef.current.value);
    };

    const clearAuthFields = () => {
        loginRef.current.value = '';
        nicknameRef.current.value = '';
        passwordRef.current.value = '';
        confirmPasswordRef.current.value = '';
        checkFilled(loginRef.current.value, nicknameRef.current.value, passwordRef.current.value, confirmPasswordRef.current.value);
    };

    const registrationClickHandler = async () => {
        const login = loginRef.current.value;
        const nickname = nicknameRef.current.value;
        const password = passwordRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;

        if (!showError(login, nickname, password, confirmPassword)) return;

        server.showError((err: TError) => {
            if (err.code === 1001) setError('логин занят');
            clearAuthFields();
        });

        const user = await server.registration(login, password, nickname);

        if (user) {
            server.store.setUser(user, false)
            setPage(PAGES.LOGIN);
        }
    }

    const haveAccountClickHandler = () => {
        setPage(PAGES.LOGIN)
    }

    return (<div className='registration'>
        <img src={logo} className="logoReg" height={80} />
        <div className='registration-wrapper'>
            <p className='registration-label'>логин</p>
            <input
                ref={loginRef}
                type="text"
                placeholder="ваш логин"
                onChange={hideErrorOnInput}
                onKeyUp={() => checkFilled(loginRef.current.value, nicknameRef.current.value, passwordRef.current.value, confirmPasswordRef.current.value)}
                className='input-loginReg'
                id='test-input-loginReg'
                autoComplete='off'
            />
            <p className='registration-label'>никнейм</p>
            <input
                ref={nicknameRef}
                type="text"
                placeholder="ваш никнейм"
                onChange={hideErrorOnInput}
                onKeyUp={() => checkFilled(loginRef.current.value, nicknameRef.current.value, passwordRef.current.value, confirmPasswordRef.current.value)}
                className='input-nicknameReg'
                id='test-input-nicknameReg'
                autoComplete='off'
            />
            <p className='registration-label'>пароль</p>
            <input
                ref={passwordRef}
                type="password"
                placeholder="ваш пароль"
                onChange={hideErrorOnInput}
                onKeyUp={() => checkFilled(loginRef.current.value, nicknameRef.current.value, passwordRef.current.value, confirmPasswordRef.current.value)}
                className='input-passwordReg'
                id='test-input-passwordReg'
                autoComplete='off'
            />
            <p className='registration-label'>подтверждение пароля</p>
            <input
                ref={confirmPasswordRef}
                type="password"
                placeholder="повторите ваш пароль"
                onChange={hideErrorOnInput}
                onKeyUp={() => checkFilled(loginRef.current.value, nicknameRef.current.value, passwordRef.current.value, confirmPasswordRef.current.value)}
                className='input-certpasswordReg'
                id='test-input-certpasswordReg'
                autoComplete='off'
            />
            <div>
            </div>
            {error && <div className='errors'>{error}</div>}
            <div className='registration-buttons'>
                <Button
                    onClick={registrationClickHandler}
                    isDisabled={!isFormValid}
                    className='registration-button'
                    id='test-registration-button'
                />
                <Button
                    onClick={haveAccountClickHandler}
                    className='haveAccount-Button'
                    id='test-haveAccount-Button'
                />
            </div>
        </div>
    </div>)
}

export default Registration;