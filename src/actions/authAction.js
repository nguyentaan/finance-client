import axios from 'axios';

export const googleSignIn = (tokenId) => async (dispatch) => {
    dispatch({ type: 'GOOGLE_SIGNIN_REQUEST' });

    try {
        const res = await axios.post('http://localhost:5215/api/Auth/google-signin', {
            tokenId,
        });

        console.log('Google Sign-In Response:', res.data);

        if (res.data && res.data.message === 'Google sign-in successful') {
            dispatch({
                type: 'GOOGLE_SIGNIN_SUCCESS',
                payload: res.data,
            });
            localStorage.setItem('user', JSON.stringify(res.data.user));
            return res.data; // Return the entire response for handling in onSuccess
        } else {
            throw new Error('Google sign-in not successful');
        }
    } catch (err) {
        console.error('Google Sign-In Error:', err);
        dispatch({
            type: 'GOOGLE_SIGNIN_FAILURE',
            payload: err.response ? err.response.data : err.message,
        });
        throw err; // Rethrow the error to handle it in onSuccess
    }
};

export const loginAction = (email, password) => async (dispatch) => {
    dispatch({ type: 'LOGIN_REQUEST' });

    try {
        const response = await axios.post('http://localhost:5215/login?useCookies=true', {
            email,
            password,
        });

        dispatch({
            type: 'LOGIN_SUCCESS',
            payload: response.data,
        });
        console.log('login response', response.data);
        localStorage.setItem('accessToken', response.data.accessToken); // Store access token
        await fetchUserData(dispatch);
    } catch (error) {
        dispatch({
            type: 'LOGIN_FAILURE',
            payload: error.response ? error.response.data : 'Network error',
        });
    }
};

export const signOut = () => async (dispatch) => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    dispatch({
        type: 'SIGN_OUT',
    });
};

export const fetchUserData = async (dispatch) => {
    try {
        const res = await axios.get('http://localhost:5215/users/me', {
            withCredentials: true,
        });

        dispatch({
            type: 'FETCH_USER_DATA',
            payload: res.data,
        });

        localStorage.setItem('user', JSON.stringify(res.data));

        console.log('User Data:', res.data);
    } catch (error) {
        console.error('Error Fetching User Data:', error);
    }
};
