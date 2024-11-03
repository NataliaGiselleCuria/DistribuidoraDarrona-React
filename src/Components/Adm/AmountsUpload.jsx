import React, { useState } from 'react'
import { useApi } from '../../Context/ApiProvider';

const AmountsUpload = () => {

    const { amounts, updateAmounts, amountsValues, updateAmountsValues, isLoading, dev, prod } = useApi();
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('');

    //msg
    const [newMinorista, setNewMinorista] = useState('');
    const [newMayorista, setNewMayorista] = useState('');
    const [newDistribuidor, setNewDistribuidor] = useState('');

    //values
    const [newMinoristaMin, setNewMinoristaMin] = useState('');
    const [newMinoristaMax, setNewMinoristaMax] = useState('');
    const [newMayoristaMin, setNewMayoristaMin] = useState('');
    const [newMayoristaMax, setNewMayoristaMax] = useState('');
    const [newDistribuidorMin, setNewDistribuidorMin] = useState('');
    const [newDistribuidorMax, setNewDistribuidorMax] = useState('');


    const getCategoryMessage = (category) => {
        const categoryData = amounts.find((item) => item.categoría === category);
        return categoryData ? categoryData.mensaje : '';
    };

    const getCategoryValue = (category, val) => {
        const categoryData = amountsValues.find((item) => item.categoría === category);
        return categoryData ? categoryData[val] : '';
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const updatedAmounts = {
            minorista: newMinorista || getCategoryMessage('minorista'),
            mayorista: newMayorista || getCategoryMessage('mayorista'),
            distribuidor: newDistribuidor || getCategoryMessage('distribuidor')
        };

        const updatedAmountsValues = {
            minoristaMin: newMinoristaMin || getCategoryValue('minorista', 'minimo'),
            minoristaMax: newMinoristaMax || getCategoryValue('minorista', 'maximo'),
            mayoristaMin: newMayoristaMin || getCategoryValue('mayorista', 'minimo'),
            mayoristaMax: newMayoristaMax || getCategoryValue('mayorista', 'maximo'),
            distribuidorMin: newDistribuidorMin || getCategoryValue('distribuidor', 'minimo'),
            distribuidorMax: newDistribuidorMax || getCategoryValue('distribuidor', 'maximo')
        };

        const Data = {
            updatedAmounts,
            updatedAmountsValues
        };
    
        try {
            const response = await fetch(`${prod}/API/actualizar.php?action=amounts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Data)
            });
    
            const result = await response.json();
    
            if (result.success) {

                setMessage(`<strong>Valores actualizados ✓</strong>\n\n<strong>Minorista</strong>: ${updatedAmounts.minorista}. \n<strong>Mayorista</strong>: ${updatedAmounts.mayorista}. \n<strong>Distribuidor</strong>: ${updatedAmounts.distribuidor}.`);
            } else {
                setMessage(`<strong>Error al actualizar los datos</strong>: ${result.error || 'undefined'}`);
            }
        } catch (error) {
            setMessage('<strong>Ocurrió un error al actualizar los datos</strong>.');
        }

        setShowModal(true);
        updateAmounts(updatedAmounts);
        updateAmountsValues(updatedAmountsValues);
    };

    return (
        <div className='content'>
            <h5>Actualizar montos mínimos.</h5>
            <div className='txt-amountsUpload'>
                <div>
                    <p>Complete el mensaje que se verá en la pagina de productos para cada categoría, y el monto mínimo y máximo de compra para cada uno, sin signos $, puntos, o comas.</p>
                </div>
                <div className='summary-cont'>
                    <div className='ml'><p className='summary'>RESUMEN DE PEDIDO</p><p className='price-summary'>$0.00</p></div>
                    <p className='minimum-purchase'>MINIMO DE COMPRA...</p>
                </div>
            </div>

            <form onSubmit={handleUpdate}>
                <div>
                    <h6>Minorista</h6>
                    <span className='row'>
                        <p>Mensaje actual:</p>
                        {isLoading ? <p>Cargando mensaje...</p> : <p className='current-msg'>"{getCategoryMessage('minorista')}"</p>}
                    </span>
                    <span className='row'>
                        <label htmlFor='new-minorista'>Nuevo mensaje:</label>
                        <input
                            id='new-minorista'
                            type="text"
                            value={newMinorista}
                            onChange={(e) => {setNewMinorista(e.target.value); setMessage('')}}
                        />
                    </span>
                    <span className='row price'>
                    <label htmlFor='new-minorista-min'>Mínimo:</label>
                        <input
                            id="new-minorista-min"
                            type="number"
                            value={newMinoristaMin}
                            onChange={(e) => {setNewMinoristaMin(e.target.value); setMessage('')}}
                            placeholder={isLoading ? 'Cargando...' : getCategoryValue('minorista', 'minimo')}
                        />
                         <label htmlFor='new-minorista-max'>Máximo:</label>
                        <input
                            id='new-minorista-max'
                            type="number"
                            value={newMinoristaMax}
                            onChange={(e) => {setNewMinoristaMax(e.target.value); setMessage('')}}
                            placeholder={isLoading ? 'Cargando...' : getCategoryValue('minorista', 'maximo')}
                        />
                    </span>
                </div>
                <div>
                    <h6>Mayorista</h6>
                    <span className='row'>
                        <p>Mensaje actual:</p>
                        {isLoading ? <p>Cargando mensaje...</p> : <p className='current-msg'>"{getCategoryMessage('mayorista')}"</p>}
                    </span>
                    <span className='row'>
                        <label htmlFor='new-mayorista'>Nuevo mensaje:</label>
                        <input
                            type="text"
                            value={newMayorista}
                            onChange={(e) =>{setNewMayorista(e.target.value); setMessage('')}}
                        />
                    </span>
                    <span className='row price'>
                    <label htmlFor='new-mayorista-min'>Mínimo:</label>
                        <input
                            id='new-mayorista-min'
                            type="number"
                            value={newMayoristaMin}
                            onChange={(e) => {setNewMayoristaMin(e.target.value); setMessage('')}}
                            placeholder={isLoading ? 'Cargando...' : getCategoryValue('mayorista', 'minimo')}
                        />
                         <label htmlFor='new-mayorista-max'>Máximo:</label>
                        <input
                            id='new-mayorista-max'
                            type="number"
                            value={newMayoristaMax}
                            onChange={(e) => {setNewMayoristaMax(e.target.value); setMessage('')}}
                            placeholder={isLoading ? 'Cargando...' : getCategoryValue('mayorista', 'maximo')}
                        />
                    </span>
                </div>
                <div>
                    <h6>Distribuidor</h6>
                    <span className='row'>
                        <p>Mensaje actual:</p>
                        {isLoading ? <p>Cargando mensaje...</p> : <p className='current-msg'>"{getCategoryMessage('distribuidor')}"</p>}
                    </span>
                    <span className='row'>
                        <label htmlFor='new-distribuidor'>Nuevo mensaje:</label>
                        <input
                            id='new-distribuidor'
                            type="text"
                            value={newDistribuidor}
                            onChange={(e) => {setNewDistribuidor(e.target.value); setMessage('')}}
                        />
                    </span>
                    <span className='row price'>
                    <label htmlFor='new-dist-min'>Mínimo:</label>
                        <input
                            id='new-dist-min'
                            type="number"
                            value={newDistribuidorMin}
                            onChange={(e) => {setNewDistribuidorMin(e.target.value); setMessage('')}}
                            placeholder={isLoading ? 'Cargando...' : getCategoryValue('distribuidor', 'minimo')}
                        />
                         <label htmlFor='new-dist-max'>Máximo:</label>
                        <input
                            id='new-dist-max'
                            type="number"
                            value={newDistribuidorMax}
                            onChange={(e) => {setNewDistribuidorMax(e.target.value); setMessage('')}}
                            placeholder={isLoading ? 'Cargando...' : getCategoryValue('distribuidor', 'maximo')}
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

export default AmountsUpload
