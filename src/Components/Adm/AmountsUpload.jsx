import React, { useState } from 'react'
import { useApi } from '../../Context/ApiProvider';

const AmountsUpload = () => {

    const { amounts, amountsValues, isLoading, dev, prod } = useApi();

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

    const [uploadStatus, setUploadStatus] = useState('');

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
        }

        try {
            const response = await fetch(`https://${dev}/API/index.php?action=save-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Data)
            });

            const data = await response.json();

            if (data.success) {
                setUploadStatus(`Mensajes actualizados correctamente. \n\nMinorista: ${updatedAmounts.minorista}. \nMayorista: ${updatedAmounts.mayorista}. \nDistribuidor: ${updatedAmounts.distribuidor}.`);
            } else {
                setUploadStatus(`Error al actualizar los mensajes: ${data.error}`);
            }
        } catch (error) {
            setUploadStatus('Ocurrió un error al actualizar los mensajes.');
        }

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
                        <label>Nuevo mensaje:</label>
                        <input
                            type="text"
                            value={newMinorista}
                            onChange={(e) => {setNewMinorista(e.target.value); uploadStatus('')}}
                        />
                    </span>
                    <span className='row price'>
                    <label>Mínimo:</label>
                        <input
                            type="number"
                            value={newMinoristaMin}
                            onChange={(e) => {setNewMinoristaMin(e.target.value); uploadStatus('')}}
                            placeholder={isLoading ? 'Cargando...' : getCategoryValue('minorista', 'minimo')}
                        />
                         <label>Máximo:</label>
                        <input
                            type="number"
                            value={newMinoristaMax}
                            onChange={(e) => {setNewMinoristaMax(e.target.value); uploadStatus('')}}
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
                        <label>Nuevo mensaje:</label>
                        <input
                            type="text"
                            value={newMayorista}
                            onChange={(e) =>{setNewMayorista(e.target.value); uploadStatus('')}}
                        />
                    </span>
                    <span className='row price'>
                    <label>Mínimo:</label>
                        <input
                            type="number"
                            value={newMayoristaMin}
                            onChange={(e) => {setNewMayoristaMin(e.target.value); uploadStatus('')}}
                            placeholder={isLoading ? 'Cargando...' : getCategoryValue('mayorista', 'minimo')}
                        />
                         <label>Máximo:</label>
                        <input
                            type="number"
                            value={newMayoristaMax}
                            onChange={(e) => {setNewMayoristaMax(e.target.value); uploadStatus('')}}
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
                        <label>Nuevo mensaje:</label>
                        <input
                            type="text"
                            value={newDistribuidor}
                            onChange={(e) => {setNewDistribuidor(e.target.value); uploadStatus('')}}
                        />
                    </span>
                    <span className='row price'>
                    <label>Mínimo:</label>
                        <input
                            type="number"
                            value={newDistribuidorMin}
                            onChange={(e) => {setNewDistribuidorMin(e.target.value); uploadStatus('')}}
                            placeholder={isLoading ? 'Cargando...' : getCategoryValue('distribuidor', 'minimo')}
                        />
                         <label>Máximo:</label>
                        <input
                            type="number"
                            value={newDistribuidorMax}
                            onChange={(e) => {setNewDistribuidorMax(e.target.value); uploadStatus('')}}
                            placeholder={isLoading ? 'Cargando...' : getCategoryValue('distribuidor', 'maximo')}
                        />
                    </span>
                </div>
                <button className="submit" type="submit">Actualizar</button>
            </form>
            <textarea readOnly value={uploadStatus} rows={4} cols={50} />
        </div>
    )
}

export default AmountsUpload
