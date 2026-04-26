# ☕ Cafetería Sistema — Aplicación Web

Sistema de gestión para cafetería desarrollado con Node.js, Express y MySQL.

---

## ⚙️ Tecnologías utilizadas

| Parte         | Tecnología               |
| ------------- | ------------------------ |
| Backend       | Node.js + Express        |
| Base de datos | MySQL (mysql2)           |
| Sesiones      | express-session + bcrypt |
| Frontend      | HTML5 + CSS3 (vanilla)   |

---

## 🚀 Instalación paso a paso

### 1. Instalar dependencias del proyecto

```bash
npm install
```

### 2. Configurar la base de datos en MySQL

Abre tu cliente de MySQL (XAMPP → phpMyAdmin, o MySQL Workbench) y ejecuta el archivo:

```
database.sql
```

Esto crea la base de datos `cafeteria`, las tablas y datos de ejemplo.

### 3. Ajustar la conexión a MySQL

Abre el archivo `db.js` y cambia la contraseña si tu MySQL la tiene:

```js
password: '',  // ← Pon aquí tu contraseña de MySQL
```

### 4. Crear el usuario administrador

```bash
npm run seed
```

Esto crea el usuario de acceso:

- 📧 Email: `admin@cafeteria.com`
- 🔑 Contraseña: `admin123`

### 5. Iniciar el servidor

```bash
npm run dev    # Desarrollo (se reinicia automáticamente con nodemon)
npm start      # Producción
```

### 6. Abrir en el navegador

Visita: **http://localhost:3000/login.html**

---

## 📁 Estructura del proyecto

```
cafeteria/
├── server.js           → Servidor Express + todas las rutas
├── db.js               → Configuración de la conexión a MySQL
├── seed.js             → Crea el usuario administrador inicial
├── database.sql        → Estructura de la base de datos
├── package.json        → Dependencias del proyecto
├── README.md           → Este archivo
└── public/
    ├── login.html      → Página de inicio de sesión
    ├── dashboard.html  → Panel principal con CRUD de productos
    └── css/
        └── style.css   → Estilos de toda la aplicación
```

---

## 🔌 Rutas del servidor (API)

| Método | Ruta             | Descripción                           |
| ------ | ---------------- | ------------------------------------- |
| GET    | `/sesion`        | Verifica si hay sesión activa         |
| POST   | `/login`         | Iniciar sesión (requiere email+pass)  |
| GET    | `/logout`        | Cerrar sesión                         |
| GET    | `/productos`     | Obtener productos (busca y filtra) 🔒 |
| GET    | `/resumen`       | Obtener métricas del inventario 🔒    |
| POST   | `/productos`     | Crear un nuevo producto 🔒            |
| PUT    | `/productos/:id` | Actualizar un producto 🔒             |
| DELETE | `/productos/:id` | Eliminar un producto 🔒               |

> 🔒 = Ruta protegida. Requiere sesión activa.

---

## 🗃️ Base de datos

**Tabla `usuarios`** — Para el sistema de login
| Campo | Tipo | Descripción |
|-----------|--------------|---------------------------|
| id | INT (PK) | Identificador único |
| nombre | VARCHAR(100) | Nombre del usuario |
| email | VARCHAR(100) | Correo (único) |
| password | VARCHAR(255) | Contraseña encriptada |

**Tabla `productos`** — Inventario de la cafetería
| Campo | Tipo | Descripción |
|-----------|--------------|------------------------------------------|
| id | INT (PK) | Identificador único |
| nombre | VARCHAR(100) | Nombre del producto |
| categoria | ENUM | Bebidas / Comida / Postres / Snacks |
| precio | DECIMAL | Precio unitario |
| stock | INT | Cantidad disponible en inventario |

---

## ✅ Funcionalidades implementadas

- [x] Login con validación de credenciales en la base de datos
- [x] Contraseñas encriptadas con bcrypt
- [x] Manejo de sesiones con express-session
- [x] Rutas protegidas (no accesibles sin sesión)
- [x] CRUD completo de productos (Create, Read, Update, Delete)
- [x] Buscador y filtros por categoría en el inventario
- [x] Exportación de productos a CSV
- [x] Panel con estadísticas del inventario y alertas de stock bajo
- [x] Diseño responsivo (funciona en móvil y escritorio)
- [x] Logout que destruye la sesión
