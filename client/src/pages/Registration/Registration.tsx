import React from 'react';
import Button from '../../components/Button/Button';
import { IBasePage, PAGES } from '../PageManager';

const Registration: React.FC<IBasePage> = (props: IBasePage) => {
    const { setPage } = props;

    const registrationClickHandler = () => {
        setPage(PAGES.LOGIN)
    };

    const haveAccountClickHandler = () => {
        setPage(PAGES.LOGIN)
    }

    return (<>
        <div>Регистрация</div>
        <Button onClick={registrationClickHandler} text='Регистрация' />
        <Button onClick={haveAccountClickHandler} text='Уже есть аккаунт' />
    </>)
}

export default Registration;