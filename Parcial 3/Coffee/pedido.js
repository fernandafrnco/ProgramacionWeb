// Variable para almacenar el total general
let totalGeneral = 0;

// URL base de la API para obtener el menú
const API_BASE_URL = 'http://localhost:3000/Coffee/menu/';

// Función para manejar la compra
document.getElementById('realizarCompraBtn').addEventListener('click', function(event) {
    event.preventDefault();  // Evitar que el formulario se recargue
    // Contenedor para mostrar errores
    const erroresDiv = document.getElementById('errores');
    erroresDiv.innerHTML = ''; 

    // Validamos que el cliente haya ingresado sus datos
    const nombreCliente = document.getElementById('nombre_cliente').value;
    const domicilioCliente = document.getElementById('domicilio').value;
    let errores = [];

    if (!nombreCliente || !domicilioCliente) {
        errores.push('Completar todos los campos.');     
    }

    if (errores.length > 0) {
        // Mostrar errores en el contenedor
        errores.forEach(error => {
            const p = document.createElement('p');
            p.textContent = error;
            erroresDiv.appendChild(p);
        });
        return; 
    }


    // Recoger productos seleccionados y sus cantidades
    const productosSeleccionados = [];
    const productos = document.querySelectorAll('.producto');  // Asegúrate de que el HTML tenga la clase 'producto'

    productos.forEach(producto => {
        const idProducto = producto.dataset.idProducto;  // id_producto de cada producto
        const cantidad = parseInt(producto.querySelector('.cantidad').value) || 0;  // Convertir a entero
        const precio = parseFloat(producto.querySelector('.precio').textContent.replace('$', '').trim()) || 0;  // Precio del producto

        productosSeleccionados.push({
            id_producto: idProducto,
            cantidad: cantidad,
            precio: precio
        });
    });

    // Calcular el total general (sumar los productos seleccionados)
    totalGeneral = 0;
    productosSeleccionados.forEach(item => {
        totalGeneral += item.precio * item.cantidad;
    });

    // Generar ID del pedido (puede ser automático, o un campo oculto)
    const idPedido = Math.floor(Math.random() * 1000);  // Solo el número, sin el prefijo 'PED'

    // Crear la fecha en formato compatible con MySQL (YYYY-MM-DD HH:MM:SS)
const fecha = new Date();
const fechaMySQL = fecha.getFullYear() + '-' + (fecha.getMonth() + 1).toString().padStart(2, '0') + '-' + 
                   fecha.getDate().toString().padStart(2, '0') + ' ' + 
                   fecha.getHours().toString().padStart(2, '0') + ':' + 
                   fecha.getMinutes().toString().padStart(2, '0') + ':' + 
                   fecha.getSeconds().toString().padStart(2, '0');

    // Enviar datos al servidor (POST request)
    fetch('http://localhost:3000/Coffee/pedido/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_pedido: idPedido,  // ID único para el pedido
            fecha: fechaMySQL,
            nombre_cliente: nombreCliente,
            domicilio: domicilioCliente,
            total: totalGeneral,  // Aquí enviamos el total calculado
            estado: 'Pendiente',  // El estado del pedido puede ser "Pendiente", "En preparación", "Completado", etc.
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            // alert(data.message);  // Muestra el mensaje de éxito o error

            // Mostrar resumen de la compra
            document.getElementById('nombreCliente').textContent = nombreCliente;
            document.getElementById('domicilioCliente').textContent = domicilioCliente;
            document.getElementById('totalCompra').textContent = totalGeneral.toFixed(2);  // Mostrar el total calculado

            const fechaActual = new Date();
            document.getElementById('fechaPedido').textContent = fechaActual.toLocaleString();
            document.getElementById('pedidoId').textContent = idPedido;

            // Ocultar el formulario y mostrar el resumen
            document.getElementById('pedidoForm').style.display = 'none';
            document.getElementById('resumenCompra').style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error al realizar el pedido:', error);
        alert('Hubo un error al realizar el pedido. Intenta de nuevo.');
    });
});

// Función para actualizar el total en tiempo real
function actualizarTotal() {
    totalGeneral = 0;
    const productos = document.querySelectorAll('.producto');
    productos.forEach(producto => {
        const cantidad = parseInt(producto.querySelector('.cantidad').value) || 0;
        const precio = parseFloat(producto.querySelector('.precio').textContent.replace('$', '').trim()) || 0;
        totalGeneral += cantidad * precio;
    });
    const totalElement = document.getElementById('totalCompra');
    if (totalElement) {
        totalElement.textContent = totalGeneral.toFixed(2);
    } else {
        console.error("El elemento con ID 'totalCompra' no existe en el HTML.");
    }

    const totalElement2 = document.getElementById('totalCompra2');
    if (totalElement2) {
        totalElement2.textContent = totalGeneral.toFixed(2);
    } else {
        console.error("El elemento con ID 'totalCompra2' no existe en el HTML.");
    }
}

// Función para agregar un producto al listado de productos seleccionados
function agregarProductoAlListado(producto) {
    const listadoMenu = document.getElementById('listado-menu');
    
    // Crear un contenedor para el producto
    const productoElement = document.createElement('div');
    productoElement.classList.add('producto');
    productoElement.dataset.idProducto = producto.id_producto;  // Asegúrate de agregar el ID del producto en un atributo

    productoElement.innerHTML = `
        <h3>${producto.nombre_producto}</h3>
        <p class="descripcion">${producto.descripcion}</p>
        <p class="precio">$ ${producto.precio}</p>
        <label for="cantidad-${producto.id_producto}">Cantidad:</label>
        <input type="number" class="cantidad" id="cantidad-${producto.id_producto}" value="0" min="0" oninput="actualizarTotal()" />
    `;
    
    // Agregar el producto al listado de productos seleccionados
    listadoMenu.appendChild(productoElement);
}

// Llamada a la API para obtener el menú de productos
async function obtenerMenu() {
    try {
        const response = await fetch(API_BASE_URL);
        const productos = await response.json();

        if (response.ok) {
            // Añadir productos al listado
            productos.forEach(producto => {
                agregarProductoAlListado(producto);
            });
        } else {
            alert(productos.message || 'No se pudieron obtener los productos del menú');
        }
    } catch (error) {
        console.error('Error al obtener el menú:', error);
    }
}

// Evento para el botón de descargar el comprobante de pago
document.getElementById('descargarComprobanteBtn').addEventListener('click', function() {
    generarComprobantePDF();  // Llamamos a la función para generar el PDF
});


// Función para generar el comprobante de pago en PDF
function generarComprobantePDF() {
    const { jsPDF } = window.jspdf;  // Accedemos a la clase jsPDF

    // Crear un nuevo documento PDF
    const doc = new jsPDF();

    // Agregar el título
    doc.setFontSize(18);
    doc.text('Comprobante de Pago', 20, 20);

    // Agregar los detalles del pedido
    doc.setFontSize(12);
    doc.text(`Nombre del cliente: ${document.getElementById('nombreCliente').textContent}`, 20, 30);
    doc.text(`Domicilio: ${document.getElementById('domicilioCliente').textContent}`, 20, 40);
    doc.text(`Fecha del pedido: ${document.getElementById('fechaPedido').textContent}`, 20, 50);
    doc.text(`ID del pedido: ${document.getElementById('pedidoId').textContent}`, 20, 60);
    doc.text(`Total a pagar: $${document.getElementById('totalCompra').textContent}`, 20, 70);

    // Agregar una línea para separar
    doc.line(20, 75, 180, 75);

    // Guardar el PDF con un nombre basado en el ID del pedido
    doc.save(`Comprobante_Pedido_${document.getElementById('pedidoId').textContent}.pdf`);
}




// Llamada inicial para obtener todos los productos del menú
obtenerMenu();
