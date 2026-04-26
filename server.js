// server.js - Servidor principal de la cafetería
// Para ejecutar: npm run dev

const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const db = require('./db');

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesiones
app.use(session({
  secret: 'cafeteria_secreto_2024', 
  resave: false,                    
  saveUninitialized: false          
}));


function requireAuth(req, res, next) {
  if (!req.session.usuario) {
    return res.status(401).json({ error: 'No autorizado. Inicia sesión primero.' });
  }
  next(); // Si hay sesión, continúa a la ruta
}

app.get('/sesion', (req, res) => {
  if (req.session.usuario) {
    res.json({ autenticado: true, usuario: req.session.usuario });
  } else {
    res.json({ autenticado: false });
  }
});

// Login - Valida credenciales y crea la sesión
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Buscar al usuario por email en la base de datos
  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    // Si no se encontró ningún usuario con ese email
    if (results.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado.' });
    }

    const usuario = results[0];

    // Comparar la contraseña ingresada con la encriptada en la BD
    const match = await bcrypt.compare(password, usuario.password);

    if (match) {
      // Guardar datos del usuario en la sesión
      req.session.usuario = {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      };
      res.json({ success: true, usuario: req.session.usuario });
    } else {
      res.status(401).json({ error: 'Contraseña incorrecta.' });
    }
  });
});

// Logout - Destruye la sesión del servidor
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Error al cerrar sesión' });
    res.json({ success: true, mensaje: 'Sesión cerrada correctamente.' });
  });
});

app.get('/productos', requireAuth, (req, res) => {
  const { search, categoria } = req.query;
  const params = [];
  let sql = 'SELECT * FROM productos';
  const conditions = [];

  if (categoria && categoria !== 'Todos') {
    conditions.push('categoria = ?');
    params.push(categoria);
  }

  if (search) {
    conditions.push('(nombre LIKE ? OR categoria LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY categoria, nombre';
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// READ - Obtener un producto por su ID
app.get('/productos/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM productos WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.json(results[0]);
  });
});

// SUMMARY - Obtener métricas del inventario
app.get('/resumen', requireAuth, (req, res) => {
  const sql = `
    SELECT
      COUNT(*) AS total,
      IFNULL(SUM(precio * stock), 0) AS valor,
      SUM(stock <= 10) AS stock_bajo,
      COUNT(DISTINCT categoria) AS categorias
    FROM productos
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

// CREATE - Crear un nuevo producto
app.post('/productos', requireAuth, (req, res) => {
  const { nombre, categoria, precio, stock } = req.body;

  // Validar que los datos requeridos estén presentes
  if (!nombre || !categoria || precio === undefined || stock === undefined) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  const sql = 'INSERT INTO productos (nombre, categoria, precio, stock) VALUES (?, ?, ?, ?)';
  db.query(sql, [nombre, categoria, precio, stock], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: result.insertId, mensaje: 'Producto creado correctamente.' });
  });
});

// UPDATE - Actualizar un producto existente por su ID
app.put('/productos/:id', requireAuth, (req, res) => {
  const { nombre, categoria, precio, stock } = req.body;
  const { id } = req.params;

  const sql = 'UPDATE productos SET nombre = ?, categoria = ?, precio = ?, stock = ? WHERE id = ?';
  db.query(sql, [nombre, categoria, precio, stock, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.json({ success: true, mensaje: 'Producto actualizado correctamente.' });
  });
});

// DELETE - Eliminar un producto por su ID
app.delete('/productos/:id', requireAuth, (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM productos WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.json({ success: true, mensaje: 'Producto eliminado correctamente.' });
  });
});

// RUTA RAÍZ
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// ============================================================
// RUTA 404
// ============================================================
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

// ============================================================
// INICIAR SERVIDOR
// ============================================================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📋 Usa Ctrl+C para detenerlo`);
});
