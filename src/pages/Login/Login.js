/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '~/reducers/authSlice';
import ThemeLogin from './../../assets/theme-login.jpg';
import GoogleButton from '../../components/googleButton';
import Loading from '~/components/Layout/DefautLayout/loading/loading';
import CustomSnackbar from '~/components/snackbar/snackbar';
import classNames from 'classnames/bind';
import styles from './login.module.css';

const cx = classNames.bind(styles);

const Login = () => {
    const [hasEmailError, setHasEmailError] = useState(false);
    const [hasPasswordError, setHasPasswordError] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarType, setSnackbarType] = useState('error');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.auth.loading);

    useEffect(() => {
        if (error) {
            setHasEmailError(true);
            setHasPasswordError(true);
        }
    }, [error]);

    const validateForm = () => {
        const newErrors = {};
        if (!email) {
            newErrors.email = 'Please enter your email';
        }
        if (!password) {
            newErrors.password = 'Please enter your email';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const payload = { email, password };
                const response = await dispatch(login(payload));
                // console.log('Login Response:', response.meta.requestStatus);
                if (response.meta.requestStatus === 'fulfilled') {
                    setSuccessMessage('Login successful');
                    setSnackbarType('success');
                    setShowSnackbar(true);
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 1000);
                } else if (response.error) {
                    setError('Invalid email or password');
                    setSnackbarType('error');
                    setShowSnackbar(true);
                }
            } catch (err) {
                setError(err.message);
                setSnackbarType('error');
                setShowSnackbar(true);
            }
        }
    };

    useEffect(() => {
        if (error) {
            setHasEmailError(true);
            setHasPasswordError(true);
        }
    }, [error]);

    const handleSnackbarOpen = (message, type) => {
        if (type === 'success') {
            setSuccessMessage(message); // Set success message
        } else if (type === 'error') {
            setError(message); // Set error message
        }
        setSnackbarType(type);
        setShowSnackbar(true);
        // console.log('Snackbar:', message);
    };

    const handleSnackbarClose = () => {
        setShowSnackbar(false);
    };

    return (
        <div className={cx('container')}>
            <div data-testid="snackbar">
                <CustomSnackbar
                    open={showSnackbar}
                    message={snackbarType === 'success' ? successMessage : error}
                    onClose={handleSnackbarClose}
                    severity={snackbarType} // Pass type to CustomSnackbar
                />
            </div>
            <div className={cx('column', 'none-display')}>
                <div className={cx('title')}>
                    <h1>Welcome</h1>
                    <h1>Personal Finance Tracker</h1>
                </div>
                <div className={cx('image')}>
                    <img src={ThemeLogin} alt="Manage Money Illustration" />
                </div>
            </div>
            <div className={cx('column')}>
                <div className={cx('content')}>
                    <div className={cx('content-title')}>
                        <div className={cx('title-login')}>
                            <h1>Login to Your Account</h1>
                            <span>See what is going on with your business</span>
                        </div>
                        <div data-testid="google-button">
                            <GoogleButton
                                onSuccessSnackbar={(message) => handleSnackbarOpen(message, 'success')}
                                onErrorSnackbar={(message) => handleSnackbarOpen(message, 'error')}
                            />
                        </div>
                    </div>
                    <div className={cx('content-form')}>
                        <span className={cx('or')}>------------- or Sign in with Email -------------</span>
                        <form onSubmit={handleLogin} className={cx('form')}>
                            <div className={cx('input-group')}>
                                <label className={cx('label')}>Email address</label>
                                <input
                                    type="text"
                                    placeholder="Email"
                                    className={cx('input', { hasError: hasEmailError })}
                                    id="Email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setHasEmailError(false);
                                    }}
                                />
                                <div data-testid="error-message-email">
                                    {errors.email && <p className={cx('error-message')}>{errors.email}</p>}
                                </div>
                            </div>

                            <div className={cx('input-group')}>
                                <label className={cx('label')}>Password</label>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className={cx('input', { hasError: hasPasswordError })}
                                    id="Password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setHasPasswordError(false);
                                    }}
                                />
                                <div data-testid="error-message-password">
                                    {errors.password && <p className={cx('error-message')}>{errors.password}</p>}
                                </div>
                            </div>
                            <div className={cx('options')}>
                                <div className={cx('remember-me')}>
                                    <input type="checkbox" id="remember-me" />
                                    <label htmlFor="remember-me">Remember me</label>
                                </div>
                                <div className={cx('forgot-password')}>
                                    <a href="#">Forgot password?</a>
                                </div>
                            </div>
                            <div className={cx('button', 'color-button')}>
                                {isLoading ? (
                                    <div data-testid="loading">
                                        <Loading />
                                    </div>
                                ) : (
                                    <input
                                        data-testid="submit-button"
                                        type="submit"
                                        value={'Sign in'}
                                        disabled={isLoading}
                                    />
                                )}
                            </div>
                            <div className={cx('create-account')}>
                                <span>Don't have an account?</span>
                                <Link to="/register">Create account</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
