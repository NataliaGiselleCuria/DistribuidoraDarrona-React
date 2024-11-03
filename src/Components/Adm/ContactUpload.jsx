import React, { useState } from 'react'
import { useApi } from '../../Context/ApiProvider';

const ContactUpload = () => {

    const { contact, updateContact, isLoading, dev, prod } = useApi();
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('');

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
            entrega: newShipment || getCategoryMessage('entregas')
        };

        try {
            const response = await fetch(`${prod}/API/actualizar.php?action=contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedInfo)
            });

            const data = await response.json();

            if (data.success) {
                setMessage(`<strong>Información actualizada correctamente  ✓</strong> \n\n<strong>Direccion</strong>: ${updatedInfo.direccion}. \n<strong>Teléfono</strong>: ${updatedInfo.telefono}. \n<strong>Email</strong>: ${updatedInfo.email}.  \n<strong>Entregas</strong>: ${updatedInfo.entrega}`);
                updateContact(updatedInfo);
            } else {
                setMessage(`<strong>Error al actualizar la información</strong>: ${data.error}`);
            }
        } catch (error) {
            setMessage('<strong>Ocurrió un error al actualizar la información</strong>.');
        }

        setShowModal(true);

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
                        <label htmlFor='new-direcc'>Nuevo mensaje:</label>
                        <input
                            id='new-direcc'
                            type="text"
                            value={newDirecc}
                            onChange={(e) => {setNewDirecc(e.target.value); setMessage('')}}
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
                        <label htmlFor='new-tel'>Nuevo mensaje:</label>
                        <input
                            id='new-tel'
                            type="text"
                            value={newTel}
                            onChange={(e) => {setNewTel(e.target.value); setMessage('')}}
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
                        <label htmlFor='new-email'>Nuevo mensaje:</label>
                        <input
                            id='new-email'
                            type="text"
                            value={newEmail}
                            onChange={(e) => {setNewEmail(e.target.value); setMessage('')}}
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
                        <label htmlFor='new-shipment'>Nuevo mensaje:</label>
                        <input
                            id='new-shipment'
                            type="text"
                            value={newShipment}
                            onChange={(e) => {setNewShipment(e.target.value); setMessage('')}}
                        />
                    </span>
                </div>
                <button className="submit" type="submit">Actualizar</button>
            </form>
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

export default ContactUpload
