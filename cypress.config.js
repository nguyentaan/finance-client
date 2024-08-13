const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        baseUrl: 'https://localhost:3000',
        chromeWebSecurity: false,
        setupNodeEvents(on, config) {
            // implement node event listeners here
            const { GoogleSocialLogin } = require('cypress-social-logins').plugins;
            on('task', {
                GoogleSocialLogin: GoogleSocialLogin,
            });
        },
    },
    env: {
        googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        googleClientId: process.env.REACT_APP_GOOGLE_CLIENTID,
        googleClientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
    },

    component: {
        devServer: {
            framework: 'create-react-app',
            bundler: 'webpack',
        },
        setupNodeEvents(on, config) {
            // implement node event listeners here
            const webpack = require('@cypress/webpack-preprocessor');
            const path = require('path');

            const options = {
                webpackOptions: require(path.resolve(__dirname, './cypress/webpack.config.js')),
                watchOptions: {},
            };

            on('file:preprocessor', webpack(options));
            return config;
        },
    },
});
