const API_BASE_URL = 'http://localhost:3000';

async function cargarMenu() {
    // Lógica para cargar el menú desde la API
}

async function enviarPedido(event) {
    // Lógica para enviar un pedido desde el formulario
}

async function validarAcceso(event) {
    event.preventDefault();
    const password = document.getElementById('password').value;
    if (password === '1234') {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('admin-content').style.display = 'block';
    } else {
        alert('Contraseña incorrecta.');
    }
}
