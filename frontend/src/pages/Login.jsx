import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeaderPage from '../components/HeaderPage';
import { URL } from '../constants';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            // Retrieve CSRF token from cookie
            const csrfToken = getCookie('csrf_token');

            // Send login request with CSRF token
            const response = await axios.post(
                `${URL}/login`,
                { username, password },
                { headers: { 'X-CSRFToken': csrfToken } }
            );

            // Handle login response
            if (response.data.status === 'success') {
                localStorage.setItem('access_token', response.data.access_token);
                navigate('/admin');
            } else {
                setErrorMessage('Wrong username or password!');
            }
        } catch (error) {
            setErrorMessage('Wrong username or password!');
            console.error('Login failed:', error);
        }
    };

    // Function to retrieve CSRF token from cookie
    const getCookie = (name) => {
        const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        return cookieValue ? cookieValue.pop() : '';
    };

    return (
        <div>
            <HeaderPage label="Login." image="../images/beemer.jpeg" />

            <div className="login-container">
                <div className="login-form">
                    <h2>Login</h2>
                    {errorMessage && <p className="error-message error-msg">{errorMessage}</p>}
                    <form>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button type="button" onClick={handleLogin}>Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
