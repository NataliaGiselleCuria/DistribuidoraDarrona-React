import React, { useState } from 'react';
import { useApi } from '../../Context/ApiProvider';
import excel from '../../excel/productos-plantilla-modelo.xlsx';

const FileUpload = () => {
  const { dev, prod } = useApi()
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    setMessage('');
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage('<strong>Por favor, seleccione un archivo CSV</strong>');
      setShowModal(true);
      return;
    }

    const formData = new FormData();
    formData.append('fileInput', file);

    try {
      const response = await fetch(`${prod}/API/upload.php`, {
        method: 'POST',
        body: formData
      });

      const responseData = await response.json(); // Parsear la respuesta JSON

      if (response.ok && responseData.status === 'success') {
        setMessage('<strong>¡Archivo CSV subido exitosamente!</strong>');

      } else if (responseData && responseData.status === 'error') {
        setMessage(`<strong>Error</strong>: \n${responseData.message}`);

      } else {

        setMessage('<strong>Error al subir el archivo CSV. Por favor, intente de nuevo.</strong>');
      }

    } catch (error) {
      setMessage('<strong>Error al subir el archivo CSV.</strong> ' + error.message);

    }

    setShowModal(true);
  };

  return (
    <div className='content'>
      <h5>Actualizar productos.</h5>
      <div>
        <p>Para que la tabla se actualice de forma correcta:</p>
        <p>- Descargar el siguiente Excel.</p>
        <p>- No modificar el nombre de la cabecera.</p>
        <p>- Rellenar el contenido de la tabla con la lista actualizada</p>
        <p>- No dejar casillas vacías.</p>
        <p>- Guardar y subir el archivo en formato CSV.</p>
      </div>
      <a href={excel} download="productos-plantilla-modelo.xlsx">
        <button className="btn-adm">Descargar Exel</button>
      </a>
      <form onSubmit={handleFileUpload} className='csv'>
        <div>
          <label htmlFor='fileInput'>
            <input className="file" type="file" accept=".csv" name="fileInput" id='fileInput' onChange={handleFileChange} />
          </label>
        </div>

        <button className="submit" type="submit">Subir</button>
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
  );
};

export default FileUpload;