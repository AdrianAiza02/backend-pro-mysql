var express = require('express');
var app = express();
var LoginController = require('../controllers/login.controller');


app.post('/',LoginController.login);


module.exports = app;