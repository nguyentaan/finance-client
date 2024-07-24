import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import GlobalStyles from '~/components/GlobalStyles';
import store from './reducers/store';
import { Provider } from 'react-redux';
import { server } from './mocks/server';

if (process.env.NODE_ENV === 'development') {
    server.start();
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <GlobalStyles>
                <App />
            </GlobalStyles>
        </Provider>
    </React.StrictMode>,
);
