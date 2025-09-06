const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'crud',
  multipleStatements: true // <--- agrega esta línea
});

connection.connect((err) => {
  if (err) throw err;
  console.log('DB conectada');
});

module.exports = connection;
