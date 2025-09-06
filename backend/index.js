const express = require('express');
const cors = require('cors');
const rutas = require('./routes/routes');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Servir la carpeta uploads para acceder a archivos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas de API
app.use('/api', rutas);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
// Exporta la app para pruebas u otros usos
module.exports = app;