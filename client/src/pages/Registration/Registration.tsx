import React, { useContext, useRef, useState } from 'react';
import Button from '../../components/Button/Button';
import { IBasePage, PAGES } from '../PageManager';
import { ServerContext } from '../../App';
import { TError } from '../../services/server/types';
import logo from '../../assets/img/logo/logo.svg'
import './Registration.css';

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

    const checkValidChars = /^[a-zA-Z0-9]+$/;

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
            setError("логин должен быть от 6 до 15 символов");
            return false;
        }
        else if (!checkValidChars.test(login)) {
            setError('логин должен содержать только латинские буквы и цифры');
            return false;

        }
        else if (nicknameRef.current && (nickname.length > 15 || nickname.length < 1)) {
            setError('никнейм должен быть от 1 до 15 символов');
            return false;
        }
        else if (!checkValidChars.test(nickname)) {
            setError('никнейм должен содержать только латинские буквы и цифры');
            return false;

        }
        else if (passwordRef.current && (password.length > 25 || password.length < 6)) {
            setError('пароль должен быть от 6 до 25 символов');
            return false;
        }
        else if (!checkValidChars.test(password)) {
            setError('пароль должен содержать только латинские буквы и цифры');
            return false;

        }
        else if (password !== confirmPassword) {
            setError('пароли не совпадают');
            return false;
        }

        return true;
    }

    const registrationClickHandler = async () => {
        if (!showError()) {
            return;
        }

        server.showError((err: TError) => {
            if (err.code === 1001) setError('логин занят');
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
        <img src={logo} className="logoReg" height={80} />
        <div className='registration-wrapper'>
            <p className='registration-label'>логин</p>
            <input
                ref={loginRef}
                type="text"
                placeholder="ваш логин"
                onChange={hideErrorOnInput}
                onKeyUp={checkFormValidity}
                className='input-loginReg'
                id='test-input-loginReg'
            />
            <p className='registration-label'>никнейм</p>
            <input
                ref={nicknameRef}
                type="text"
                placeholder="ваш никнейм"
                onChange={hideErrorOnInput}
                onKeyUp={checkFormValidity}
                className='input-nicknameReg'
                id='test-input-nicknameReg'
            />
            <p className='registration-label'>пароль</p>
            <input
                ref={passwordRef}
                type="password"
                placeholder="ваш пароль"
                onChange={hideErrorOnInput}
                onKeyUp={checkFormValidity}
                className='input-passwordReg'
                id='test-input-passwordReg'
            />
            <p className='registration-label'>подтверждение пароля</p>
            <input
                ref={confirmPasswordRef}
                type="password"
                placeholder="повторите ваш пароль"
                onChange={hideErrorOnInput}
                onKeyUp={checkFormValidity}
                className='input-certpasswordReg'
                id='test-input-certpasswordReg'
            />
            <div>
            </div>
            {error && <div className='errors'>{error}</div>}
            <div className ='registration-buttons'>
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