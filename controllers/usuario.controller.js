'use strict'
var conexion = require('../config/db.config');
var UsuarioModel = require('../models/usuario.model');
var bcrypt = require('bcrypt');
var validator = require('validator');

var UserController = {

    getUsuariosActivos: (req,res) => {
        var sql = "SELECT  nombre,email, password,img, rol from usuario where estadoUsuario = 1";
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
    },
    InsertarUsuario: (req,res) => {
        var paramsBody = req.body;
        var validate_nombre = !validator.isEmpty(paramsBody.nombre);
        var validate_correo = !validator.isEmpty(paramsBody.email) && validator.isEmail(paramsBody.email);
        var validate_password = !validator.isEmpty(paramsBody.password);;

        if (validate_nombre && validate_correo  && validate_password) {
            var usuario = new UsuarioModel({
                nombre: paramsBody.nombre,
                email: paramsBody.email.toLowerCase(),
                password: paramsBody.password,
                img: paramsBody.img,
                role: paramsBody.role,
                estadoUsuario: paramsBody.estadoUsuario
            });
            var sqlExiste = "SELECT * FROM usuario where email = ?";
            
            try {
                conexion.query(sqlExiste,[usuario.email],(err, issetUser) => {
                    if(err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al comprobar  usuarios DB',
                            errors: err
                        });
                    }
                    //console.log("packet",issetUser.length);
                    if (issetUser.length == 0) {
                        console.log("ENTRO CONDICIONAL")
                        const hashDB = bcrypt.hashSync(usuario.password,10);
                        usuario.password = hashDB;
                        var sqlInsert = "INSERT INTO usuario set ?";
                        conexion.query(sqlInsert, usuario, (err, usuarioGuardado) => {
                            if(err) {
                                return res.status(500).json({
                                    ok: false,
                                    mensaje: 'Error al insertar  usuario DB',
                                    errors: err
                                });
                            }
                            return res.status(200).send({
                                ok: true,
                                mensaje: 'Usuario guardado con exito',
                                usuarioData: usuarioGuardado,
                                usuarioToken: req.usuario
                                
                            });
                        });
                    }
                    else{
                        return res.status(500).send({
                            ok: false,
                            message: "El usuario ya esta registrado en la BD"
                          
                        });
                    }
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
                message: "Introduzca datos correctos"
            });
        }
    },

    updateUsuario: (req,res) => {
        var id = req.params.id;
        var paramsBody = req.body


        var sqlExiste = "SELECT * FROM usuario where idUsuario = ?";
        try {
            conexion.query(sqlExiste,[id], (err,usuarioBD)=> {
                if (err) {
                    return res.status(500).send({
                        ok: false,
                        mensaje: 'Error al recuperar usuario by id BD',
                        errors: err
                    });
                }
                console.log("USUARIO",usuarioBD);
                if (usuarioBD.length == 0) {
                    return res.status(500).send({
                        ok: false,
                        mensaje: 'El usuario no existe',
                        errors: {mensaje: 'No existe un usuario con ese id'}
                    });
                }
                var validate_nombre = !validator.isEmpty(paramsBody.nombre);
                var validate_correo = !validator.isEmpty(paramsBody.email) && validator.isEmail(paramsBody.email);
                //var validate_password = !validator.isEmpty(paramsBody.password);;
                if (validate_nombre && validate_correo) {
                    usuarioBD.nombre = paramsBody.nombre;
                    usuarioBD.correo = paramsBody.email;
                    usuarioBD.rol = paramsBody.rol;
                    var sqlUpdate = "UPDATE usuario SET nombre = ?, email = ?, rol = ? WHERE idusuario = ?";
                    conexion.query(sqlUpdate,[usuarioBD.nombre,usuarioBD.correo,usuarioBD.rol,id],(err,usuarioActualizado) => {
                        if (err) {
                            return res.status(500).send({
                                ok: false,
                                mensaje: 'Error al actualizar usuario ',
                                errors: err
                            });
                        }
                        res.status(500).send({
                            ok: true,
                            mensaje: 'Usuario actualizado con exito'
                        });
                        
                    });
                } 
                else {
                    return res.status(200).send({
                        ok: false,
                        message: "Introduzca datos correctos"
                    });
                }
            });
        } catch (error) {
            return res.status(200).send({
                ok: false,
                errors: error
            });
        }
        

        
    },

    deleteUsuarioBD: (req,res) => {
        var id = req.params.id;
        var sql = "DELETE FROM usuario where idUsuario = ?";
        try {
            conexion.query(sql,id,(err,usuarioDelete) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al eliminar uusario DB',
                        errors: err
                    });
                }
                //console.log("DELETE????",usuarioDelete.affectedRows);
                if(usuarioDelete.affectedRows == 0){
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'No existe un usuario con ese id',
                        errors: {mensaje: 'no existe un usuario con ese id'}
                    });
                }
                res.status(200).send({
                    ok: true,
                    mensaje: 'Eliminado con existo de la base de datos',
                    usuarios : usuarioDelete
                });
                
            });
        } catch (error) {
            return res.status(200).send({
                ok: false,
                errors: error
            });
        }
    },

    deleteLogicoDB: (req,res) => {
        var id = req.params.id;
        var sql = "UPDATE usuario set estadoUsuario = 0 where idusuario = ?";
        try {
            conexion.query(sql,[id],(err,usuarioDeleteLogico) => {
                if (err) {
                    return res.status(200).send({
                        ok: false,
                        mensaje: 'Error al eliminar logico BD',
                        errors: err
                    });
                }
                if (usuarioDeleteLogico.affectedRows == 0) {
                    return res.status(200).send({
                        ok: false,
                        mensaje: 'no existe un usuario con ese id',
                        errors: {mensaje: 'no existe un usuario con ese id'}
                    });
                }
                res.status(200).send({
                    ok: true,
                    mensaje: 'Usuario eliminado bd con exito'
                });
            });
        } catch (error) {
            return res.status(200).send({
                ok: false,
                errors: error
            });
        }
    }

};


module.exports = UserController;
