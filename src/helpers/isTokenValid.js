import {jwtDecode} from "jwt-decode";

function isTokenValid(token) {
    if (!token) {
        return false;
    }

    try {
        const decoded = jwtDecode(token);

        // exp is in seconden → omzetten naar milliseconden
        const expirationTime = decoded.exp * 1000;

        if (Date.now() >= expirationTime) {
            return false; // token is verlopen
        }

        return true; // token is nog geldig
    } catch (error) {
        console.error("Ongeldig token:", error);
        return false;
    }
}
export default isTokenValid;