import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../../Context/DataProvider';
import searchIcon from '../../assets/search.png'
import { useApi } from '../../Context/ApiProvider';

const SearchBar = () => {
  const { products } = useApi();
  const { setFilteredProducts } = useContext(DataContext);
  
  const [query, setQuery] = useState('');

  useEffect(() => {
    const filtered = products.filter(product =>
      product.Producto.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [query, products, setFilteredProducts]);

  return (
    <div className='search-bar'>
        <img src={searchIcon}></img>
        <input
        className='inputSearch'
        type="text"
        placeholder="Buscar productos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        />
    </div>
    
  );
};

export default SearchBar;