
'use strict'

var UsuarioModel = function (usuario) 
{
        this.nombre = usuario.nombre;
        this.email = usuario.email;
        this.password = usuario.password;
        this.rol = usuario.rol ? usuario.rol : 'USER_ADM';
        this.img = usuario.img;
        this.googlebol = usuario.googlebol;
        this.estadoUsuario = usuario.estadoUsuario ? usuario.estadoUsuario: 1;
};
    
module.exports = UsuarioModel;
