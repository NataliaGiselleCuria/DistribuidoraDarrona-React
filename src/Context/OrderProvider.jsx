import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {

  const [order, setOrder] = useState([]);
  const [totalOrder, setTotalOrder] = useState(0);

  const resetOrder = () => {
    setOrder([]);
  };
  
  const totalOrderFormat = totalOrder.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

  const addToOrder = (product, quantity, totalProduct) => {
    setOrder((prevOrder) => {

      const existingProductIndex = prevOrder.findIndex(item => item.product.Código === product.Código);

      if (existingProductIndex > -1) {
        if (quantity === 0 && quantity === '') {
          // Si la cantidad es cero, elimina el producto del pedido
          return prevOrder.filter(item => item.product.Código !== product.Código);
        } else {
          // Actualizar producto existente
          const updatedOrder = [...prevOrder];
          updatedOrder[existingProductIndex] = {
            ...updatedOrder[existingProductIndex],
            quantity,
            totalProduct: parseFloat(totalProduct.replace(/[$.]/g, '').replace(/,/, '.')),
          };
          return updatedOrder;
        }
      } else {
        // Agregar nuevo producto si la cantidad es mayor que cero
        if (quantity > 0) {
          return [
            ...prevOrder,
            { product, quantity, totalProduct: parseFloat(totalProduct.replace(/[$.]/g, '').replace(/,/, '.')) },
          ];
        }                                                            

        return prevOrder; // Si la cantidad es cero, no agrega el producto
      }
    }); 
  };

  const removeFromOrder = (product) => {
    setOrder(prevOrder => prevOrder.filter(item => item.product.Código !== product.Código));
};

  useEffect(() => {
    if (order.length === 0) {
      setTotalOrder(0);
    } else {
      const total = order.reduce((acc, item) => acc + item.totalProduct, 0);
      setTotalOrder(total);
    }
  }, [order]);

  const value = useMemo(() => ({
    order, 
    addToOrder,
    totalOrder,
    totalOrderFormat,
    removeFromOrder,
    resetOrder
  }), 
  [
    order, 
    addToOrder,
    totalOrder,
    totalOrderFormat,
    removeFromOrder,
    resetOrder
  ]);

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
    return useContext(OrderContext);
  };