import React from 'react';
import wp from '../../assets/wp.png';
import ig from '../../assets/ig.png';
import { useApi } from '../../Context/ApiProvider';

const Footer = ({ closeInfo, visible }) => {
  const { contact, shipments, isLoading } = useApi();

  const shipmentsContent = () => {
    return shipments.map((item, index) => (
      <p key={index}>{item.lugar} - {item.dia}</p>
    ));
  }

  const getContactValue = (name) => {
    const contactItem = contact.find(item => item.nombre === name);
    return contactItem ? contactItem.valor : 'Información no disponible';
  };

  return (
    <div className={`footer ${visible ? 'visible' : ''}`}>
      <div className='footer-cont'>
        <button className="close-btn" onClick={closeInfo}><i className="arrow down"></i></button>
        <div className='column'>
          <h4>INFO</h4>
          <span><p>{isLoading ? 'Cargando...' : getContactValue('direccion')}</p></span>
          <span><p>{isLoading ? 'Cargando...' : getContactValue('telefono')}</p></span>
          <span><p>{isLoading ? 'Cargando...' : getContactValue('email')}</p></span>
        </div>
        <div className='column'>
          <h4>ZONAS Y DIAS DE ENTREGA</h4>
          <div className="col">
            {isLoading ? (
              <p>Cargando...</p>
            ) : (
              shipmentsContent()
            )}
          </div>
        </div>
        <div className='column'>
          <h4>HORARIO DE ATENCIÓN</h4>
          <p>{isLoading ? 'Cargando...' : getContactValue('entregas')}</p>
          <span></span>
          <span className='redes'>
            <a href='https://wa.me/+5492214970274?text=Hola%20Darrona!%20'><img src={wp} alt="logo de whatsapp"></img></a>
            <a href='https://www.instagram.com/distribuidoradarrona/'><img src={ig} alt="logo de instagram"></img></a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Footer;