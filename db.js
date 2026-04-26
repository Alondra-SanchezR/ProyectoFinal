// db.js - Módulo de conexión a MySQL
// Se importa en server.js con: const db = require('./db');

const mysql = require('mysql2');

// Configuración de la conexión
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',        
  database: 'cafeteria_db'
});

db.connect(err => {
  if (err) {
    console.error('❌ Error de conexión a MySQL:', err.message);
    return;
  }
  console.log('✅ Conectado a MySQL exitosamente');
});

module.exports = db;
