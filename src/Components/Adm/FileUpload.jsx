import React, { useState } from 'react';
import { useApi } from '../../Context/ApiProvider';

const FileUpload = () => {
  const { dev, prod } = useApi()
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    setUploadStatus('');
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      setUploadStatus('Por favor, seleccione un archivo CSV');
      return;
    }

    const formData = new FormData();
    formData.append('fileInput', file);

    try {
      const response = await fetch(`https://${prod}/API/upload.php`, {
        method: 'POST',
        body: formData
      });

      const responseData = await response.json(); // Parsear la respuesta JSON

      if (response.ok && responseData.status === 'success') {
        setUploadStatus('¡Archivo CSV subido exitosamente!');
      } else if (responseData && responseData.status === 'error') {
        setUploadStatus(`Error: ${responseData.message}`);
      } else {
        setUploadStatus('Error al subir el archivo CSV. Por favor, intente de nuevo.');
      }
    } catch (error) {
      console.error('Error al subir el archivo CSV:', error);
      setUploadStatus('Error al subir el archivo CSV. ' + error.message);
    }
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
      
      <form onSubmit={handleFileUpload} className='csv'>
      <div>
          <a href="excel/productos-plantilla-modelo.xlsx" download="productos-plantilla-modelo.xlsx">
              <button className="btn-adm">Descargar Exel</button>
          </a>
          <label>
            <input className="file" type="file" accept=".csv" name="fileInput" onChange={handleFileChange} />
          </label>
      </div>
        
        <button className="submit" type="submit">Subir</button>
      </form>
      <textarea readOnly value={uploadStatus} rows={4} cols={50} />
    </div>
  );
};

export default FileUpload;