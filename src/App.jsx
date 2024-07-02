
import React, { useContext } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DataContext } from './Context/DataProvider';
import Home from './Components/home/Home';
import ListaDePrecios from './Components/listaDePrecios/ListaDePrecios';
import Login from './Components/Login/Login';


const  App = () => {
      
  const { tableType, setTableType } = useContext(DataContext)

  return (
    
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home setTableType={setTableType} />} />
          <Route path="/lista-de-precios" element={<ListaDePrecios tableType={tableType} />} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </BrowserRouter>

  );
};

export default App


// LOAD DATA INFILE 'C:/xampp/htdocs/darronaReact/productos.csv'
// INTO TABLE productos
// CHARACTER SET utf8mb4
// FIELDS TERMINATED BY ';'
// ENCLOSED BY '"'
// LINES TERMINATED BY '\n'
// IGNORE 1 LINES;