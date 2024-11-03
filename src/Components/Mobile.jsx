import React from 'react'
import logo from '../assets/Darrona.png';
import rotate from '../assets/rotate-mobile.png';

const Mobile = () => {
  return (
    <div className="mobile-container">
       <div className="img-cont"><img src={logo} alt="Logo Distribuidora Darrona - Alimentos Naturales."></img></div>
       <h1> DISTRIBUIDORA DARRONA</h1>
       <img className="rotate" src={rotate} alt="rotacion de dispositivo"></img>
       <p>Por favor, gire el dispositivo para poder ver esta página.</p>
    </div>
  )
}

export default Mobile