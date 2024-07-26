import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import GoogleButton from '../../src/components/googleButton';
import store from '../../src/reducers/store';

describe('Google button', () => {
    test('should render Google button', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <GoogleButton />
                </MemoryRouter>
            </Provider>,
        );
        expect(screen.getByTestId('google-button-component')).toBeInTheDocument();
    });
});
