import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
// import { googleSignIn } from '~/actions/authAction';
import { googleSignIn } from '~/reducers/authSlice';
import { useNavigate } from 'react-router-dom';

const CLIENT_ID = '949928109687-ualg36c3l1v73dtqmudotboi79f7pvds.apps.googleusercontent.com';

const GoogleButton = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onSuccess = async (response) => {
        console.log('Login Success:', response);
        try {
            const signInResponse = await dispatch(googleSignIn(response.credential));
            console.log('Sign-in Response:', signInResponse);

            if (signInResponse && signInResponse.payload.message === 'Google sign-in successful') {
                navigate('/dashboard');
            } else {
                console.error('Sign-in not successful:', signInResponse && signInResponse.message);
                // Handle other conditions or errors if needed
            }
        } catch (err) {
            console.error('API Error:', err);
            // Handle dispatch error or other API errors
        }
    };

    const onFailure = (response) => {
        console.log('Login Failed:', response);
    };

    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <div>
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

export default GoogleButton;
