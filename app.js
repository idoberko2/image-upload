const express = require('express');
const path = require('path');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const uploadRouter = require('./routes/upload');

const {
    localStoragePublicPath,
  } = require('./utils/storageService');

const app = express();

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets/htm', express.static(path.join(__dirname, 'node_modules', 'htm')));
app.use('/assets/react', express.static(path.join(__dirname, 'node_modules', 'react')));
app.use('/assets/react-dom', express.static(path.join(__dirname, 'node_modules', 'react-dom')));

app.use('/', indexRouter);
app.use('/upload', uploadRouter);

if (localStoragePublicPath) {
    app.use(`/${localStoragePublicPath}`, express.static(path.join(__dirname, 'uploads')));
}

module.exports = app;
