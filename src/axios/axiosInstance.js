import axios from 'axios';

const instance = axios.create({
    withCredentials: true, // Ensure cookies are sent with each request
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;
