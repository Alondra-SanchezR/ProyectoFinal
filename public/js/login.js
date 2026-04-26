async function verificarSesionLogin() {
  try {
    const res = await fetch('/sesion');
    const data = await res.json();

    if (data.autenticado) {
      window.location.href = '/dashboard.html';
    }
  } catch (error) {
    console.error('Error verificando sesión:', error);
  }
}

async function iniciarSesion() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('loginError');
  const btn = document.getElementById('loginBtn');

  if (!email || !password) {
    errorDiv.textContent = 'Por favor ingresa tu correo y contraseña.';
    errorDiv.style.display = 'block';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Verificando...';
  errorDiv.style.display = 'none';

  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      window.location.href = '/dashboard.html';
    } else {
      errorDiv.textContent = data.error || 'Credenciales incorrectas.';
      errorDiv.style.display = 'block';
    }
  } catch (error) {
    errorDiv.textContent = 'Error de conexión. ¿Está corriendo el servidor?';
    errorDiv.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = '☕ Iniciar Sesión';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  verificarSesionLogin();
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter') iniciarSesion();
  });
});
