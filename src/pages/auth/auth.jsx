import './auth.css';
import appLogoOnly from '../../assets/appLogoOnly.svg'
import {useContext, useState} from 'react';
import {AuthContext} from "../../context/AuthContext.jsx";
import { useLocation } from "react-router-dom";
import axios from "axios";

// TODO: Ik kan nog 2 dezelfde gebruikers aanmaken op het moment.

function Auth() {
    const [isRegister, setIsRegister] = useState(false);
    const { login } = useContext(AuthContext);

    const location = useLocation();
    const message = location.state?.message;

    async function handleLogin(data) {
        try {
            const response = await axios.post(
                'https://novi-backend-api-wgsgz.ondigitalocean.app/api/login',
                {
                    email: data.email,
                    password: data.password,
                },
                {
                    headers: {
                        'novi-education-project-id': '5a1ea178-e581-4983-a200-1089aaa6bb93',
                    },
                }
            );
            login(response.data);
        } catch (err) {
            console.error('Login fout:', err);
        }
    }

    async function handleRegister(data) {
        try {
            const userResponse = await axios.post(
                'https://novi-backend-api-wgsgz.ondigitalocean.app/api/users',
                {
                    email: data.email,
                    password: data.password,
                    roles: ['user'],
                },
                {
                    headers: {
                        'novi-education-project-id': '5a1ea178-e581-4983-a200-1089aaa6bb93',
                    },
                }
            );

            const userId = userResponse.data.id;

            const loginResponse = await axios.post(
                'https://novi-backend-api-wgsgz.ondigitalocean.app/api/login',
                {
                    email: data.email,
                    password: data.password,
                },
                {
                    headers: {
                        'novi-education-project-id': '5a1ea178-e581-4983-a200-1089aaa6bb93',
                    },
                }
            );

            const token = loginResponse.data.token;

            await axios.post(
                'https://novi-backend-api-wgsgz.ondigitalocean.app/api/profiles',
                {
                    userId: userId,
                    username: data.username,
                },
                {
                    headers: {
                        'novi-education-project-id': '5a1ea178-e581-4983-a200-1089aaa6bb93',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            login(loginResponse.data);
        } catch (err) {
            console.error('Registratie fout:', err.response?.data || err.message);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const data = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            repeatPassword: formData.get('repeatPassword'),
        };
        if (isRegister) {
            if (data.password !== data.repeatPassword) {
                console.error('Wachtwoorden komen niet overeen');
                return;
            }
            await handleRegister(data);
        } else {
            await handleLogin(data);
        }
    }

    return (
        <>
            {message && (
                <div className="error-banner">
                    <p>{message}</p>
                </div>
            )}
            <div className="container">
                <div className="auth-wrapper">
                    <section className="auth-card">
                        <div className="auth-icon">
                            <img src={appLogoOnly} alt="recipe-app-logo" />
                        </div>

                        <h1>Welkom</h1>
                        <p className="auth-subtitle">
                            Log in of maak een account om recepten aan te maken
                        </p>

                        <div className="auth-switch">
                            <div
                                className={`auth-switch-slider ${isRegister ? 'right' : 'left'}`}
                            ></div>

                            <button
                                type="button"
                                className={`auth-switch-button ${!isRegister ? 'active' : ''}`}
                                onClick={() => setIsRegister(false)}
                            >
                                Inloggen
                            </button>

                            <button
                                type="button"
                                className={`auth-switch-button ${isRegister ? 'active' : ''}`}
                                onClick={() => setIsRegister(true)}
                            >
                                Registreren
                            </button>
                        </div>

                        <form className="auth-form" onSubmit={handleSubmit}>
                            {isRegister && (
                                <div className="form-group">
                                    <label htmlFor="name">Naam</label>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="Je volledige naam"
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="email">E-mail</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="je@email.com"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Wachtwoord</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Minimaal 6 tekens"
                                />
                            </div>

                            {isRegister && (
                                <div className="form-group">
                                    <label htmlFor="repeatPassword">
                                        Herhaal wachtwoord
                                    </label>
                                    <input
                                        id="repeatPassword"
                                        name="repeatPassword"
                                        type="password"
                                        placeholder="Herhaal je wachtwoord"
                                    />
                                </div>
                            )}

                            <button type="submit" className="auth-submit">
                                {isRegister ? 'Account aanmaken' : 'Inloggen'}
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </>
    )
}

export default Auth;