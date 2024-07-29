import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
import instance from '../axios/axiosInstance';

export const googleSignIn = createAsyncThunk('auth/googleSignIn', async (tokenId, { rejectWithValue }) => {
    try {
        // console.log('Google Sign-In Payload:', tokenId);
        // const res = await axios.post('https://localhost:7086/api/Auth/google-signin',
        // const res = await axios.post('http://localhost:5215/api/Auth/google-signin',
        const res = await instance.post(
            'https://personal-finacne-tracking.azurewebsites.net/api/Auth/google-signin',
            {
                tokenId: tokenId,
            },
            // {
            //     withCredentials: true,
            // },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
        // console.log('Google Sign-In Response:', res.data);

        if (res.data && res.data.message === 'Google sign-in successful') {
            // console.log('Google Sign-In Successful:', res);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            return res.data;
        } else {
            throw new Error(res.data);
        }
    } catch (err) {
        return rejectWithValue(err.response ? err.response.data : err.message);
    }
});

export const login = createAsyncThunk('auth/login', async ({ email, password }, { dispatch }) => {
    try {
        // console.log('Login Payload:', { email, password });
        // const res = await instance.post('https://personal-finacne-tracking.azurewebsites.net/login?useCookies=true&useSessionCookies=true',
        await instance.post(
            'https://localhost:7086/login?useCookies=true&useSessionCookies=true',
            {
                email,
                password,
            },
            {
                withCredentials: true,
            },
        );
        // console.log('Login Response:', res);
        const output = await dispatch(fetchUserData());
        localStorage.setItem('user', JSON.stringify(output.payload));
        return output.payload;
    } catch (error) {
        throw error.response.data;
    }
});

export const fetchUserData = createAsyncThunk('auth/fetchUserData', async (_, { rejectWithValue }) => {
    try {
        // const res = await instance.get('https://personal-finacne-tracking.azurewebsites.net/users/me',
        const res = await instance.get('https://localhost:7086/users/me', {
            withCredentials: true,
        });
        // localStorage.setItem('user', JSON.stringify(res.data));
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response ? err.response.data : 'Network error');
    }
});

export const register = createAsyncThunk('auth/register', async ({ email, password }, { rejectWithValue }) => {
    try {
        // console.log('Register Payload:', { email, password });
        const res = await instance.post(
            'https://personal-finacne-tracking.azurewebsites.net/register',
            // const res = await axios.post('http://localhost:5215/register',
            {
                email,
                password,
            },
        );
        // console.log('Register Response:', res.data);

        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const signOut = createAsyncThunk('auth/signOut', async (_, { rejectWithValue }) => {
    try {
        localStorage.removeItem('user');
        return true; // You can return any value you need
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {
        signOut: (state) => {
            state.user = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(googleSignIn.pending, (state) => {
                state.loading = true;
            })
            .addCase(googleSignIn.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.loading = false;
                state.error = null;
            })
            .addCase(googleSignIn.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                // state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        // .addCase(fetchUserData.pending, (state) => {
        //     state.loading = true;
        // })
        // .addCase(fetchUserData.fulfilled, (state, action) => {
        //     state.user = action.payload;
        //     state.loading = false;
        //     state.error = null;
        // })
        // .addCase(fetchUserData.rejected, (state, action) => {
        //     state.loading = false;
        //     state.error = action.payload;
        // });
    },
});

export const { actions, reducer } = authSlice;
export default reducer;
