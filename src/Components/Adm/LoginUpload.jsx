import React, { useState } from 'react';
import { useApi } from '../../Context/ApiProvider';

const LoginUpload = () => {

  const { dev, prod } = useApi()
  const [newUser, setNewUser] = useState('');
  const [newPass, setNewPass] = useState('');

  const [uploadStatus, setUploadStatus] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!newUser || !newPass) {
        setUploadStatus('Por favor, complete ambos campos: Usuario y Contraseña.');
        return;
    }

    try {
        const response = await fetch(`http://${prod}/API/actualizar.php?action=cred`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ usuario: newUser, clave: newPass })
        });
  
        const data = await response.json();
  
        if (data.success) {
            setUploadStatus(`Usuario y contraseña actualizados correctamente. \n\nUsuario: ${newUser} \nClave: ${newPass}`);
          
        } else {
            setUploadStatus(`Error en actualizar usuario y contraseña: ${data.error}`);
        }
      } catch (error) {
        setUploadStatus('Ocurrió un error al actualizar las credenciales de inicio de sesión.');
      }
    };

  return (
    <div className='content'>
      <h5>Actualizar usuario y contraseña.</h5>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Nuevo Usuario:</label>
          <input 
            type="text" 
            value={newUser} 
            onChange={(e) => setNewUser(e.target.value)} 
          />
        </div>
        <div>
          <label>Nueva Contraseña:</label>
          <input 
            type="password" 
            value={newPass} 
            onChange={(e) => setNewPass(e.target.value)} 
          />
        </div>
        <button className="submit" type="submit">Actualizar</button>
      </form>
      <textarea readOnly value={uploadStatus} rows={4} cols={50} />
    </div>
  );
};

export default LoginUpload;
