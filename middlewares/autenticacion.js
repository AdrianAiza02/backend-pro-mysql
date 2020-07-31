'use strict'
var jwt = require('jsonwebtoken');
var SEED = require('../config/jwt.config').SEED;

exports.auth = (req,res,next) => {

    //comprobar si llega autorizacion
    if (!req.headers.authorization) {
        return res.status(403).send({
            ok: false,
            mensaje: 'la peticion no tiene la cabecera de authorization'
        });
    }

    //limpiar el token y quitar comillar
    var token = req.headers.authorization.replace(/['"]+/g,'');//eliminara las comillas del token q le enviemos

    jwt.verify(token,SEED, (err,decoded)=> {
        if (err) {
            return res.status(401).send({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }
        //enviamos al usuario q esta ejecutando la accion
        req.usuario = decoded.usuario;
        next();
        /*res.status(200).send({
            ok: true,
            decoded: decoded
        });*/
    })
    
}