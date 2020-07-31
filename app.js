//importaciones
var express = require('express');
var bodyParser = require('body-parser');

//variables
var app = express();


//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//importar rutas
var usuarioRoutes = require('./routes/usuario.routes');
//rutas
app.use('/usuario',usuarioRoutes);

//peticiones
app.listen(3000, () => {
    console.log('Express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});