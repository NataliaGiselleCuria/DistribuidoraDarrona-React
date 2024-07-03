import React, { useEffect, useState } from 'react'
import { useApi } from '../../Context/ApiProvider';

const ShipmentsUpload = () => {

    const { shipments, isLoading, dev, prod } = useApi();

    const [newShipment, setNewShipment] = useState({ lugar: '', dia: '' });
    const [updatedShipments, setUpdatedShipments] = useState([]);

    const [uploadStatus, setUploadStatus] = useState('');

    useEffect(() => {
        if (!isLoading) {
            setUpdatedShipments(shipments);
        }
    }, [shipments, isLoading]);

    const handleAdd = () => {
        setUpdatedShipments([...updatedShipments, newShipment]);
        setNewShipment({ lugar: '', dia: '' });
        setUploadStatus('');
    };

    const handleDelete = (index) => {
        const newShipments = [...updatedShipments];
        newShipments.splice(index, 1);
        setUpdatedShipments(newShipments);
        setUploadStatus('');
    };

    const handleChange = (index, field, value) => {
        const newShipments = [...updatedShipments];
        newShipments[index][field] = value;
        setUpdatedShipments(newShipments);
        setUploadStatus('');
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://${prod}/API/actualizar.php?action=shipments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedShipments)
            });
            const data = await response.json();
            if (data.success) {
                setUploadStatus('Lugares y días de entrega actualizados correctamente.');
            } else {
                setUploadStatus(`Error al actualizar: ${data.error}`);
            }
        } catch (error) {
            setUploadStatus('Ocurrió un error al actualizar.');
        }
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
   
    <textarea readOnly value={uploadStatus} rows={4} cols={50} />
  </div>
  )
}

export default ShipmentsUpload
