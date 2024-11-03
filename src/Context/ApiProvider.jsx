import { useState, useEffect, createContext, useContext, useMemo, useCallback } from 'react';

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {

  const [products, setProducts] = useState([]);
  const [amounts, setAmounts] = useState([]);
  const [amountsValues, setAmountsValues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loginCred, setLoginCred] = useState({ usuario: '', clave: '' });
  const [contact, setContact] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [listOrders, setListOrders] = useState([]);

  const dev = 'http://localhost/DistribuidoraDarrona';
  const prod = 'https://darrona-pedidos.free.nf'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, amountsRes, amountsValuesRes, loginRes, contactRes, shipmentsRes, ordersRes] = await Promise.all([
          fetch(`${prod}/API/index.php?action=productos`),
          fetch(`${prod}/API/index.php?action=montominimo`),
          fetch(`${prod}/API/index.php?action=montos`),
          fetch(`${prod}/API/index.php?action=login`),
          fetch(`${prod}/API/index.php?action=contact`),
          fetch(`${prod}/API/index.php?action=shipments`),
          fetch(`${prod}/API/index.php?action=orders`)
        ]);

        if (!productsRes.ok || !amountsRes.ok || !amountsValuesRes.ok || !loginRes.ok || !contactRes.ok || !shipmentsRes.ok || !ordersRes.ok) {
          throw new Error('One or more responses were not ok');
        }

        const [productsData, amountsData, amountsValuesData, loginData, contactData, shipmentsData, ordersData] = await Promise.all([
          productsRes.json(),
          amountsRes.json(),
          amountsValuesRes.json(),
          loginRes.json(),
          contactRes.json(),
          shipmentsRes.json(),
          ordersRes.json()
        ]);

        setProducts(productsData);
        setAmounts(amountsData);
        setAmountsValues(amountsValuesData);
        setLoginCred(loginData);
        setContact(contactData);
        setShipments(shipmentsData);
        setListOrders(ordersData);
        setIsLoading(false);

      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false); // Asegúrate de actualizar el estado de carga incluso si hay un error
      }
    };

    fetchData();
  }, []);

  const updateContact = (updatedInfo) => {
    setContact(prevContact =>
      prevContact.map(item => {
        if (item.nombre === 'direccion') return { ...item, valor: updatedInfo.direccion };
        if (item.nombre === 'telefono') return { ...item, valor: updatedInfo.telefono };
        if (item.nombre === 'email') return { ...item, valor: updatedInfo.email };
        if (item.nombre === 'entregas') return { ...item, valor: updatedInfo.entrega };
        return item;
      })
    );
  };

  const updateAmounts = (updatedInfo) => {
    setAmounts(prevAmounts =>
      prevAmounts.map(item => {
        if (item.categoría === 'minorista') return { ...item, mensaje: updatedInfo.minorista };
        if (item.categoría === 'mayorista') return { ...item, mensaje: updatedInfo.mayorista };
        if (item.categoría === 'distribuidor') return { ...item, mensaje: updatedInfo.distribuidor };
        return item;
      })
    );
  };

  const updateAmountsValues = (updatedValues) => {
    setAmountsValues(prevAmountsValues =>
      prevAmountsValues.map(item => {
        if (item.categoría === 'minorista') return { ...item, minimo: updatedValues.minoristaMin, maximo: updatedValues.minoristaMax };
        if (item.categoría === 'mayorista') return { ...item, minimo: updatedValues.mayoristaMin, maximo: updatedValues.mayoristaMax };
        if (item.categoría === 'distribuidor') return { ...item, minimo: updatedValues.distribuidorMin, maximo: updatedValues.distribuidorMax };
        return item;
      })
    );
  };

  const deleteOrder = useCallback(async (orderId) => {
    try {
      const response = await fetch(`${prod}/API/index.php?action=delete-order`, {
        method: 'POST', // Cambiado a POST
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_pedido: orderId })
      });

      if (response.ok) {
        const updatedOrders = listOrders.filter(order => order.id_pedido !== orderId);
        setListOrders(updatedOrders);
      } else {
        console.error('Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  }, [listOrders]);

  const updateSeenStatus = useCallback(async (orderId, seen) => {
    const dataSend = {
      id_pedido: orderId,
      seen: seen
    };

    try {
      const response = await fetch(`${prod}/API/index.php?action=update-seen-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataSend)
      });

      if (response.ok) {
        const updatedOrders = listOrders.map(order =>
          order.id_pedido === orderId ? { ...order, visto: seen } : order
        );
        setListOrders(updatedOrders);
      } else {
        const errorData = await response.json();
        console.error('Failed to update seen status:', errorData.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, [listOrders]);

  const value = useMemo(() => ({
    products,
    amounts,
    updateAmounts,
    amountsValues,
    updateAmountsValues,
    isLoading,
    loginCred,
    contact,
    updateContact,
    shipments,
    listOrders,
    updateSeenStatus,
    deleteOrder,
    dev,
    prod
  }),
    [
      products,
      amounts,
      updateAmounts,
      amountsValues,
      updateAmountsValues,
      isLoading,
      loginCred,
      contact,
      updateContact,
      shipments,
      listOrders,
      updateSeenStatus,
      deleteOrder,
      dev,
      prod,
    ]);

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  return useContext(ApiContext);
};