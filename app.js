/*
* File: app.js
* Version: 1.0
* Type: javascript
* Date: 2018-04-29
* Author: Daniele Dal Maso
* E-mail: JurassicSWE@gmail.com
*
* License: GNU General Public License v3.0
*
*/

var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'))

var router = express.Router();
var path = __dirname + '/public/';

app.use("/classi",function(req,res){
    res.sendFile(path + "/classi.html");
});

app.use("*",function(req,res){
    res.sendFile(path + "/404.html");
});


app.listen(3000);

module.exports = app;
