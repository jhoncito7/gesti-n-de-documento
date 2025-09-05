/* const express = require('express');
const cors = require('cors');
const db = require('./src/config/db');
const routes = require('./routes/routes');

const app = express();
app.use(cors());
app.use(express.json());


app.use('/uploads', express.static('uploads'));
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
}); */


/* const express = require('express');
const app = express();
const rutas = require('./routes/routes');

app.use(express.json());
app.use('/api', rutas);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
 */

/* const express = require('express');
const path = require('path');
const app = express();
const rutas = require('./routes/routes');

app.use(express.json());
app.use('/api', rutas);

// Servir archivos estáticos en /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`)); */
 // Exporta la app para pruebas u otros usos

// Asegúrate de tener la carpeta 'uploads' creada en el mismo nivel que este archivo
// o maneja su creación en el código si no existe.

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