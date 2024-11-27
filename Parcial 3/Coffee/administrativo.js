// Validar la contraseña de acceso administrativo
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir que el formulario se recargue

    const password = document.getElementById('password').value;
    const adminPassword = "Coffee"; // Contraseña predeterminada (puedes moverla a un backend para mayor seguridad)

    if (password === adminPassword) {
        // Redirigir al dashboard si la contraseña es correcta
        window.location.href = 'admin_dashboard.html';
    } else {
        // Mostrar mensaje de error si la contraseña es incorrecta
        const errorMessage = document.getElementById('error-message');
        errorMessage.style.display = 'block';
    }
});

