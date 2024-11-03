import React, { useEffect, useState } from 'react'
import { useApi } from '../../Context/ApiProvider';

const ShipmentsUpload = () => {

    const { shipments, isLoading, dev, prod } = useApi();

    const [newShipment, setNewShipment] = useState({ lugar: '', dia: '' });
    const [updatedShipments, setUpdatedShipments] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!isLoading) {
            setUpdatedShipments(shipments);
        }
    }, [shipments, isLoading]);

    const handleAdd = () => {
        setUpdatedShipments([...updatedShipments, newShipment]);
        setNewShipment({ lugar: '', dia: '' });
        setMessage('');
    };

    const handleDelete = (index) => {
        const newShipments = [...updatedShipments];
        newShipments.splice(index, 1);
        setUpdatedShipments(newShipments);
        setMessage('');
    };

    const handleChange = (index, field, value) => {
        const newShipments = [...updatedShipments];
        newShipments[index][field] = value;
        setUpdatedShipments(newShipments);
        setMessage('');
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${prod}/API/actualizar.php?action=shipments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedShipments)
            });
            const data = await response.json();
            if (data.success) {
                setMessage('<strong>Lugares y días de entrega actualizados correctamente</strong>.');
            } else {
                setMessage(`<strong>Error al actualizar</strong>: ${data.error}`);
            }
        } catch (error) {
            setMessage('<strong>Ocurrió un error al actualizar</strong>.');
        }

        setShowModal(true);
    };



    return (
        <div className='content'>
            <h5>Actualizar lugares y dias de entrega.</h5>
            {isLoading ? (
                <p></p>
            ) : (
                <form className='shipmets' onSubmit={handleUpdate}>
                    {updatedShipments.map((shipment, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                value={shipment.lugar}
                                onChange={(e) => handleChange(index, 'lugar', e.target.value)}
                            />
                            <input
                                className='day'
                                type="text"
                                value={shipment.dia}
                                onChange={(e) => handleChange(index, 'dia', e.target.value)}
                            />
                            <button className="btn-adm" type="button" onClick={() => handleDelete(index)}>Eliminar</button>
                        </div>
                    ))}
                    <div>
                        <input
                            type="text"
                            placeholder="Nuevo lugar"
                            value={newShipment.lugar}
                            onChange={(e) => setNewShipment({ ...newShipment, lugar: e.target.value })}
                        />
                        <input
                            className='day'
                            type="text"
                            placeholder="Nuevo día"
                            value={newShipment.dia}
                            onChange={(e) => setNewShipment({ ...newShipment, dia: e.target.value })}
                        />
                        <button className="btn-adm" type="button" onClick={handleAdd}>Agregar</button>
                    </div>
                    <button className="submit" type="submit">Actualizar</button>
                </form>
            )}

            {showModal && (
                <div className='modal-overlay'>
                    <div className='modal-content'>
                        <button className='button-list close' onClick={() => setShowModal(false)}>x</button>
                        <p dangerouslySetInnerHTML={{ __html: message.replace(/\n/g, '<br>') }}></p>
                        <button className='button-list' onClick={() => setShowModal(false)}>OK</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ShipmentsUpload
