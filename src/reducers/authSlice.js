import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from '../axios/axiosInstance';

export const googleSignIn = createAsyncThunk('auth/googleSignIn', async (tokenId, { rejectWithValue }) => {
    console.log('tokenID', tokenId);
    try {
        const res = await instance.post(
            '/api/Auth/google-signin',
            {
                tokenId: tokenId,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        
        
        if (res.data && res.data.message === 'Google sign-in successful') {
            localStorage.setItem('user', JSON.stringify(res.data.user));
            return res.data;
        } else {
            throw new Error(res.data);
        }
    } catch (err) {
        return rejectWithValue(err.response ? err.response.data : err.message);
    }
});

export const login = createAsyncThunk('auth/login', async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
        await instance.post(
            '/login?useCookies=true&useSessionCookies=true',
            {
                email,
                password,
            },
            {
                withCredentials: true,
            },
        );

        const output = await dispatch(fetchUserData());
        localStorage.setItem('user', JSON.stringify(output.payload));
        return output.payload;
    } catch (error) {
        return rejectWithValue(error.response ? error.response.data : 'Login failed');
    }
});

export const fetchUserData = createAsyncThunk('auth/fetchUserData', async (_, { rejectWithValue }) => {
    try {
        const res = await instance.get('/users/me', {
            withCredentials: true,
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response ? err.response.data : 'Network error');
    }
});

export const register = createAsyncThunk('auth/register', async ({ email, password }, { rejectWithValue }) => {
    try {
        const res = await instance.post('/register', {
            email,
            password,
        });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response ? error.response.data : 'Registration failed');
    }
});

export const signOut = createAsyncThunk('auth/signOut', async (_, { rejectWithValue }) => {
    try {
        localStorage.removeItem('user');
        return true;
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
            .addCase(register.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { actions, reducer } = authSlice;
export default reducer;
