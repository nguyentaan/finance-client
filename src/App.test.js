// App.test.js

import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import DefaultLayout from './components/Layout/DefautLayout';
// import DefaultLayout from '/components/Layout/DefautLayout';
import { Fragment } from 'react';
// Mock publicRoutes data
const publicRoutes = [
    { path: '/', layout: null, component: () => <div>Home Page</div> },
    { path: '/login', layout: null, component: () => <div>Login Page</div> },
    // Add more routes as needed
];

describe('App component', () => {
    it('should render routes with appropriate layouts', () => {
        const { getBytext } = render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>,
            { wrapper: AppWrapper },
        );

        expect(getBytext('Home Page')).toBeInTheDocument();
    });

    // Add more test cases for other routes and layouts
});

// Mocking AppWrapper to simulate the publicRoutes data
const AppWrapper = ({ children }) => {
    return (
        <div className="App">
            <Routes>
                {publicRoutes.map((route, index) => {
                    const Layout = route.layout === null ? Fragment : DefaultLayout;
                    const Page = route.component;
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                        />
                    );
                })}
            </Routes>
            {children}
        </div>
    );
};
