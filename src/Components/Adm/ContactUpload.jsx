import React, { useState } from 'react'
import { useApi } from '../../Context/ApiProvider';

const ContactUpload = () => {

    const { contact, isLoading } = useApi();
    const [uploadStatus, setUploadStatus] = useState('');

    const [newDirecc, setNewDirecc] = useState('');
    const [newTel, setNewTel] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newShipment, setNewShipment] = useState('');

    const getCategoryMessage = (category) => {
        const categoryData = contact.find((item) => item.nombre === category);
        return categoryData ? categoryData.valor : '';
    };



    const handleUpdate = async (e) => {
        e.preventDefault();

        const updatedInfo = {
            direccion: newDirecc || getCategoryMessage('direccion'),
            telefono: newTel || getCategoryMessage('telefono'),
            email: newEmail || getCategoryMessage('email'),
            entrega: newShipment || getCategoryMessage('entrega')
        };

        try {
            const response = await fetch('http://localhost:80/DistribuidoraDarrona/Darrona/API/actualizar.php?action=shipments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedInfo)
            });

            const data = await response.json();

            if (data.success) {
                setUploadStatus(`Mensajes actualizados correctamente. \n\nDireccion: ${updatedInfo.direccion}. \nTeléfono: ${updatedInfo.telefono}. \nEmail: ${updatedInfo.email}.  \nEntregas: ${updatedInfo.entrega}`);
            } else {
                setUploadStatus(`Error al actualizar la información: ${data.error}`);
            }
        } catch (error) {
            setUploadStatus('Ocurrió un error al actualizar la información.');
        }

    };

    return (
        <div className='content'>
            <h5>Actualizar informacion de contacto.</h5>

            <form onSubmit={handleUpdate}>
                <div>
                    <h6>Dirección</h6>
                    <span className='row'>
                        <p>Mensaje actual:</p>
                        {isLoading ? <p>Cargando mensaje...</p> : <p className='current-msg'>"{getCategoryMessage('direccion')}"</p>}
                    </span>
                    <span className='row'>
                        <label>Nuevo mensaje:</label>
                        <input
                            type="text"
                            value={newDirecc}
                            onChange={(e) => {setNewDirecc(e.target.value); uploadStatus('')}}
                        />
                    </span>
                </div>
                <div>
                    <h6>Teléfono</h6>
                    <span className='row'>
                        <p>Mensaje actual:</p>
                        {isLoading ? <p>Cargando mensaje...</p> : <p className='current-msg'>"{getCategoryMessage('telefono')}"</p>}
                    </span>
                    <span className='row'>
                        <label>Nuevo mensaje:</label>
                        <input
                            type="text"
                            value={newTel}
                            onChange={(e) => {setNewTel(e.target.value); uploadStatus('')}}
                        />
                    </span>
                </div>
                <div>
                    <h6>Email</h6>
                    <span className='row'>
                        <p>Mensaje actual:</p>
                        {isLoading ? <p>Cargando mensaje...</p> : <p className='current-msg'>"{getCategoryMessage('email')}"</p>}
                    </span>
                    <span className='row'>
                        <label>Nuevo mensaje:</label>
                        <input
                            type="text"
                            value={newEmail}
                            onChange={(e) => {setNewEmail(e.target.value); uploadStatus('')}}
                        />
                    </span>
                </div>
                <div>
                    <h6>Horario de entrega</h6>
                    <span className='row'>
                        <p>Mensaje actual:</p>
                        {isLoading ? <p>Cargando mensaje...</p> : <p className='current-msg'>"{getCategoryMessage('entregas')}"</p>}
                    </span>
                    <span className='row'>
                        <label>Nuevo mensaje:</label>
                        <input
                            type="text"
                            value={newShipment}
                            onChange={(e) => {setNewShipment(e.target.value); uploadStatus('')}}
                        />
                    </span>
                </div>
                <button className="submit" type="submit">Actualizar</button>
            </form>
            <textarea readOnly value={uploadStatus} rows={4} cols={50} />
        </div>
    )
}

export default ContactUpload
