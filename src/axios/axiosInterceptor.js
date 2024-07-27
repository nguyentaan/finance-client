import instance from './axiosInstance';
import { signOut } from '~/reducers/authSlice';
import { toast } from 'react-toastify';

const axiosInterceptor = (store) => {
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                store.dispatch(signOut());
                toast.error('Session expired. Please login again.');
            }
            return Promise.reject(error);
        },
    );
};

export default axiosInterceptor;
