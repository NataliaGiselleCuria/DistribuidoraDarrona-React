import React, { useState } from 'react'
import { useApi } from '../../Context/ApiProvider'
import dw from '../../assets/download.png'
import img from '../../assets/adm2.png'
import * as XLSX from 'xlsx';
import trash from '../../assets/trash.png'

const ViewOrders = () => {

    const { listOrders, updateSeenStatus, deleteOrder } = useApi();
    const [expandedOrder, setExpandedOrder] = useState(null);

    const toggleExpand = async (index, orderId) => {
        if (expandedOrder !== index) {
            await updateSeenStatus(orderId, 1); // Marcar como visto al expandir
        }
        setExpandedOrder(expandedOrder === index ? null : index);
    };

    const handleDeleteOrder = async (orderId) => {
        await deleteOrder(orderId);
    };

    const sortedOrders = listOrders?.slice().sort((a, b) => new Date(b.fecha_pedido) - new Date(a.fecha_pedido));

    const downloadOrderAsExcel = (order) => {
        const wb = XLSX.utils.book_new();

        const clientData = [
            ['Datos del Cliente'],
            ['Nombre', order.nombre_cliente],
            ['Teléfono', order.telefono_cliente],
            ['Email', order.email_cliente],
            ['Dirección', order.direccion_cliente],
            ['Tipo de pedido', order.tipo_comprador],
            ['Total del pedido', order.total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\B(?=(\d{3})+(?!\d))/g, ".")],
            [],
            ['Detalle del Pedido']
        ];

        const wsData = [
            ['Código', 'Producto', 'Cantidad', 'Total']
        ];

        JSON.parse(order.detalle || '[]').forEach(item => {
            wsData.push([
                item.product?.Código,
                item.product?.Producto,
                item.quantity,
                item.totalProduct?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            ]);
        });

        const ws = XLSX.utils.aoa_to_sheet([...clientData, ...wsData]);
        XLSX.utils.book_append_sheet(wb, ws, 'Pedido');

        XLSX.writeFile(wb, `Pedido_${order.id_pedido}.xlsx`);
    };

  return (
    <div>
       <span className="title"><img src={img} alt="almendras"/><h3>Lista de Pedidos</h3></span>
           <ul>
           <li className="list-orders-head">
                        <div className='order-cont'>
                            <span className='order-head'>
                                <p> FECHA</p>
                                <p> CLIENTE</p>
                                <p> TOTAL</p>
                            </span>
                        </div>
                    </li>
                {sortedOrders?.map((order, index) => (
                     <li key={index} className={`order-item ${expandedOrder === index ? 'expanded' : ''} ${!order?.visto ? 'new-order' : ''}`}>
                        <div className='order-cont'>
                            <span className='order-head'>
                                <p> {order?.fecha_pedido}</p>
                                <p> {order?.nombre_cliente}</p>
                                <p> ${order?.total}</p>
                                <p>{order?.tipo_comprador}</p>
                                <div className='new-order-alert'><p>NUEVO</p></div>
                                <div 
                                    className={`toggle-btn clearfix ${expandedOrder === index ? 'hide-toggle' : ''}`} 
                                    onClick={() => toggleExpand(index, order?.id_pedido)}
                                >
                                    <div className="arrow-open-close"></div>
                                </div>
                                <button className='delete' onClick={() => handleDeleteOrder(order?.id_pedido)}><img src={trash} alt="icono eliminar"/></button>
                            </span>
                            {expandedOrder === index && (
                                <>
                                    <span>
                                        <p><strong>Teléfono:</strong> {order?.telefono_cliente}</p>
                                        <p><strong>Email:</strong> {order?.email_cliente}</p>
                                        <p><strong>Dirección:</strong> {order?.direccion_cliente}</p>
                                    </span>
                                    <span className='order-detail'>
                                        <p><strong>Detalle del Pedido:</strong></p>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Código</th>
                                                    <th>Producto</th>
                                                    <th className='center'>Pres.</th>
                                                    <th className='center'>Peso</th>
                                                    <th className='center'>Cant x Pres.</th>
                                                    <th className='center'>Cantidad</th>
                                                    <th className='center'>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {JSON.parse(order?.detalle || '[]')?.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td className='small'>{item?.product?.Código}</td>
                                                        <td>{item?.product?.Producto}</td>
                                                        <td className='center small'>{item?.product?.Presentación}</td>
                                                        <td className='center small'>{item?.product?.Peso}</td>
                                                        <td className='center small'>{item?.product?.['Cantidad x pres.']}</td>
                                                        <td className='center'>{item?.quantity}</td>
                                                        <td className='center'>${item?.totalProduct?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </span>
                                    <button className="download-order"onClick={() => downloadOrderAsExcel(order)}> <img src={dw} alt="Descargar"/>Descargar pedido en Excel</button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
    </div>
  )
}

export default ViewOrders
