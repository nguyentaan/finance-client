import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { googleSignIn } from '~/reducers/authSlice';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const CLIENT_ID = '949928109687-ualg36c3l1v73dtqmudotboi79f7pvds.apps.googleusercontent.com';

const GoogleButton = ({ onSuccessSnackbar, onErrorSnackbar }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onSuccess = async (response) => {
        try {
            const actionResult = await dispatch(googleSignIn(response.credential));
            console.log('Action Result:', actionResult);
            const { meta, payload } = actionResult;

            if (meta.requestStatus === 'fulfilled') {
                if (onSuccessSnackbar) {
                    onSuccessSnackbar('Google sign-in successful');
                }
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1000);
            } else if (meta.requestStatus === 'rejected') {
                if (onErrorSnackbar) {
                    onErrorSnackbar(payload || 'Sign-in not successful');
                }
                console.error('Sign-in not successful:', payload);
            }
        } catch (err) {
            console.error('API Error:', err);
            if (onErrorSnackbar) {
                onErrorSnackbar('API error occurred');
            }
        }
    };

    const onFailure = (response) => {
        console.log('Login Failed:', response);
        if (onErrorSnackbar) {
            onErrorSnackbar('Google login failed');
        }
    };

    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <div data-testid="google-button-component">
                <GoogleLogin
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true}
                    scope="profile email"
                />
            </div>
        </GoogleOAuthProvider>
    );
};

GoogleButton.propTypes = {
    onSuccessSnackbar: PropTypes.func,
    onErrorSnackbar: PropTypes.func,
};

GoogleButton.defaultProps = {
    onSuccessSnackbar: () => {},
    onErrorSnackbar: () => {},
};

export default GoogleButton;
