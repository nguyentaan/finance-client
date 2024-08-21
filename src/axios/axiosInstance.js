import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
console.log('API URL:', process.env.REACT_APP_API_URL);

const instance = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Ensure cookies are sent with each request
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;
