import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../footer/Footer';
import './home.css';
import { useApi } from '../../Context/ApiProvider';
import logo from '../../assets/Darrona.png';
import Mobile from '../Mobile';


const Home = ({ setTableType }) => {
  const navigate = useNavigate();
  const { amountsValues, isLoading } = useApi();

  const minimumPurchaseContent = (category) => {
    if (isLoading) {
      return <p className='sub'>CARGANDO MINIMO DE COMPRA</p>;
    }
    const typeBuyer = amountsValues.find((amount) => amount.categoría === category);
    if (!typeBuyer) {
      return <p className='sub'>Categoría no encontrada</p>;
    }
    const formattedMinimo = typeBuyer.minimo.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return <p className='sub'>MINIMO ${formattedMinimo}</p>;
  };

  const handleButtonClick = (type) => {
    setTableType(type);
    navigate('/lista-de-precios');
  };

  return (
    <div className='home'>
       <div className='nav'>
       </div>
      <section className="cont">
        <div className="img-cont"><img src={logo} alt="Logo Distribuidora Darrona - Alimentos Naturales."></img></div>
        <h1><span>LISTA DE PRECIOS </span><span> DISTRIBUIDORA DARRONA</span></h1>
        <div className="buttons">
          <span>
            <button className="b-1" onClick={() => handleButtonClick('minorista')}><p>MINORISTA</p></button>
          </span>
          <span>
            <button className="b-2" onClick={() => handleButtonClick('mayorista')}><p>MAYORISTA</p></button>
            {minimumPurchaseContent('mayorista')}
          </span>
          <span>
            <button className="b-3" onClick={() => handleButtonClick('distribuidor')}><p>DISTRIBUIDOR</p></button>
            {minimumPurchaseContent('distribuidor')}
          </span>
         
        </div>
      </section>
      <section className='cont-mobile'>
        <Mobile/>
      </section>
      <Footer/>
    </div>
  );
};

export default Home;
