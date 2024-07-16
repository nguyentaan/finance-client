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
    const [showSnackbar, setShowSnackbar] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.auth.loading);
    // const isLoading = true;
    // const isLoading = false;

    const validateForm = () => {
        let isValid = true;
        if (!email) {
            setError('Please enter your email');
            isValid = false;
        }
        if (!password) {
            setError('Please enter your password');
            isValid = false;
        }
        return isValid;
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const payload = { email, password };
                // console.log('Login Payload:', payload); // Additional logging
                const response = await dispatch(login(payload));
                // console.log('Login Response:', response);
                console.log('status code:', response.payload.status);
                if (response.payload.status === 200) {
                    navigate('/dashboard');
                } else if (response.error) {
                    setError('Invalid email or password');
                    setShowSnackbar(true);
                }
            } catch (err) {
                setError(err.message);
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

    return (
        <div className={cx('container')}>
            <CustomSnackbar open={showSnackbar} message={error} onClose={() => setShowSnackbar(false)} />
            <div className={cx('column')}>
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
                        <GoogleButton />
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
                                {/* {hasEmailError && <p className={cx('error-message')}>{error}</p>} */}
                            </div>

                            <div className={cx('input-group')}>
                                <label className={cx('label')}>Password</label>
                                <input
                                    type="password"
                                    placeholder="password"
                                    className={cx('input', { hasError: hasPasswordError })}
                                    id="Password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setHasPasswordError(false);
                                    }}
                                />
                                {/* {hasPasswordError && <p className={cx('error-message')}>{error}</p>} */}
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
                                    <Loading />
                                ) : (
                                    <input type="submit" value={'Sign in'} disabled={isLoading} />
                                )}
                            </div>
                            <div className={cx('create-account')}>
                                <span>Don't have an account?</span>
                                <Link to="/register">Create account</Link>
                            </div>
                        </form>
                        {error && <p className={cx('error-message')}>{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
