const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../src/config/db'); // conexión a la BD
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'dfaFfDFdfDF_f_dF_df_aF_a_FafASF';

// ===========================
// ESTADÍSTICAS AVANZADAS
// ===========================
router.get('/estadisticas-avanzadas', (req, res) => {
  const queries = [
    // Documentos por usuario
    `SELECT u.nombre AS usuario, COUNT(d.id_documento) AS total
     FROM usuarios u
     LEFT JOIN documentos d ON d.id_usuario = u.id_usuario
     GROUP BY u.id_usuario` ,
    // Documentos por extensión
    `SELECT extension, COUNT(*) AS total FROM documentos GROUP BY extension`,
    // Documentos por hora
    `SELECT HOUR(fecha_hora) AS hora, COUNT(*) AS total FROM documentos GROUP BY hora ORDER BY hora`
  ];
  db.query(queries.join(';'), (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener estadísticas avanzadas', error: err });
    res.json({
      porUsuario: results[0],
      porExtension: results[1],
      porHora: results[2]
    });
  });
});

// ===========================
// REGISTRO DE USUARIO
// ===========================
router.post('/register', async (req, res) => {
  const { nombre, apellido, usuario, email, password } = req.body;
  if (!nombre || !apellido || !usuario || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }
  try {
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO usuarios (nombre, apellido, usuario, email, password) VALUES (?, ?, ?, ?, ?)',
      [nombre, apellido, usuario, email, hashedPassword],
      (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'El correo o usuario ya existe' });
          }
          return res.status(500).json({ message: 'Error al registrar usuario', error: err });
        }
        res.json({ message: 'Usuario registrado correctamente' });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error });
  }
});

// ===========================
// CONFIGURACIÓN DE UPLOADS
// ===========================
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });


router.get('/categorias', (req, res) => {
  db.query('SELECT * FROM categorias', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener categorías', error: err });
    }
    res.json(results);
  });
});


router.get('/usuarios', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener categorías', error: err });
    }
    res.json(results);
  });
});

//-------------
router.get('/lista', (req, res) => {
  db.query(
    `SELECT c.categoria_nombre AS categoria, COUNT(d.id_documento) AS total
     FROM categorias c
     LEFT JOIN documentos d ON d.id_categoria = c.id_categoria
     GROUP BY c.categoria_nombre`,
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error al obtener estadísticas', error: err });
      }
      res.json(results);
    }
  );
});
// ===========================
// LOGIN
// ===========================
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
  }

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Error en la base de datos', error: err });
    if (results.length === 0) return res.status(401).json({ message: 'Usuario no encontrado' });

    const usuario = results[0];
    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, nombre: usuario.nombre, email: usuario.email },
      JWT_SECRET,
      { expiresIn: '4h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email
      }
    });
  });
});

// ===========================
// SUBIR DOCUMENTO
// ===========================
router.post('/documentos/uploads', upload.single('archivo'), (req, res) => {
  const { categoria_id, usuario_id } = req.body;
  const archivo = req.file;

  if (!archivo) {
    return res.status(400).json({ message: 'No se subió ningún archivo' });
  }

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
      if (err) return res.status(500).json({ message: 'Error en la base de datos', error: err });
      res.json({ message: 'Archivo subido correctamente', id: result.insertId });
    }
  );
});

// ===========================
// OBTENER TODOS LOS DOCUMENTOS
// ===========================
router.get('/documentos', (req, res) => {
  db.query(
    `SELECT d.id_documento, d.nombre_documento, d.ruta, d.extension, d.peso, d.fecha_hora,
            c.categoria_nombre, c.categoria_descripcion, u.nombre AS nombre_usuario, u.apellido AS apellido_usuario
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

// ===========================
// ACTUALIZAR DOCUMENTO
// ===========================
router.put('/documentos/:id', (req, res) => {
  const id = req.params.id;
  const { nombre_documento, categoria_id, extension } = req.body;
  db.query(
    'UPDATE documentos SET nombre_documento = ?, id_categoria = ?, extension = ? WHERE id_documento = ?',
    [nombre_documento, categoria_id, extension, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Error al actualizar documento', error: err });
      res.json({ message: 'Documento actualizado correctamente' });
    }
  );
});

// ===========================
// OBTENER CATEGORÍAS POR USUARIO
// ===========================
router.get('/categorias/usuario/:id_usuario', (req, res) => {
  const id_usuario = req.params.id_usuario;
  db.query(
    `SELECT * FROM categorias WHERE id_usuario = ?`,
    [id_usuario],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error al obtener categorías', error: err });
      res.json(results);
    }
  );
});

// ===========================
// OBTENER DOCUMENTOS DE UN USUARIO
// ===========================
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

// ===========================
// LISTAR ARCHIVOS FÍSICOS EN /uploads
// ===========================
router.get('/uploads', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ message: 'Error al leer la carpeta uploads', error: err });

    const archivos = files.map(file => {
      const stats = fs.statSync(path.join(uploadDir, file));
      return {
        nombre: file,
        tamaño: (stats.size / (1024 * 1024)).toFixed(2), // MB
        fecha: stats.mtime
      };
    });

    res.json(archivos);
  });
});

// ===========================
// DESCARGAR ARCHIVO
// ===========================
router.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  res.download(filePath);
});

// ===========================
// ELIMINAR DOCUMENTO
// ===========================
router.delete('/documentos/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT ruta FROM documentos WHERE id_documento = ?', [id], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ message: 'Documento no encontrado' });
    const filePath = path.join(uploadDir, results[0].ruta);
    fs.unlink(filePath, () => {
      db.query('DELETE FROM documentos WHERE id_documento = ?', [id], (err2) => {
        if (err2) return res.status(500).json({ message: 'Error al eliminar de la base de datos', error: err2 });
        res.json({ message: 'Documento eliminado correctamente' });
      });
    });
  });
});

module.exports = router;
