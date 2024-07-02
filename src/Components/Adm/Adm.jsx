import React, { useState } from 'react'
import logo from '../../assets/Darrona.png'
import './adm.css'
import FileUpload from './FileUpload';
import LoginUpload from './LoginUpload';
import AmountsUpload from './AmountsUpload';
import ContactUpload from './ContactUpload';
import ShipmentsUpload from './ShipmentsUpload';
import { useNavigate } from 'react-router-dom';
import ViewOrders from './ViewOrders';


const Adm = () => {

  const [activeOption, setActiveOption] = useState('');

  const handleBackClick = () => {
    window.open('/lista-de-precios', '_blank', 'noopener,noreferrer');
  };

  const renderContentOpc = () => {
    switch (activeOption) {
      case 'updateProducts':
        return <FileUpload />;
      case 'updateUser':
        return <LoginUpload />
      case 'updateAmounts':
        return <AmountsUpload />;
      case 'updateContact':
        return <ContactUpload />;
      case 'updateShipments':
        return <ShipmentsUpload />
      default:
        return <div>Selecciona una opción para empezar</div>;
    }
  }


  return (
    <>
      <div className='nav-lis'>
        <div className='logo'>
          <div className="img-cont"><img src={logo} alt="Logo Distribuidora Darrona - Alimentos Naturales."></img></div>
          <h1><span>ADMINISTRACION</span><span>DISTRIBUIDORA DARRONA</span></h1>
        </div>
        <div>
          <button className="btn-adm go-to-page" onClick={handleBackClick} target="_blank" rel="noreferrer">
            <a
              href="/lista-de-precios"
              target="_blank"
              rel="noreferrer"
              onClick={handleBackClick}
            >
              IR A PAGINA DE PRODUCTOS
            </a>
          </button>
        </div>
      </div>
      <div className='container'>
        <div className='adm-cont'>
          <div className='opc-adm'>
            <ul>
              <li><button onClick={() => setActiveOption('updateProducts')}>EDITAR LISTA DE PRODUCTOS</button></li>
              <li><button onClick={() => setActiveOption('updateUser')}>EDITAR USUARIO O CONTRASEÑA</button></li>
              <li><button onClick={() => setActiveOption('updateAmounts')}>EDITAR MONTOS MINIMOS DE COMPRA</button></li>
              <li><button onClick={() => setActiveOption('updateContact')}>EDITAR INFORMACION DE CONTACTO</button></li>
              <li><button onClick={() => setActiveOption('updateShipments')}>EDITAR INFORMACION DE ENVÍO</button></li>
            </ul>
          </div>
          <div className='opc-render'>
            {renderContentOpc()}
          </div>
        </div>
        <div className='orders-cont'>
          <ViewOrders />
        </div>
      </div>

    </>
  )
}

export default Adm
