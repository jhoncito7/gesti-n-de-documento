const db = require('../src/config/db');

// Usuarios
const getAllUsers = (callback) => {
  db.query('SELECT * FROM usuarios', callback);
};


const bcrypt = require('bcryptjs');
const createUser = (nombre, apellido, usuario, email, password, callback) => {
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return callback(err);
    db.query(
      'INSERT INTO usuarios (nombre, apellido, usuario, email, password) VALUES (?, ?, ?, ?, ?)',
      [nombre, apellido, usuario, email, hash],
      callback
    );
  });
};

// Documentos
const getAllDocuments = (callback) => {
  db.query('SELECT * FROM documentos', callback);
};

const createDocument = (titulo, contenido, categoria_id, usuario_id, callback) => {
  db.query('INSERT INTO documentos (titulo, contenido, categoria_id, usuario_id) VALUES (?, ?, ?, ?)', [titulo, contenido, categoria_id, usuario_id], callback);
};

// Categorías
const getAllCategorias = (callback) => {
  db.query('SELECT * FROM categorias', callback);
};

const createCategoria = (nombre, callback) => {
  db.query('INSERT INTO categorias (nombre) VALUES (?)', [nombre], callback);
};

const getUserByEmail = (email, callback) => {
  db.query('SELECT * FROM usuarios WHERE email = ?', [email], callback);
};

module.exports = {
  getAllUsers,
  createUser,
  getAllDocuments,
  createDocument,
  getAllCategorias,
  createCategoria,
  getUserByEmail
};
