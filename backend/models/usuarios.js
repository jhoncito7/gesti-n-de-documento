const db = require('../src/config/db');// conexión a MySQL
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios
const getAllUsers = (callback) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

// Crear usuario completo
const createUser = async (nombre, apellido, usuario, email, plainPassword, callback) => {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const sql = `
      INSERT INTO usuarios (nombre, apellido, usuario, email, password)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [nombre, apellido, usuario, email, hashedPassword];

    db.query(sql, values, (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  } catch (error) {
    callback(error);
  }
};

module.exports = {
  getAllUsers,
  createUser
};
