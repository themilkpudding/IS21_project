import React from 'react';
import Button from '../../components/Button/Button';
import { IBasePage, PAGES } from '../PageManager';

const PasswordRecovery: React.FC<IBasePage> = (props: IBasePage) => {
    const { setPage } = props;

    const passwordRecoveryClickHandler = () => {
        setPage(PAGES.LOGIN)
    };
    const backClickHandler = () => {
        setPage(PAGES.LOGIN)
    };

    return (<>
        <div>Восстановление пароля</div>
        <Button onClick={passwordRecoveryClickHandler} text='Восстановить пароль' />
        <Button onClick={backClickHandler} text='Вернуться к входу' />
    </>)
}

export default PasswordRecovery;