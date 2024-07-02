import React, { useState } from 'react'
import Footer from './Footer';

const Nav = () => {

    const [infoVisible, setInfoVisible] = useState(false);

    const showInfo = () => {
        setInfoVisible(true);
    };

    const closeInfo = () => {
        setInfoVisible(false);
    };

    return (
        <div className='nav'>
            <span>
                <a onClick={() => showInfo()}>ZONAS Y DIAS DE ENTREGA</a>
                <p>|</p>
                <a onClick={() => showInfo()}>CONTACTO</a>
            </span>
            {infoVisible && <Footer closeInfo={closeInfo} visible={infoVisible} />}
        </div>
    )
}

export default Nav
