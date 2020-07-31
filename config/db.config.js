var mysql = require('mysql');

//bases de datos
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Univalle',
    database : 'bddhospital'
  });
   
  connection.connect((err) => {
      if(err){
          throw err;
      }
      console.log('Base de datos MYSQL: \x1b[32m%s\x1b[0m', 'online');
  });

  module.exports = connection;