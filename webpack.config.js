const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');

const config = {
    entry: './src-client/js/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'public', 'js'),
    },
};

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.plugins = [
            new NodemonPlugin({
                script: './bin/www',
            }),
        ];
        config.optimization = {
            minimize: false,
        };
    }

    return config;
};
