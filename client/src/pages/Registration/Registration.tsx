import React, { useContext, useRef, useState } from 'react';
import Button from '../../components/Button/Button';
import { IBasePage, PAGES } from '../PageManager';
import { ServerContext } from '../../App';
import { TError } from '../../services/server/types';
import './Registration.css';
import logo from '../../assets/img/logo/logo.svg'

const Registration: React.FC<IBasePage> = (props: IBasePage) => {
    const { setPage } = props;
    const server = useContext(ServerContext);
    const loginRef = useRef<HTMLInputElement>(null);
    const nicknameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    const getFormValues = () => {
        return {
            login: loginRef.current?.value.trim() || '',
            nickname: nicknameRef.current?.value || '',
            password: passwordRef.current?.value.trim() || '',
            confirmPassword: confirmPasswordRef.current?.value.trim() || '',
        };
    };

    const checkFormValidity = () => {
        const { login, nickname, password, confirmPassword } = getFormValues();
        setIsFormValid(login.length > 0 && nickname.trim().length > 0 && password.length > 0 && confirmPassword.length > 0);
    };

    const hideErrorOnInput = () => {
        setError('');
        checkFormValidity();
    };

    const clearAuthFields = () => {
        if (loginRef.current) loginRef.current.value = '';
        if (nicknameRef.current) nicknameRef.current.value = '';
        if (passwordRef.current) passwordRef.current.value = '';
        if (confirmPasswordRef.current) confirmPasswordRef.current.value = '';
        setIsFormValid(false);
    };

    const showError = (): boolean => {
        const { login, nickname, password, confirmPassword } = getFormValues();

        if (loginRef.current && (login.length > 15 || login.length < 6)) {
            setError('Логин должен быть от 6 до 15 символов');
            return false;
        }
        else if (nicknameRef.current && (nickname.length > 15 || nickname.length < 1)) {
            setError('Никнейм должен быть от 1 до 15 символов');
            return false;
        }
        else if (passwordRef.current && (password.length > 25 || password.length < 6)) {
            setError('Пароль должен быть от 6 до 25 символов');
            return false;
        }
        else if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return false;
        }

        return true;
    }


    const registrationClickHandler = async () => {
        if (!showError()) {
            return;
        }
        
        server.showError((err: TError) => {
            if (err.code === 1001) setError('Логин уже существует');
            clearAuthFields();
        });

        const { login, nickname, password } = getFormValues();
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
        <img src={logo} className="logo" height={80}/>
        <div className='registration-wrapper'>
            <p className='registration-label'>Логин</p>
            <input
                ref={loginRef}
                type="text"
                placeholder="Ваш Логин"
                onChange={hideErrorOnInput}
                onKeyUp={checkFormValidity}
            />
            <p className='registration-label'>Никнейм</p>
            <input
                ref={nicknameRef}
                type="text"
                placeholder="Ваш никнейм"
                onChange={hideErrorOnInput}
                onKeyUp={checkFormValidity}
            />
            <p className='registration-label'>Пароль</p>
            <input
                ref={passwordRef}
                type="password"
                placeholder="Ваш Пароль"
                onChange={hideErrorOnInput}
                onKeyUp={checkFormValidity}
            />
            <p className='registration-label'>Подтверждение пароля</p>
            <input
                ref={confirmPasswordRef}
                type="password"
                placeholder="Повторите ваш пароль"
                onChange={hideErrorOnInput}
                onKeyUp={checkFormValidity}
            />
            <div>
            </div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div className='registration-buttons'>
                <Button
                    onClick={registrationClickHandler}
                    text='Регистрация'
                    isDisabled={!isFormValid}
                />
                <Button onClick={haveAccountClickHandler} text='Уже есть аккаунт' />
            </div>
        </div>
    </div>)
}

export default Registration;