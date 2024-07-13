const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000',
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
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
