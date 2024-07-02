import React, { useState } from 'react';
import '../../index.css';
import { useApi } from '../../Context/ApiProvider';
import Adm from '../Adm/Adm.jsx';
import CryptoJS from 'crypto-js';



const Login = () => {
    const { loginCred } = useApi();

    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    function sha256(message) {
        const hash = CryptoJS.SHA256(message);
        return hash.toString(CryptoJS.enc.Hex);
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        const hash = sha256(pass);
        if (user === loginCred[0].usuario && hash === loginCred[0].clave) {
            setIsAuthenticated(true);
            setError(''); // Clear any previous error
        } else {
            setError('Usuario o contraseña incorrectos');
            console.log(loginCred);
        }
    };

    return (
        <>
            <div className="nav"></div> 
            <section className={`cont adm login ${isAuthenticated ? 'authenticated' : ''}`}>
            {!isAuthenticated ? (
                <>
                <div className="img-cont"><img src="\src\assets\Darrona.png" alt="Logo Distribuidora Darrona - Alimentos Naturales."></img></div>
                <h1><span>DISTRIBUIDORA DARRONA</span><span>HERRAMIENTA DE ADMINISTRADOR</span></h1>
                <form onSubmit={handleLogin}>
                    <span className="label">
                        <label htmlFor="usuario">Usuario<p className="asterisco"> * </p>:</label>
                        <input
                            type="text"
                            id="usuario"
                            name="usuario"
                            className="form-control"
                            value={user}
                            onChange={(e) => {setUser(e.target.value); setError('');}}
                            required
                        />
                    </span>
                    <span className="label">
                        <label htmlFor="clave">Contraseña<p className="asterisco"> * </p>:</label>
                        <input
                            type="password"
                            id="clave"
                            name="clave"
                            className="form-control"
                            value={pass}
                            onChange={(e) => {setPass(e.target.value);setError('');}}
                            required
                        />
                    </span>
                    <div className='error'>
                        {error && <span className="label log-error">{error}</span>} 
                    </div>
                    <button type="submit" className="adm btn-simple ingresar"> INGRESAR </button> 
                    
                </form>
                <div className='footer adm'></div>
                </>
            ) : (
            <>
                <Adm></Adm>  
            </>
            )}
            </section>
           
        </>
    );
};

export default Login;