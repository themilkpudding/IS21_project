import React, { useEffect } from "react";
import { IBasePage, PAGES } from "../PageManager";


const Preloader: React.FC<IBasePage> = (props: IBasePage) => {
    const { setPage } = props;

    useEffect(() => {
        setTimeout(() => setPage(PAGES.LOGIN), 3000);
    });

    return (
        <div className="preloader">
            <div className="preloader-wrapper"></div>
            <div>
                <div className="preloader__dots" />
            </div>
            <span>Загрузка...</span>
            <section className="preloader__authors">
            </section>
        </div>
    );
}

export default Preloader;