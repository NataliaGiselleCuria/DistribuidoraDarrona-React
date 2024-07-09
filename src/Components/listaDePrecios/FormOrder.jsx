import React, { useState, useContext, useEffect } from 'react';
import { OrderContext } from '../../Context/OrderProvider';
import { useApi } from '../../Context/ApiProvider';
import { DataContext } from '../../Context/DataProvider';
import img from '../../assets/form-order-img.png'
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
    const [ loading, setLoading ] = useState(false);
    const [ message, setMessage ] = useState('');
    const [ showOkButton, setShowOkButton ] = useState(false);
    const [ disableSubmitButton, setDisableSubmitButton ] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (order.length === 0) {
            setMessage('Su pedido está vacío. Por favor, añada productos antes de enviarlo.');
            return;
        }

        if(totalOrder < minimumPurchase()){

            setMessage('Su pedido no alcanza el monto mínimo. Por favor, añada productos antes de enviarlo.');
            return;
            
        }

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
        }

        const dataToSend = {
            ...pedido,
            ...cont
        };

        try {   
            const response = await fetch(`https://${dev}/API/index.php?action=save-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });

            if (response.ok) {
                setMessage('Pedido enviado exitosamente!<br/>Pronto recibirá un email de confirmacion con el detalle del pedido.');
                setShowOkButton(true);
            } else {
                setMessage('Error al enviar el pedido');
                setDisableSubmitButton(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Error al conectar con el servidor');
            setDisableSubmitButton(false);
        } finally {
            setLoading(false);
        }      
    };

    const handleOkClick = () => {
        window.location.reload();
    };

    const images = [ img2, img3, img4, img5, img6, img7];
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * images.length);
        setSelectedImage(images[randomIndex]);
    }, []);

    return (
        <form className='form-order' onSubmit={handleSubmit}>
            {selectedImage && <img src={selectedImage} alt='producto dietético' />}
            <span className='txt-cont'>
            <div className='txt'>
                <h5>Ingrese sus datos para finalizar el pedido.</h5>
                <p>Nos comunicaremos a la brevedad para concretar la venta.</p>
            </div>
            <div className="form-order">
                <span>
                    <div>
                        <label>Nombre:</label>
                        <input type="text" name="nombre_cliente" value={formData.nombre_cliente} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="email" name="email_cliente" value={formData.email_cliente} onChange={handleChange} required />
                    </div>
                </span>
                <span>
                    <div>
                        <label>Teléfono:</label>
                        <input type="tel" name="telefono_cliente" value={formData.telefono_cliente} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Dirección:</label>
                        <input type="text" name="direccion_cliente" value={formData.direccion_cliente} onChange={handleChange} required />
                    </div>
                </span>
                <button 
                    className={`button-list add-more-p ${disableSubmitButton ? 'disabled' : ''}`} 
                    type="submit">Enviar Pedido</button>
                <span className='msg-send-order'>
                    {loading && <p>{message}</p>}
                    {!loading && message &&  <p dangerouslySetInnerHTML={{ __html: message }} />}
                    {!loading && showOkButton && (
                        <button className='button-list' onClick={handleOkClick}>OK</button>
                    )}
                </span>
            </div>
            </span>
        </form>
    );
};

export default FormOrder
