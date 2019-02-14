const path = require('path');
const webpack = require('webpack');

const config = {
    entry: [path.join(__dirname, 'src-client', 'js', 'index.js')],
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'public', 'js'),
        publicPath: '/js/',
    },
};

module.exports = (env, argv) => {
    if (env.NODE_ENV === 'development' || argv.mode === 'development') {
        config.plugins = [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
        ];
        config.optimization = {
            minimize: false,
        };
        config.entry = ['webpack-hot-middleware/client', ...config.entry];
        config.mode = 'development';
    } else {
        config.mode = 'production';
    }

    return config;
};
