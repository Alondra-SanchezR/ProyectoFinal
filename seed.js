// seed.js - Script para crear el usuario administrador inicial
// Ejecutar con: npm run seed

const bcrypt = require('bcrypt');
const db = require('./db');

async function crearAdmin() {
  try {
    // Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const sql = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';
    db.query(sql, ['Administrador', 'admin@cafeteria.com', hashedPassword], (err) => {
      if (err) {
        // Si el email ya existe, solo avisar
        if (err.code === 'ER_DUP_ENTRY') {
          console.log('⚠️  El usuario admin ya existe en la base de datos.');
        } else {
          console.error('❌ Error al crear el usuario:', err.message);
        }
      } else {
        console.log('✅ Usuario administrador creado exitosamente.');
        console.log('   📧 Email:      admin@cafeteria.com');
        console.log('   🔑 Contraseña: admin123');
        console.log('');
        console.log('   → Inicia el servidor con: npm run dev');
      }
      db.end();
    });

  } catch (error) {
    console.error('Error inesperado:', error);
    db.end();
  }
}

crearAdmin();
