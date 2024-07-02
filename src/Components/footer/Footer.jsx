import React from 'react'
import wp from '../../assets/wp.png'
import ig from '../../assets/ig.png'
import { useApi } from '../../Context/ApiProvider'

const Footer = ({ closeInfo, visible }) => {

  const { contact, shipments, isLoading } = useApi();

  const shipmentsContent = () =>{
    return shipments.map((item, index) => (
      <p key={index}>{item.lugar} - {item.dia}</p>
    ));
  }

  return (
    <div className={`footer ${visible ? 'visible' : ''}`}>
      <div className='footer-cont'>
        <button className="close-btn" onClick={closeInfo}><i className="arrow down"></i></button>
        <div className='column'>
        <h4>INFO</h4>
          <span><p>{isLoading ? '' : contact.find(item => item.nombre === 'direccion').valor}</p> </span>
          <span><p>{isLoading ? '' : contact.find(item => item.nombre === 'telefono').valor}</p></span>
          <span><p>{isLoading ? '' : contact.find(item => item.nombre === 'email').valor}</p></span>
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
          <p>{isLoading ? '' : contact.find(item => item.nombre === 'entregas').valor}</p>
          <span></span>
          <span className='redes'>
            <a href='https://wa.me/+5492214970274?text=Hola%20Darrona!%20'><img src={wp} alt="logo de whatsapp"></img></a>
            <a href='https://www.instagram.com/distribuidoradarrona/'><img src={ig} alt="logo de instagram"></img></a>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Footer
