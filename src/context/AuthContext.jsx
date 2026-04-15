import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import isTokenValid from '../helpers/isTokenValid.js';
import { jwtDecode } from 'jwt-decode';

import axios from 'axios';

export const AuthContext = createContext( {} );

function AuthContextProvider( { children } ) {
    const [ auth, setAuth ] = useState( {
        isAuth: false,
        user: null,
        status: 'pending',
    } );

    useEffect( () => {
        const token = localStorage.getItem( 'token' );
        if (token && isTokenValid(token)) {
            const decoded = jwtDecode(token);
            // const expirationDate = new Date(decoded.exp * 1000);
            // console.log("Token verloopt op:", expirationDate);
            // console.log("Huidige tijd:", new Date());
            void fetchUserData(decoded.userId, token);
        } else {
            localStorage.removeItem('token');

            setAuth({
                isAuth: false,
                user: null,
                status: 'done',
            });
        }
    }, [] );

    const navigate = useNavigate();

    function login(userDetails) {
        console.log(userDetails);
        console.log('Gebruiker is ingelogd!');

        localStorage.setItem('token', userDetails.token);

        const decoded = jwtDecode(userDetails.token);

        setAuth({
            isAuth: true,
            user: {
                email: decoded.email,
                role: decoded.role,
                id: decoded.userId,
            },
            status: 'done',
        });

        navigate('/nieuw-recept');
    }

    function logout() {
        localStorage.clear();
        setAuth( {
            isAuth: false,
            user: null,
            status: 'done',
        } );

        console.log( 'Gebruiker is uitgelogd!' );
        navigate( '/' );
    }

    async function fetchUserData( id, token, redirectUrl ) {
        try {
            const result = await axios.get( `http://localhost:5173/600/users/${ id }`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ token }`,
                },
            } );

            setAuth( {
                ...auth,
                isAuth: true,
                user: {
                    username: result.data.username,
                    email: result.data.email,
                    id: result.data.id,
                },
                status: 'done',
            } );

            if ( redirectUrl ) {
                navigate( redirectUrl );
            }

        } catch ( e ) {
            console.error( e );
            setAuth( {
                isAuth: false,
                user: null,
                status: 'done',
            } );
        }
    }

    const contextData = {
        ...auth,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={ contextData }>
            { auth.status === 'done' ? children : <p>Aan het laden..</p> }
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;