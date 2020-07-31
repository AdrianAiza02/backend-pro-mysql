'use strict'
var conexion = require('../config/db.config');
var UsuarioModel = require('../models/usuario.model');

var UserController = {
    getUsuariosActivos: (req,res) => {
        var sql = "SELECT  nombre,email, img, rol from usuario where estadoUsuario = 1";
        try {
            conexion.query(sql,(err,usuarios) => {
                if(err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios DB',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });
            });
        } catch (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al contactarse con la BD',
                errors: error
            });
        } 
    }

};


module.exports = UserController;
