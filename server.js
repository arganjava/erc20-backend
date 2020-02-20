var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var erc20Router = require('./routes/erc20');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/erc20', erc20Router);

app.listen(3000);

module.exports = app;
