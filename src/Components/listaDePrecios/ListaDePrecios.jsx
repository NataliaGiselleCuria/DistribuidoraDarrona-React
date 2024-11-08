import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderContext } from '../../Context/OrderProvider';
import './listaDePrecio.css';
import Table from './Table';
import logo from '../../assets/Darrona.png'
import wp from '../../assets/whatsapp.png'
import arrow from '../../assets/arrow.png'
import arrowBack from '../../assets/arrow-back.png'
import Categories from './Categories';
import ProductSearch from './ProductSearch';
import { useApi } from '../../Context/ApiProvider';
import FormOrder from './FormOrder';
import Nav from '../footer/Nav';
import Mobile from '../Mobile';


const ListaDePrecios = ({ tableType }) => {

  const navigate = useNavigate();
  const handleBackClick = () => {
    resetOrder();
    navigate('/');
   
  };

  const { amounts, isLoading } = useApi();
  const { totalOrderFormat, resetOrder } = useContext(OrderContext)
  const [showOrder, setShowOrder] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);
  
  const minimumPurchaseContent = () => {
    if (isLoading) {
      return <p className='minimum-purchase'>CARGANDO MINIMO DE COMPRA</p>;
    }
    const typeBuyer = amounts.find((amount) => amount.categoría === tableType);
    if (!typeBuyer) {
      return <p className='minimum-purchase'>No se encontró el mínimo de compra para esta categoría.</p>;
    }
    return <p className='minimum-purchase'>{typeBuyer.mensaje}</p>;
  };

  const handleVerPedidoClick = () => {
    setShowOrder(prevShowOrder => !prevShowOrder);
    setShowForm(false);
    setIsFinalized(false); 
  };

  const handleFinalizarClick = () => {
    setShowOrder(true);
    setShowForm(true);
    setIsFinalized(true);
  };

  const [expanded, setExpanded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(window.innerWidth <= 1280);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsExpanded(window.innerWidth <= 1280);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  

  return (
    <div className='lista-precios'>
      <Nav/>
      <section className="cont">
        <div className='nav-lis'>
          <div className='logo'>
            <div className="img-cont"><img src={logo} alt="Logo Distribuidora Darrona - Alimentos Naturales."></img></div>
            <h1><span>LISTA DE PRECIOS </span><span> DISTRIBUIDORA DARRONA</span></h1>
          </div>
          <div className='summary-cont'>
            <div className='ml'><p className='summary'>RESUMEN DE PEDIDO</p><p className='price-summary'>{totalOrderFormat}</p></div>
             {minimumPurchaseContent()} 
          </div>
        </div>
        <div className='nav2'>
          <div className='name-type-of-buyer'>
            <img src={arrowBack} alt="flecha para volver a la pagina de eleccion de consumidor." onClick={handleBackClick}></img>
            <h3>{tableType.toUpperCase()}</h3>
          </div>
          <div className='buttons-list'>
            {showForm && showOrder ? (
              <button className='button-list add-more-p' onClick={handleVerPedidoClick}>
                Seguir agregando productos
              </button>
            ) : (
              <>
                <button className='button-list' onClick={handleVerPedidoClick}>
                  {showOrder ? "Volver" : "Ver pedido"}
                </button>
                <button className='button-list' onClick={handleFinalizarClick}><a href="#form">Finalizar</a></button>
              </>
            )}
          </div>
        </div>
        <div className='cont-products'>         
          <div className='categories-cont'>
            {isExpanded ? (
              <>
                <span className="cat">
                  <div 
                    className={`toggle-btn clearfix ${expanded ? 'hide-toggle' : ''}`} 
                    onClick={toggleExpand}
                  >
                    <div className="arrow-open-close"></div>
                  </div>
                  <h2>CATEGORIAS</h2>
                  <ProductSearch />
                </span>
                {expanded && <Categories />}
              </>
            ) : (
              <>
                <h2>CATEGORIAS</h2>
                <ProductSearch />
                <Categories />
              </>
            )}
          </div>     
          <div className='cont-table'>
            {showForm && <FormOrder />}
            <Table showOrder={showOrder}  isFinalized={isFinalized} />
          </div>
        </div>
        <a href="#inicio" className="inicio"><img src={arrow} alt="icono de flecha hacia arriba para volver a la parte superior de la página"></img></a>
        <a href="https://wa.me/+5492214970274?text=Hola%20Darrona!%20" className="whatsapp" target="_blank"><img src={wp} alt="icono de whatsapp"></img></a>
      </section>
      <section className='cont-mobile'>
        <Mobile/>
      </section>
    </div>
  );
};
export default ListaDePrecios;