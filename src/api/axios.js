import axios from "axios";
import { config } from "../config";

const api = axios.create({
    baseURL: config.apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;