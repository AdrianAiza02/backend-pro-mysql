var UsuarioModel = require('../models/usuario.model');
var validator = require('validator');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var SEED = require('../config/jwt.config').SEED;
var conexion = require('../config/db.config');

var LoginController = {
    login : (req, res ) => {
        var body = req.body;
        var validate_correo = !validator.isEmpty(body.email) && validator.isEmail(body.email);
        var validate_password = !validator.isEmpty(body.password);
        
        
        if (validate_correo && validate_password) {
            var sqlLogin = "SELECT * from usuario where email = ? and estadoUsuario = 1";
            try {
                conexion.query(sqlLogin,[body.email.toLowerCase(),body.password], (err,usuarioDB) => {
                    if (err) {
                        return res.status(500).send({
                            ok: false,
                            mensaje: 'Error al buscar usuario',
                            errors: err
                        });
                    }
                    if (usuarioDB.length == 0) {
                        return res.status(200).send({
                            ok: false,
                            mensaje: 'credenciales incorrectas - email ',
                            errors : err
                        });
                    }
                    if (!bcrypt.compareSync(body.password,usuarioDB[0].password)) {
                        return res.status(200).send({
                            ok: false,
                            mensaje: 'credenciales incorrectas - password',
                            errors : err
                        });
                    }
                    usuarioDB[0].password = undefined;
                    var token = jwt.sign({usuario: usuarioDB},SEED,{
                        expiresIn: 1800
                    });
                    res.status(200).send({
                        ok: true,
                        mensaje: 'Login post correcto',
                        usuario : usuarioDB,
                        token: token
                    });
                });
            } catch (error) {
                return res.status(200).send({
                    ok: false,
                    errors: error
                });
            }    
        }
        else{
            return res.status(200).send({
                ok: false,
                mensaje: 'debe llenar los campos correspondientes'
            });
        }
    }
};

module.exports = LoginController;