var express = require('express');
var app = express();
var UserController = require('../controllers/usuario.controller');
var mdAutentication = require('../middlewares/autenticacion');


app.get('/',UserController.getUsuariosActivos);
app.post('/',mdAutentication.auth,UserController.InsertarUsuario);
app.put('/:id',UserController.updateUsuario);
app.put('/deletelogico/:id',UserController.deleteLogicoDB);
app.delete('/:id',UserController.deleteUsuarioBD);


module.exports = app;