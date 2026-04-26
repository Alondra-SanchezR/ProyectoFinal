let productos = [];
let modoEdicion = false;
let filtroTimer = null;

function obtenerFiltros() {
  return {
    search: document.getElementById('searchInput')?.value.trim() || '',
    categoria: document.getElementById('categoriaFiltro')?.value || 'Todos'
  };
}

function filtrarProductos() {
  if (filtroTimer) clearTimeout(filtroTimer);
  filtroTimer = setTimeout(cargarProductos, 250);
}

async function verificarSesion() {
  try {
    const res = await fetch('/sesion');
    const data = await res.json();

    if (!data.autenticado) {
      window.location.href = '/login.html';
      return;
    }

    document.getElementById('userName').textContent = data.usuario.nombre;
    document.getElementById('welcomeName').textContent = data.usuario.nombre;
  } catch (error) {
    console.error('Error verificando sesión:', error);
    window.location.href = '/login.html';
  }
}

async function cerrarSesion() {
  if (!confirm('¿Estás seguro que deseas cerrar sesión?')) return;

  await fetch('/logout');
  window.location.href = '/login.html';
}

function mostrarSeccion(nombre) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(`section-${nombre}`).classList.add('active');
  document.getElementById(`nav-${nombre}`).classList.add('active');

  const titulos = {
    panel: 'Panel Principal',
    productos: 'Gestión de Productos'
  };
  document.getElementById('pageTitle').textContent = titulos[nombre] || nombre;
  cerrarSidebar();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('open');
}

function cerrarSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

async function cargarProductos() {
  try {
    const { search, categoria } = obtenerFiltros();
    const query = new URLSearchParams();

    if (search) query.set('search', search);
    if (categoria && categoria !== 'Todos') query.set('categoria', categoria);

    const res = await fetch('/productos' + (query.toString() ? `?${query}` : ''));

    if (res.status === 401) {
      window.location.href = '/login.html';
      return;
    }

    productos = await res.json();
    renderizarTabla();
    actualizarEstadisticas();
  } catch (error) {
    console.error('Error cargando productos:', error);
  }
}

function renderizarTabla() {
  const tbody = document.getElementById('tablaProductos');

  if (productos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="table-empty">📭 No hay productos registrados aún. ¡Agrega el primero!</td></tr>';
    return;
  }

  const catClase = { Bebidas: 'cat-bebidas', Comida: 'cat-comida', Postres: 'cat-postres', Snacks: 'cat-snacks' };
  const catIcono = { Bebidas: '☕', Comida: '🥪', Postres: '🍰', Snacks: '🍿' };

  tbody.innerHTML = productos.map(p => {
    let stockClase = 'stock-ok';
    if (p.stock === 0) stockClase = 'stock-agotado';
    else if (p.stock <= 10) stockClase = 'stock-bajo';

    return `
      <tr>
        <td><strong>#${p.id}</strong></td>
        <td>${p.nombre}</td>
        <td>
          <span class="categoria-badge ${catClase[p.categoria] || ''}">
            ${catIcono[p.categoria] || ''} ${p.categoria}
          </span>
        </td>
        <td class="precio-text">$${parseFloat(p.precio).toFixed(2)}</td>
        <td class="${stockClase} stock-badge">${p.stock} uds.</td>
        <td class="acciones">
          <button class="btn btn-secondary btn-sm" onclick="abrirModalEditar(${p.id})">✏️ Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${p.id}, '${p.nombre.replace(/'/g, "\\'")}')">🗑️ Eliminar</button>
        </td>
      </tr>
    `;
  }).join('');
}

function actualizarEstadisticas() {
  const total = productos.length;
  const stockBajo = productos.filter(p => p.stock <= 10).length;
  const categorias = new Set(productos.map(p => p.categoria)).size;
  const valor = productos.reduce((sum, p) => sum + (parseFloat(p.precio) * p.stock), 0);
  const stockCritico = productos.filter(p => p.stock <= 10).sort((a, b) => a.stock - b.stock);

  document.getElementById('statTotal').textContent = total;
  document.getElementById('statBajo').textContent = stockBajo;
  document.getElementById('statCategorias').textContent = categorias;
  document.getElementById('statValor').textContent = '$' + valor.toFixed(2);

  const criticalList = document.getElementById('criticalStockList');
  if (stockCritico.length === 0) {
    criticalList.innerHTML = '<li>No hay productos con stock crítico.</li>';
  } else {
    criticalList.innerHTML = stockCritico.slice(0, 5).map(p => `
      <li>
        <strong>${p.nombre}</strong> — ${p.stock} uds. (${p.categoria})
      </li>
    `).join('');
  }

  const categoryBreakdown = document.getElementById('categoryBreakdown');
  const counts = productos.reduce((acc, p) => {
    acc[p.categoria] = (acc[p.categoria] || 0) + 1;
    return acc;
  }, {});

  categoryBreakdown.innerHTML = Object.entries(counts).map(([categoria, count]) => `
    <div class="category-row">
      <span>${categoria}</span>
      <span>${count} producto${count === 1 ? '' : 's'}</span>
    </div>
  `).join('') || '<p class="text-muted">No hay productos registrados.</p>';

  const topProductsList = document.getElementById('topProductsList');
  const topProducts = [...productos]
    .map(p => ({
      ...p,
      totalValue: parseFloat(p.precio) * p.stock
    }))
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 3);

  topProductsList.innerHTML = topProducts.length === 0
    ? '<li>No hay productos registrados.</li>'
    : topProducts.map(p => `
        <li>
          <strong>${p.nombre}</strong>
          <span>$${p.totalValue.toFixed(2)}</span>
        </li>
      `).join('');
}

function abrirModalCrear() {
  modoEdicion = false;
  document.getElementById('modalTitulo').textContent = '➕ Nuevo Producto';
  document.getElementById('productoId').value = '';
  document.getElementById('productoNombre').value = '';
  document.getElementById('productoCategoria').value = 'Bebidas';
  document.getElementById('productoPrecio').value = '';
  document.getElementById('productoStock').value = '';
  document.getElementById('modalError').style.display = 'none';
  document.getElementById('modalProducto').classList.add('open');
}

function abrirModalEditar(id) {
  modoEdicion = true;
  const producto = productos.find(p => p.id === id);
  if (!producto) return;

  document.getElementById('modalTitulo').textContent = '✏️ Editar Producto';
  document.getElementById('productoId').value = producto.id;
  document.getElementById('productoNombre').value = producto.nombre;
  document.getElementById('productoCategoria').value = producto.categoria;
  document.getElementById('productoPrecio').value = producto.precio;
  document.getElementById('productoStock').value = producto.stock;
  document.getElementById('modalError').style.display = 'none';
  document.getElementById('modalProducto').classList.add('open');
}

function cerrarModal() {
  document.getElementById('modalProducto').classList.remove('open');
}

async function guardarProducto() {
  const nombre = document.getElementById('productoNombre').value.trim();
  const categoria = document.getElementById('productoCategoria').value;
  const precio = parseFloat(document.getElementById('productoPrecio').value);
  const stock = parseInt(document.getElementById('productoStock').value);
  const errorDiv = document.getElementById('modalError');

  if (!nombre || isNaN(precio) || isNaN(stock) || precio < 0 || stock < 0) {
    errorDiv.textContent = 'Por favor completa todos los campos con valores válidos.';
    errorDiv.style.display = 'block';
    return;
  }

  const datos = { nombre, categoria, precio, stock };

  try {
    let res;
    if (modoEdicion) {
      const id = document.getElementById('productoId').value;
      res = await fetch(`/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
    } else {
      res = await fetch('/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
    }

    const data = await res.json();
    if (res.ok) {
      cerrarModal();
      await cargarProductos();
    } else {
      errorDiv.textContent = data.error || 'Error al guardar el producto.';
      errorDiv.style.display = 'block';
    }
  } catch (error) {
    errorDiv.textContent = 'Error de conexión con el servidor.';
    errorDiv.style.display = 'block';
  }
}

async function eliminarProducto(id, nombre) {
  if (!confirm(`¿Eliminar "${nombre}"?\n\nEsta acción no se puede deshacer.`)) return;

  try {
    const res = await fetch(`/productos/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (res.ok) {
      await cargarProductos();
    } else {
      alert('Error al eliminar: ' + (data.error || 'Error desconocido'));
    }
  } catch (error) {
    alert('Error de conexión con el servidor.');
  }
}

function exportarCSV() {
  if (productos.length === 0) {
    alert('No hay productos para exportar.');
    return;
  }

  const rows = [['ID', 'Nombre', 'Categoría', 'Precio', 'Stock']];
  productos.forEach(p => {
    rows.push([p.id, p.nombre, p.categoria, parseFloat(p.precio).toFixed(2), p.stock]);
  });

  const csv = rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = 'productos_cafeteria.csv';
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', async () => {
  const fecha = new Date().toLocaleDateString('es-MX', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  document.getElementById('headerDate').textContent = fecha;
  await verificarSesion();
  await cargarProductos();
});
