-- database.sql
-- Ejecuta este archivo en MySQL antes de iniciar el servidor
-- En XAMPP: abre phpMyAdmin → pestaña SQL → pega y ejecuta

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS cafeteria;
USE cafeteria;

-- Tabla de usuarios (para el login)
CREATE TABLE IF NOT EXISTS usuarios (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nombre     VARCHAR(100)  NOT NULL,
  email      VARCHAR(100)  NOT NULL UNIQUE,
  password   VARCHAR(255)  NOT NULL,           -- Se guarda encriptado con bcrypt
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla principal: productos del menú / inventario
CREATE TABLE IF NOT EXISTS productos (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nombre     VARCHAR(100)  NOT NULL,
  categoria  ENUM('Bebidas', 'Comida', 'Postres', 'Snacks') NOT NULL,
  precio     DECIMAL(10,2) NOT NULL,
  stock      INT           NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datos de ejemplo para probar el sistema
INSERT INTO productos (nombre, categoria, precio, stock) VALUES
('Café Americano',      'Bebidas', 25.00, 50),
('Cappuccino',          'Bebidas', 35.00, 40),
('Café Latte',          'Bebidas', 38.00, 35),
('Agua Natural',        'Bebidas', 12.00, 80),
('Sandwich de Jamón',   'Comida',  45.00, 20),
('Quesadilla',          'Comida',  40.00, 15),
('Burrito',             'Comida',  55.00,  8),
('Pastel de Chocolate', 'Postres', 30.00, 12),
('Cheesecake',          'Postres', 35.00,  6),
('Galletas',            'Snacks',  18.00, 30),
('Papas Fritas',        'Snacks',  20.00, 25),
('Nachos',              'Snacks',  22.00,  3);
