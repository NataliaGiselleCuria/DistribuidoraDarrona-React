import React, { useContext, useState } from 'react';
import { DataContext } from '../../Context/DataProvider';
import { useOrder } from '../../Context/OrderProvider'; 

const Table = ( {showOrder, isFinalized} ) => {
  const { filteredProducts, selectedCategory, tableType } = useContext(DataContext);
  const { addToOrder, order, removeFromOrder } = useOrder();

  //Filtrar los productos por categoria seleccionada sin mostrar los que no tienen precio.
  const hasValidPrices = (product) => {
    const prices = [
      product['minorista precio x presentación'],
      product['mayorista precio x presentación'],
      product['distribuidor precio x presentación'],
    ];
    return prices.every(price => price !== null && price !== '' && parseFloat(price.replace(/[^\d.-]/g, '')) > 0);
  };

  const displayedProducts = selectedCategory && selectedCategory !== 'TODOS LOS PRODUCTOS'
    ? filteredProducts.filter(product => product.Categoría === selectedCategory && hasValidPrices(product))
    : filteredProducts.filter(product => hasValidPrices(product));


  //Mostrar solo las columnas correspondientes al consumidor seleccionado en Home.
  const renderTypeOfBuyerColumns = (product) => {

    const formatPrice = (priceText) => {
      // Remover el signo de pesos y las comas, y convertir a número
      return parseFloat(priceText.replace(/[$.]/g, '').replace(/,/, '.'));
  };

    const formatQuantity = (quantityText) => {
      // Convertir la cantidad a número (en caso de que también sea un texto)
      return parseFloat(quantityText);
    };

    const formatCurrency = (value) => {
      // Formatear el número al estilo 0.000,00 con signo de pesos
      return value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
  };

    if (tableType === 'minorista') {

      const precioPorPresentacion = formatPrice(product['minorista precio x presentación']);
      const cantidadPorPresentacion = formatQuantity(product['Cantidad x pres.']);
      const precioPorUnidad = precioPorPresentacion / cantidadPorPresentacion;
      
      return (
        <>
          <td className='price'>{formatCurrency(precioPorUnidad)}</td>
          <td className='price'>{product['minorista precio x presentación']}</td>

        </>
      );
    } else if (tableType === 'mayorista') {

      const precioPorPresentacion = formatPrice(product['mayorista precio x presentación']);
      const cantidadPorPresentacion = formatQuantity(product['Cantidad x pres.']);
      const precioPorUnidad = precioPorPresentacion / cantidadPorPresentacion;

      return (
        <>
          <td className='price'>{formatCurrency(precioPorUnidad)}</td>
          <td className='price'>{product['mayorista precio x presentación']}</td>
        </>
      );
    } else if (tableType === 'distribuidor') {

      const precioPorPresentacion = formatPrice(product['distribuidor precio x presentación']);
      const cantidadPorPresentacion = formatQuantity(product['Cantidad x pres.']);
      const precioPorUnidad = precioPorPresentacion / cantidadPorPresentacion;

      return (
        <>
          <td className='price'>{formatCurrency(precioPorUnidad)}</td>
          <td className='price'>{product['distribuidor precio x presentación']}</td>
        </>
      );
    }
  };

  
  // Cantidad por producto.
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (product, quantity) => {
    setQuantities(prevQuantities => ({
        ...prevQuantities,
        [product.Código]: quantity,
    }));

    if (quantity === 0 || quantity === '') {
        removeFromOrder(product);
    } else {
        const totalPrice = calculateTotalPrice(product, quantity);
        addToOrder(product, quantity, totalPrice);
    }
};

  
  //Calcular precio total de cada producto.
  const calculateTotalPrice = (product, quantity) => {
    const productPrice = `${tableType.toLowerCase()} precio x presentación`;
    const pricePerPresentation = parseFloat(product[productPrice].replace(/[$.]/g, '').replace(/,/, '.'));
    const totalPrice = pricePerPresentation * quantity;
    return totalPrice.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
};


  return (
    <div className='table'>
      <div className='name-category'>
      <h3>{showOrder ? 'PEDIDO' : (!selectedCategory || selectedCategory === 'TODOS LOS PRODUCTOS' ? 'TODOS LOS PRODUCTOS' : selectedCategory)}</h3>
      </div>
      <table id="table">
        <thead>
          <tr>
            <th className='cd'>CÓDIGO</th>
            <th className='th-prod'>PRODUCTO</th>
            <th className='center'>Unidad de medida</th>
            <th className='center'>Cantidad x pres.</th>
            <th className='center'>Peso X pres.</th>
            <th>Precio Unitario</th>
            <th>Precio x pres.</th>
            <th className='th-cant center highlight'>Cantidad</th>
            <th className='total'>Total x producto</th>
          </tr>
        </thead>
        <tbody>
          <tr id="inicio"></tr>
        {(showOrder ? order : displayedProducts).map(item => (

            <tr key={showOrder ? item.product.Código : item.Código}>
              <td className='small cd'>{showOrder ? item.product.Código : item.Código}</td>
              <td>{showOrder ? item.product.Producto : item.Producto}</td>
              <td className='center small'>{showOrder ? item.product.Presentación : item.Presentación}</td>
              <td className='center'>{showOrder ? item.product.Peso : item.Peso}</td>
              <td className='center'>{showOrder ? item.product['Cantidad x pres.'] : item['Cantidad x pres.']}</td>
              {renderTypeOfBuyerColumns(showOrder ? item.product : item)}
              <td>
              <input
                className='center'
                type="number"
                min="0"
                value={quantities[showOrder ? item.product.Código : item.Código] || ''}
                onChange={(e) => handleQuantityChange(showOrder ? item.product : item, parseInt(e.target.value, 10))}
                onBlur={(e) => {
                  if (parseInt(e.target.value, 10) === 0 || e.target.value === '') {
                    handleQuantityChange(showOrder ? item.product : item, 0);
                  }
                }}
                readOnly={showOrder && isFinalized}
                onFocus={(e) => {
                  if (showOrder && isFinalized) {
                    e.target.blur();
                  }
                }}
              />
              </td>
              <td className='total'>
                {quantities[showOrder ? item.product.Código : item.Código] > 0 
                  ? calculateTotalPrice(showOrder ? item.product : item, quantities[showOrder ? item.product.Código : item.Código]).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\B(?=(\d{3})+(?!\d))/g, ".") 
                  : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;