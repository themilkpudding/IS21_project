import React from 'react';
import { IBasePage, PAGES } from '../PageManager';

const ClassShop: React.FC<IBasePage> = (props: IBasePage) => {
    const { setPage } = props;
    
    return (<>
        <div>Магазин классов</div>
        <button onClick={() => setPage(PAGES.MENU)}>Назад</button>
    </>)
}

export default ClassShop;