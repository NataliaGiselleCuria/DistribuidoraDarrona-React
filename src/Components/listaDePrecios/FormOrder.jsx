import React, { useState, useContext, useEffect } from 'react';
import { OrderContext } from '../../Context/OrderProvider';
import { useApi } from '../../Context/ApiProvider';
import { DataContext } from '../../Context/DataProvider';
import img2 from '../../assets/form-order-img2.png'
import img3 from '../../assets/form-order-img3.png'
import img4 from '../../assets/form-order-img4.png'
import img5 from '../../assets/form-order-img5.png'
import img6 from '../../assets/form-order-img6.png'
import img7 from '../../assets/form-order-img7.png'

const FormOrder = () => {

    const { tableType } = useContext(DataContext)
    const { order, totalOrder } = useContext(OrderContext)
    const { contact, amountsValues, dev, prod } = useApi();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showOkButton, setShowOkButton] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [disableSubmitButton, setDisableSubmitButton] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        nombre_cliente: '',
        email_cliente: '',
        telefono_cliente: '',
        direccion_cliente: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const minimumPurchase = () => {
        const typeBuyer = amountsValues.find((amount) => amount.categoría === tableType);
        const minimumAmount = typeBuyer.minimo
        return minimumAmount;
    };

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const response = await fetch(`${prod}/API/index.php?action=ping`);
                if (!response.ok) throw new Error('Error en conexión');
            } catch (error) {
                console.error('Error de conexión:', error);
                setShowModal(true);
                setMessage('Problema de conexión al servidor. Por favor, intente nuevamente más tarde.');
            }
        };
    
        checkConnection();
    }, []);

    const handleSubmit = () => {
       

        if (!tableType || !order || !contact) {
            setMessage('Por favor, completa todos los campos requeridos.');
            setShowModal(true);
            return;
        }

        const { nombre_cliente, email_cliente, telefono_cliente, direccion_cliente } = formData;

        if (!nombre_cliente || !email_cliente || !telefono_cliente || !direccion_cliente) {
            setMessage('Por favor, complete todos los campos antes de enviar el pedido.');
            setShowModal(true);
            return;
        }

        if (order.length === 0) {
            setMessage('Su pedido está vacío. Por favor, añada productos antes de enviarlo.');
            setShowModal(true);
            return;
        }

        if (totalOrder < minimumPurchase()) {
            setMessage('Su pedido no alcanza el monto mínimo. Los valores pueden modificarse al momento del pago.<br/>Acepte para enviar de todas formas o siga agregando productos.');
            setShowModal(true);
            setShowConfirmation(true);
            return;
        }

        submitOrder();
        setMessage('')
        setShowModal(false);
    };

    const submitOrder = async () => {
        setShowConfirmation(false);
        setShowModal(true);
        setLoading(true);
        setMessage('Enviando pedido, por favor espere...');
        setDisableSubmitButton(true);

        const pedido = {
            ...formData,
            fecha_pedido: new Date().toISOString().split('T')[0], // Fecha en formato YYYY-MM-DD
            detalle: JSON.stringify(order),
            total_pedido: totalOrder,
            visto: false,
            tipo_comprador: tableType
        };

        const cont = {
            email: contact.find(item => item.nombre === 'email').valor,
            telefono: contact.find(item => item.nombre === 'telefono').valor
        };

        const dataToSend = {
            ...pedido,
            ...cont
        };


        try {
            const response = await fetch(`${prod}/API/index.php?action=save-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setShowModal(true);
                setMessage('Pedido enviado exitosamente!<br/>Pronto recibirá un email de confirmación con el detalle del pedido.');
                setShowConfirmation(false);
                setShowOkButton(true);
            } else {
                setShowModal(true);
                setMessage('Error al enviar el pedido. Por favor intentelo nuevamente');
                setDisableSubmitButton(false);
            }

        } catch (error) {
            console.error('Error:', error);
            setShowModal(true);
            setMessage(`Error al conectar con el servidor: ${error.message}`);
            setDisableSubmitButton(false);
        } finally {
            setLoading(false);
        }
    };

    const handleOkClick = () => {
        window.location.reload();
    };

    const images = [img2, img3, img4, img5, img6, img7];
    const [selectedImage, setSelectedImage] = useState(img2);

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * images.length);
        const img = images[randomIndex];

        const imgElement = new Image();
        imgElement.src = img;
        imgElement.onload = () => setSelectedImage(img);
        imgElement.onerror = () => setSelectedImage(img2);
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
        if (showOkButton) {
            handleOkClick();
        }
    };

    return (
        <>
            <section className='form-order' id="form">
                {selectedImage && <img src={selectedImage} alt='producto dietético' />}
                <span className='txt-cont'>
                    <div className='txt'>
                        <h5>Ingrese sus datos para finalizar el pedido.</h5>
                        <p>Nos comunicaremos a la brevedad para concretar la venta.</p>
                    </div>
                    <div className="form-order">
                        <span>
                            <div>
                                <label htmlFor='nombre_cliente'>Nombre:</label>
                                <input type="text" name="nombre_cliente" value={formData.nombre_cliente} onChange={handleChange} required />
                            </div>
                            <div>
                                <label htmlFor='email_cliente'>Email:</label>
                                <input type="email" name="email_cliente" value={formData.email_cliente} onChange={handleChange} required />
                            </div>
                        </span>
                        <span>
                            <div>
                                <label htmlFor='telefono_cliente'>Teléfono:</label>
                                <input type="tel" name="telefono_cliente" value={formData.telefono_cliente} onChange={handleChange} required />
                            </div>
                            <div>
                                <label htmlFor='direccion_cliente'>Dirección:</label>
                                <input type="text" name="direccion_cliente" value={formData.direccion_cliente} onChange={handleChange} required />
                            </div>
                        </span>
                        <button
                            className={`button-list add-more-p ${disableSubmitButton ? 'disabled' : ''}`}
                            onClick={handleSubmit}>Enviar Pedido</button>

                    </div>
                    {showModal && (
                        <div className='modal-overlay'>
                            <div className='modal-content'>
                            <button className='button-list close' onClick={() => setShowModal(false)}>x</button>
                       
                                <p dangerouslySetInnerHTML={{ __html: message }} />
                                {showOkButton ? (
                                    <button className='button-list' onClick={handleCloseModal}>OK</button>
                                ) : (
                                    <div>
                                        {showConfirmation && (
                                            <>
                                                <button className="button-list" onClick={submitOrder}>Enviar de todas formas</button>
                                                <button className="button-list" onClick={() => setShowModal(false)}>Agregar más productos</button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>  
                        </div>
                    )}
                </span>
            </section>

        </>
    );
};

export default FormOrder
