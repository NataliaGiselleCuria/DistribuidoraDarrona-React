import React, { useState } from 'react';
import { useApi } from '../../Context/ApiProvider';

const LoginUpload = () => {

  const { dev, prod } = useApi()
  const [newUser, setNewUser] = useState('');
  const [newPass, setNewPass] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!newUser || !newPass) {
        setMessage('<strong>Por favor, complete ambos campos: Usuario y Contraseña.</strong>');
        setShowModal(true);
        return;
    }

    try {
        const response = await fetch(`${prod}/API/actualizar.php?action=cred`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ usuario: newUser, clave: newPass })
        });
  
        const data = await response.json();
  
        if (data.success) {
            setMessage(`<strong>Usuario y contraseña actualizados correctamente.</strong> \n\nUsuario: ${newUser} \nClave: ${newPass}`);
          
        } else {
            setMessage(`<strong>Error en actualizar usuario y contraseña</strong>: ${data.error}`);
        }
      } catch (error) {
        setMessage('<strong>Ocurrió un error al actualizar las credenciales de inicio de sesión</strong>.');
      }

      setShowModal(true);

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

export default LoginUpload;
