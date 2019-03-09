const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const config = {
    context: path.resolve(__dirname, 'src-client'),
    entry: ['./js/index.js'],
    output: {
        path: path.resolve(__dirname, 'public'),
    },
    plugins: [
        new CleanWebpackPlugin([path.resolve(__dirname, 'public')]),
        new HtmlWebpackPlugin({
            title: 'קטמון - העלאת תמונות',
            template: path.join(__dirname, 'src-client', 'index.html'),
            hash: true,
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
};

module.exports = (env, argv) => {
    if (env.NODE_ENV === 'development' || argv.mode === 'development') {
        config.mode = 'development';
        config.plugins = [
            ...config.plugins,
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
        ];
        config.optimization = {
            minimize: false,
        };
        config.entry = ['webpack-hot-middleware/client', ...config.entry];
    } else {
        config.mode = 'production';
        config.output = {
            ...config.output,
            filename: 'js/[name].[chunkhash].js',
            chunkFilename: 'js/[name].[chunkhash].js',
        };

        config.optimization = {
            minimizer: [
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                }),
            ],
            splitChunks: {
                chunks: 'all',
            },
        };
    }

    return config;
};
