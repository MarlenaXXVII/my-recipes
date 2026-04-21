import './auth.css';
import appLogoOnly from '../../assets/appLogoOnly.svg'
import {useContext, useState} from 'react';
import {AuthContext} from "../../context/AuthContext.jsx";
import { useLocation } from "react-router-dom";
import axios from "axios";

function Auth() {
    const [isRegister, setIsRegister] = useState(false);
    const [errors, setErrors] = useState({});
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

    async function checkIfEmailExists(email) {
        try {
            const response = await axios.get(
                'https://novi-backend-api-wgsgz.ondigitalocean.app/api/users',
                {
                    headers: {
                        'novi-education-project-id': '5a1ea178-e581-4983-a200-1089aaa6bb93',
                    },
                }
            );

            const users = response.data;
            return users.some((user) => user.email === email);
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    function validateForm(data) {
        const newErrors = {};

        if (isRegister && !data.username?.trim()) {
            newErrors.username = 'Naam is verplicht';
        }

        if (!data.email?.trim()) {
            newErrors.email = 'E-mail is verplicht';
        }

        if (!data.password?.trim()) {
            newErrors.password = 'Wachtwoord is verplicht';
        }

        if (isRegister && !data.repeatPassword?.trim()) {
            newErrors.repeatPassword = 'Herhaal je wachtwoord';
        }

        if (
            isRegister &&
            data.password &&
            data.repeatPassword &&
            data.password !== data.repeatPassword
        ) {
            newErrors.repeatPassword = 'Wachtwoorden komen niet overeen';
        }

        return newErrors;
    }

    async function handleSubmit(e) {
        setErrors({});
        e.preventDefault();
        const formData = new FormData(e.target);

        const data = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            repeatPassword: formData.get('repeatPassword'),
        };
        const validationErrors = validateForm(data);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        if (isRegister) {
            const emailExists = await checkIfEmailExists(data.email);

            if (emailExists) {
                setErrors({ email: 'Dit e-mailadres bestaat al' });
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
                                    <label htmlFor="username">Naam</label>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="Kies een username"
                                    />
                                    {errors.username && <p className="field-error">{errors.username}</p>}
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
                                {errors.email && <p className="field-error">{errors.email}</p>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Wachtwoord</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Wachtwoord"
                                />
                                {errors.password && <p className="field-error">{errors.password}</p>}
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
                                    {errors.repeatPassword && <p className="field-error">{errors.repeatPassword}</p>}
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