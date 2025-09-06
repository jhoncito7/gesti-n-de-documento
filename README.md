# Documentación del Proyecto: Gestión de Documentos

## Índice
1. Instalaciones necesarias
2. Configuración de la base de datos
3. Configuración del backend
4. Configuración del frontend
5. Cómo ejecutar el backend
6. Cómo ejecutar el frontend
7. Notas adicionales

---

## 1. Instalaciones necesarias

- Node.js (v14+ recomendado)
- npm (gestor de paquetes de Node)
- MySQL Server
- (Opcional) Laragon o XAMPP para entorno local

### Instalaciones de dependencias (ya realizadas en el proyecto):

**Backend:**
- express
- mysql2
- multer
- bcrypt
- jsonwebtoken
- cors

**Frontend:**
- react
- react-dom
- axios
- recharts
- vite

---

## 2. Configuración de la base de datos

1. Crea una base de datos llamada `crud` en MySQL.
2. Ejecuta el siguiente script para crear las tablas necesarias:

```sql
CREATE TABLE usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50),
  apellido VARCHAR(50),
  usuario VARCHAR(50) UNIQUE,
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);

CREATE TABLE categorias (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  categoria_nombre VARCHAR(100),
  categoria_descripcion VARCHAR(255),
  id_usuario INT,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE documentos (
  id_documento INT AUTO_INCREMENT PRIMARY KEY,
  nombre_documento VARCHAR(255),
  ruta VARCHAR(255),
  extension VARCHAR(10),
  peso FLOAT,
  fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
  id_usuario INT,
  id_categoria INT,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);
```

---

## 3. Configuración del backend

1. Ve a la carpeta `backend`.
2. Abre el archivo `src/config/db.js` y asegúrate de que la configuración sea correcta:

```js
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'crud',
  multipleStatements: true // ¡Importante para estadísticas avanzadas!
});
```
3. Instala las dependencias si es necesario:
```bash
npm install
```

---

## 4. Configuración del frontend

1. Ve a la carpeta `frontend`.
2. Instala las dependencias:
```bash
npm install
```

---

## 5. Cómo ejecutar el backend

1. Ve a la carpeta `backend`:
```bash
cd backend
```
2. Ejecuta el servidor:
```bash
node index.js
```
El backend correrá por defecto en `http://localhost:3000`.

---

## 6. Cómo ejecutar el frontend

1. Ve a la carpeta `frontend`:
```bash
cd frontend
```
2. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```
El frontend estará disponible en `http://localhost:5173` (o el puerto que indique Vite).

---

## 7. Notas adicionales
- Los archivos subidos se guardan en la carpeta `backend/uploads`.
- Si cambias el usuario o contraseña de MySQL, actualízalo en `src/config/db.js`.
- El backend debe estar corriendo para que el frontend pueda consumir la API.
- Si tienes problemas con CORS, asegúrate de que `cors()` esté habilitado en el backend.
- Para estadísticas avanzadas, asegúrate de tener `multipleStatements: true` en la conexión MySQL.

---

¡Listo! Así puedes instalar, configurar y ejecutar el sistema de gestión de documentos.
