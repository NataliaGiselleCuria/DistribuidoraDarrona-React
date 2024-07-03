import { useState, useEffect, createContext, useContext, useMemo } from 'react';

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

  const dev = 'localhost/DistribuidoraDarrona/Darrona';
  const prod = 'darrona-api.free.nf'

  useEffect(() => {
    fetch(`https://${prod}/API/index.php?action=productos`)  
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
     .then(data => {
        setProducts(data);
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
      
  }, []);

  useEffect(() => {
    fetch(`https://${prod}/API/index.php?action=montominimo`)      
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
     .then(data => {
        setAmounts(data);
        setIsLoading(false);
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  }, []);

  useEffect(() => {
    fetch(`https://${prod}/API/index.php?action=montos`)      
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
     .then(data => {
        setAmountsValues(data);
        setIsLoading(false);
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  }, []);

  useEffect(() => {
    fetch(`https://${prod}/API/index.php?action=login`)      
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
     .then(data => {
      setLoginCred(data);
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  }, [])
  
  useEffect(() => {
    fetch(`https://${prod}/API/index.php?action=contact`)      
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
     .then(data => {
      setContact(data);
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  }, [])

  useEffect(() => {
    fetch(`https://${prod}/API/index.php?action=shipments`)      
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
     .then(data => {
      setShipments(data);
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  }, [])

  useEffect(() => {
    fetch(`https://${prod}/API/index.php?action=orders`)      
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
     .then(data => {
      setListOrders(data);
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  }, [])


  const updateSeenStatus = async (orderId, seen) => {
 
    const dataSend = {
      id_pedido: orderId,
      seen: seen
    }

    try {
        const response = await fetch(`https://${prod}/API/index.php?action=update-seen-status`, {
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
};

  const value = useMemo(() => ({
    products,
    amounts,
    amountsValues,
    isLoading,
    loginCred,
    contact,
    shipments,
    listOrders,
    updateSeenStatus,
    dev,
    prod
  }), 
  [
    products,
    amounts,
    amountsValues,
    isLoading,
    loginCred,
    contact,
    shipments,
    listOrders,
    updateSeenStatus,
    dev,
    prod
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