import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { DataProvider } from './Context/DataProvider.jsx'
import { OrderProvider } from './Context/OrderProvider.jsx'
import { ApiProvider } from './Context/ApiProvider.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <ApiProvider>
    <DataProvider>
      <OrderProvider>
        <App />
      </OrderProvider>
    </DataProvider>
  </ApiProvider>
</React.StrictMode>
);

reportWebVitals();
