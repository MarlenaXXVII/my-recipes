import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "novi-education-project-id": import.meta.env.VITE_NOVI_PROJECT_ID,
    },
});

export default api;