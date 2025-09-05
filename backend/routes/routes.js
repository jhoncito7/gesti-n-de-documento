const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../src/config/db'); // tu conexión a la base de datos

// Crear carpeta uploads si no existe
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuración multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Ruta para subir archivos
router.post('/documentos/upload', upload.single('archivo'), (req, res) => {
  const { categoria_id, usuario_id } = req.body;
  const archivo = req.file;

  if (!archivo) {
    return res.status(400).json({ message: 'No se subió ningún archivo' });
  }

  // Guardar info en base de datos
  db.query(
    `INSERT INTO documentos (nombre_documento, ruta, extension, peso, id_usuario, id_categoria)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      archivo.originalname,
      archivo.filename,
      path.extname(archivo.originalname).substring(1),
      archivo.size / (1024 * 1024), // peso en MB
      usuario_id,
      categoria_id
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error en la base de datos', error: err });
      }
      res.json({ message: 'Archivo subido correctamente', id: result.insertId });
    }
  );
});

// Obtener todos los documentos (con detalles de usuario y categoría)
router.get('/documentos', (req, res) => {
  db.query(
    `SELECT d.id_documento, d.nombre_documento, d.ruta, d.extension, d.peso, d.fecha_hora,
            c.categoria_nombre, u.nombre AS nombre_usuario, u.apellido AS apellido_usuario
     FROM documentos d
     LEFT JOIN categorias c ON d.id_categoria = c.id_categoria
     LEFT JOIN usuarios u ON d.id_usuario = u.id_usuario
     ORDER BY d.fecha_hora DESC`,
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error al obtener documentos', error: err });
      res.json(results);
    }
  );
});

// Obtener documentos solo del usuario logueado
router.get('/documentos/usuario/:id_usuario', (req, res) => {
  const id_usuario = req.params.id_usuario;
  db.query(
    `SELECT d.id_documento, d.nombre_documento, d.ruta, d.extension, d.peso, d.fecha_hora,
            c.categoria_nombre
     FROM documentos d
     LEFT JOIN categorias c ON d.id_categoria = c.id_categoria
     WHERE d.id_usuario = ?
     ORDER BY d.fecha_hora DESC`,
    [id_usuario],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error al obtener documentos', error: err });
      res.json(results);
    }
  );
});

// Descargar archivo
router.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  res.download(filePath);
});

// Eliminar documento y archivo físico
router.delete('/documentos/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT ruta FROM documentos WHERE id_documento = ?', [id], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ message: 'Documento no encontrado' });
    const filePath = path.join(uploadDir, results[0].ruta);
    fs.unlink(filePath, (err) => {
      // No importa si el archivo ya no existe, seguimos con la BD
      db.query('DELETE FROM documentos WHERE id_documento = ?', [id], (err2) => {
        if (err2) return res.status(500).json({ message: 'Error al eliminar de la base de datos', error: err2 });
        res.json({ message: 'Documento eliminado correctamente' });
      });
    });
  });
});

// Puedes agregar más rutas aquí, por ejemplo, obtener usuarios, categorías, etc.

module.exports = router;


