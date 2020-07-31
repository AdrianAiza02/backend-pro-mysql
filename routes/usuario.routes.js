var express = require('express');
var app = express();
var UserController = require('../controllers/usuario.controller');

app.get('/',UserController.getUsuariosActivos);


module.exports = app;