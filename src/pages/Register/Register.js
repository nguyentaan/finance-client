import classNames from 'classnames/bind';
import styles from './register.module.css';
import ThemeLogin from './../../assets/theme-login.jpg';
import GoogleButton from '../../components/googleButton';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { register } from '~/reducers/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '~/components/Layout/DefautLayout/loading/loading';

const cx = classNames.bind(styles);

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector((state) => state.auth.loading);
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        uppercase: false,
        specialChar: false,
    });

    const validateForm = () => {
        const newErrors = {};
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*.])(?=.{6,})/;

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!emailPattern.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (!passwordPattern.test(password)) {
            newErrors.password =
                'Password must be at least 6 characters long, contain one uppercase letter and one special character';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Confirm Password is required';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        setPasswordCriteria({
            length: value.length >= 6,
            uppercase: /[A-Z]/.test(value),
            specialChar: /[!@#$%^&*.]/.test(value),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const payload = { email, password };
                // console.log('Register Payload:', payload);
                const response = await dispatch(register(payload));
                if (response.payload.status === 400) {
                    console.log('Register error:', response);
                    setError(response.payload.title);
                } else {
                    console.log('Register Response:', response);
                    navigate('/');
                }
            } catch (err) {
                console.log('Register Error:', err);
                setError(err.message);
            }
            console.log('Form is valid');
        } else {
            console.log('Form has errors');
        }
    };

    return (
        <div className={cx('container')}>
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
                            <h1>Create New Account</h1>
                        </div>
                        <GoogleButton />
                    </div>
                    <div className={cx('content-form')}>
                        <span className={cx('or')}>------------- or Sign in with Email -------------</span>
                        <form className={cx('form')} onSubmit={handleSubmit}>
                            <div className={cx('input-group')}>
                                <label className={cx('label')}>Email address</label>
                                <input
                                    type="text"
                                    placeholder="Email"
                                    className={cx('input')}
                                    id="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {errors.email && <p className={cx('error-message')}>{errors.email}</p>}
                            </div>

                            <div className={cx('input-group')}>
                                <label className={cx('label')}>Password</label>
                                <input
                                    type="password"
                                    placeholder="password"
                                    className={cx('input')}
                                    id="Password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                                {errors.password && <p className={cx('error-message')}>{errors.password}</p>}
                                {password && (
                                    <div className={cx('password-criteria')}>
                                        <p className={passwordCriteria.length ? cx('valid') : cx('invalid')}>
                                            At least 6 characters
                                        </p>
                                        <p className={passwordCriteria.uppercase ? cx('valid') : cx('invalid')}>
                                            At least 1 uppercase letter
                                        </p>
                                        <p className={passwordCriteria.specialChar ? cx('valid') : cx('invalid')}>
                                            At least 1 special character (!@#$%^&*.)
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className={cx('input-group')}>
                                <label className={cx('label')}>Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="confirm password"
                                    className={cx('input')}
                                    id="ConfirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                {errors.confirmPassword && (
                                    <p className={cx('error-message')}>{errors.confirmPassword}</p>
                                )}
                            </div>
                            <div className={cx('options')}>
                                <div className={cx('remember-me')}>
                                    <input type="checkbox" id="remember-me" />
                                    <label htmlFor="remember-me">Remember me</label>
                                </div>
                                <div className={cx('forgot-password')}>
                                    <button className={cx('link-button')}>Forgot password?</button>
                                </div>
                            </div>
                            <div className={cx('button', 'color-button')}>
                                {isLoading ? (
                                    <Loading />
                                ) : (
                                    <input type="submit" value={'Sign up'} disabled={isLoading} />
                                )}{' '}
                            </div>
                            <div className={cx('create-account')}>
                                <span>Already have account?</span>
                                <Link to="/">Login</Link>
                            </div>
                        </form>
                        {error && <p className={cx('error-message-title')}>{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
