import React, { createContext, useState, useEffect, useMemo } from 'react';
import { useApi } from './ApiProvider';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {

  const { products } = useApi();


  //Productos filtrados por buscador.
  const [filteredProducts, setFilteredProducts] = useState([]);


  //Productos filtrados por categoría. 
  const [selectedCategory, setSelectedCategory] = useState(null);
  

  //Tomar las categorias de la base de datos sin que se repitan.
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const extractedCategories = products.map(item => item.Categoría).filter(Boolean);
    const uniqueCategories = Array.from(new Set(extractedCategories));

    if (uniqueCategories.length > 0) {
      setCategories(uniqueCategories);
    }     

  }, [products]);


  //Guardar la eleccion de consumidor del Home en LS.
  const [tableType, setTableType] = useState(localStorage.getItem('tableType') || (null));

  useEffect(() => {
    localStorage.setItem('tableType', tableType);
  }, [tableType]);


  const value = useMemo(() => ({
    categories,  
    filteredProducts,
    setFilteredProducts,
    selectedCategory, 
    setSelectedCategory, 
    setCategories,
    tableType, 
    setTableType,
  }), 
  [
    categories, 
    filteredProducts,
    setFilteredProducts,
    selectedCategory, 
    setSelectedCategory, 
    setCategories,
    tableType, 
    setTableType,
  ]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};