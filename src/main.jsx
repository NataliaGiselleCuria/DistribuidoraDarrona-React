import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { DataProvider } from './Context/DataProvider.jsx'
import { OrderProvider } from './Context/OrderProvider.jsx'
import { ApiProvider } from './Context/ApiProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApiProvider>
      <DataProvider>
        <OrderProvider>
          <App />
        </OrderProvider>
      </DataProvider>
    </ApiProvider>
  </React.StrictMode>
)
