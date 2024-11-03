import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FormOrder from './FormOrder';
import { OrderContext } from '../../Context/OrderProvider';
import { DataContext } from '../../Context/DataProvider';
import { ApiProvider } from '../../Context/ApiProvider';

const renderWithProviders = (ui, { orderValue, dataValue, apiValue } = {}) => {
    return render(
        <OrderContext.Provider value={orderValue}>
            <DataContext.Provider value={dataValue}>
                <ApiProvider value={apiValue}>
                    {ui}
                </ApiProvider>
            </DataContext.Provider>
        </OrderContext.Provider>
    );
};

test('should show error message if fields are empty', () => {
    renderWithProviders(<FormOrder />);

    fireEvent.click(screen.getByText('Enviar Pedido'));
    expect(screen.getByText(/complete todos los campos/i)).toBeInTheDocument();
});

test('should show error message if order is empty', () => {
    const mockOrderContext = {
        order: [],
        totalOrder: 0,
    };

    renderWithProviders(<FormOrder />, { orderValue: mockOrderContext });

    fireEvent.click(screen.getByText('Enviar Pedido'));
    expect(screen.getByText(/su pedido está vacío/i)).toBeInTheDocument();
});