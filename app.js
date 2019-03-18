// external
const express = require('express');
const path = require('path');
const logger = require('morgan');

// utils
const { localStoragePublicPath } = require('./utils/storageService');

// routes
const uploadRouter = require('./routes/upload');

const app = express();
app.use(logger('dev'));
app.use('/upload', uploadRouter);

if (process.env.NODE_ENV === 'development') {
    const webpack = require('webpack');
    const webpackConfig = require('./webpack.config')(process.env);
    const compiler = webpack(webpackConfig);

    app.use(
        require('webpack-dev-middleware')(compiler, {
            noInfo: true,
        })
    );
    app.use(require('webpack-hot-middleware')(compiler));
}

app.use(express.static(path.join(__dirname, 'public')));

if (localStoragePublicPath) {
    app.use(
        `/${localStoragePublicPath}`,
        express.static(path.join(__dirname, 'uploads'))
    );
}

app.use((err, req, res, next) => {
    console.error(err.stack);
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).send('Error!');
});

module.exports = app;
