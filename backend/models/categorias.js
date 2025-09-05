const db = require('./db');

// Obtener todas las categorías
const getAllCategorias = (callback) => {
  db.query('SELECT * FROM categorias', (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

// Crear una nueva categoría
const createCategoria = (nombre, descripcion, estado = 'activa', callback) => {
  const sql = `
    INSERT INTO categorias (categoria_nombre, categoria_descripcion, estado)
    VALUES (?, ?, ?)
  `;
  const values = [nombre, descripcion, estado];

  db.query(sql, values, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

module.exports = {
  getAllCategorias,
  createCategoria
};
