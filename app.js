const express = require('express');
const path = require('path');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const uploadRouter = require('./routes/upload');

const app = express();

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/upload', uploadRouter);

module.exports = app;
