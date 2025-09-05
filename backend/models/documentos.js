const db = require('../src/config/db'); // si documentos.js está en backend/models/

// Obtener todos los documentos
const getAllDocumentos = (callback) => {
  db.query('SELECT * FROM documentos', (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

// Obtener documentos con JOIN (opcional)
const getDocumentosConDetalles = (callback) => {
  const sql = `
    SELECT 
      d.id_documento,
      d.nombre_documento,
      d.peso,
      d.extension,
      d.fecha_hora,
      d.id_usuario,
      d.id_categoria,
      u.nombre AS nombre_usuario,
      u.apellido AS apellido_usuario,
      u.usuario AS usuario_login,
      c.categoria_nombre,
      c.categoria_descripcion,
      c.estado
    FROM documentos d
    JOIN usuarios u ON d.id_usuario = u.id_usuario
    JOIN categorias c ON d.id_categoria = c.id_categoria
  `;
  db.query(sql, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

// Crear nuevo documento
const createDocumento = (nombre, peso, extension, id_usuario, id_categoria, callback) => {
  const sql = `
    INSERT INTO documentos (nombre_documento, peso, extension, id_usuario, id_categoria)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [nombre, peso, extension, id_usuario, id_categoria];

  db.query(sql, values, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

module.exports = {
  getAllDocumentos,
  getDocumentosConDetalles,
  createDocumento
};
