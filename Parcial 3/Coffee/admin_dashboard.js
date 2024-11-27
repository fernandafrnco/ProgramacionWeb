const API_PEDIDOS_URL = 'http://localhost:3000/Coffee/pedido/';
const API_MENU_URL = 'http://localhost:3000/Coffee/menu/';
const API_PRODUCTO_URL = 'http://localhost:3000/Coffee/producto/';

// Función para cargar la tabla de menú
async function cargarMenu() {
    try {
        const response = await fetch('http://localhost:3000/Coffee/menu/');
        const productos = await response.json();

        const tbody = document.getElementById('menu-table').querySelector('tbody');
        tbody.innerHTML = ''; // Limpiar la tabla

        productos.forEach(producto => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${producto.id_producto}</td>
                <td class="editable" data-column="nombre_producto">${producto.nombre_producto}</td>
                <td class="editable" data-column="descripcion">${producto.descripcion}</td>
                <td class="editable" data-column="precio">${producto.precio}</td>
                <td class="editable" data-column="categoria">${producto.categoria}</td> <!-- Celda para la categoría -->
                <td>
                    <button class="edit-btn">Editar</button>
                    <button class="delete-btn">Eliminar</button>                    
                    <button class="save-btn" style="display: none;">Guardar</button>
                </td> <!-- Celda para las acciones -->
            `;
            tbody.appendChild(fila);
        });

        // Asociar eventos a los botones
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', habilitarEdicion);
        });
        document.querySelectorAll('.save-btn').forEach(btn => {
            btn.addEventListener('click', guardarEdicion);
        });
        document.querySelectorAll('.delete-btn').forEach(btn => 
            btn.addEventListener('click', eliminarProducto)
        );
    } catch (error) {
        console.error('Error al cargar el menú:', error);
    }
}
cargarMenu();

// Función para eliminar un producto del menú
function eliminarProducto(event) {
    const fila = event.target.closest('tr'); // Encuentra la fila correspondiente al botón
    const idProducto = fila.cells[0].textContent; // Obtiene el id_producto de la primera celda
    console.log('ID del producto:', idProducto);

    if (!idProducto) {
        console.error('Error: El ID no está definido o es inválido.');
        return;
    }

    fetch(`${API_PRODUCTO_URL}${idProducto}`, {
        method: 'DELETE'
    })
    .then(() => {
        console.log(`Producto con ID ${idProducto} eliminado con éxito.`);
        cargarMenu(); // Recargar el menú
    })
    .catch(error => console.error('Error al eliminar producto:', error));
}

function habilitarEdicion(event) {
    const fila = event.target.closest('tr');
    fila.querySelectorAll('.editable').forEach(celda => {
        const valorActual = celda.textContent;
        celda.innerHTML = `<input type="text" value="${valorActual}" data-original="${valorActual}">`;
    });

    // Mostrar el botón "Guardar" y ocultar "Editar"
    fila.querySelector('.edit-btn').style.display = 'none';
    fila.querySelector('.save-btn').style.display = 'inline-block';
}
// Función para editar un pedido
function editarPedido(event) {
    const fila = event.target.closest('tr');
    fila.querySelectorAll('.editable').forEach(celda => {
        const valorActual = celda.textContent;
        celda.innerHTML = `<input type="text" value="${valorActual}" data-original="${valorActual}">`;
    });

    // Mostrar el botón "Guardar" y ocultar "Editar"
    fila.querySelector('.edit-pedido').style.display = 'none';
    fila.querySelector('.save-pedido').style.display = 'inline-block';
}

async function guardarEdicion(event) {
    const fila = event.target.closest('tr');
    const idProducto = fila.cells[0].textContent; // ID Producto
    const datosActualizados = {};

    // Recoger los datos de las celdas editables
    fila.querySelectorAll('.editable').forEach(celda => {
        const input = celda.querySelector('input');
        if (input) {
            const columna = celda.dataset.column;
            datosActualizados[columna] = input.value;
        }
    });

    try {
        // Hacer la solicitud PUT al backend
        const response = await fetch(`http://localhost:3000/Coffee/producto/${idProducto}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosActualizados)
        });

        // Verificar si la respuesta fue exitosa
        if (response.ok) {
            alert('Producto actualizado con éxito');
            
            // Actualizar la fila con los nuevos datos
            fila.querySelectorAll('.editable').forEach(celda => {
                const input = celda.querySelector('input');
                if (input) {
                    celda.textContent = input.value; // Actualizar el texto de la celda con el valor del input
                }
            });

            // Restaurar los botones
            fila.querySelector('.edit-btn').style.display = 'inline-block';
            fila.querySelector('.save-btn').style.display = 'none';

            // Hacer que las celdas se vuelvan no editables nuevamente
            fila.querySelectorAll('.editable').forEach(celda => {
                const input = celda.querySelector('input');
                if (input) {
                    celda.textContent = input.value; // Cambiar input por texto
                }
            });
        } else {
            alert('Error al actualizar el producto');
        }
    } catch (error) {
        console.error('Error al guardar cambios:', error);
    }
}

// Función para cargar la tabla de pedidos
async function cargarPedidos() {
    try {
        const response = await fetch(API_PEDIDOS_URL);
        const pedidos = await response.json();
        const tableBody = document.querySelector('#pedidos-table tbody');
        tableBody.innerHTML = ''; // Limpiar la tabla

        pedidos.forEach(pedido => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pedido.id_pedido}</td>
                <td>${pedido.nombre_cliente}</td>
                <td>${pedido.domicilio}</td>
                <td>${pedido.fecha}</td>
                <td>$${pedido.total}</td>
                <td>${pedido.estado}</td>
                <td>
                    <button class="edit-pedido" data-id="${pedido.id_pedido}">Editar</button>
                    <button class="delete-pedido" data-id="${pedido.id_pedido}">Eliminar</button>
                    <button class="save-pedido" style="display: none;">Guardar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        document.querySelectorAll('.edit-pedido').forEach(btn => 
            btn.addEventListener('click', editarPedido)            
        );
        document.querySelectorAll('.save-pedido').forEach(btn => {
            btn.addEventListener('click', guardarPedido);
        });
        document.querySelectorAll('.delete-pedido').forEach(btn => 
            btn.addEventListener('click', eliminarPedido)
        );
    } catch (error) {
        console.error('Error al cargar los pedidos:', error);
    }
}

// Función para agregar un producto al menú
function agregarProducto() {
    const nombre = prompt('Nombre del producto:');
    const descripcion = prompt('Descripción:');
    const precio = parseFloat(prompt('Precio:'));

    fetch(API_PRODUCTO_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre_producto: nombre, descripcion, precio })
    }).then(() => cargarMenu())
      .catch(error => console.error('Error al agregar producto:', error));
}

// Función para editar un producto del menú
function editarProducto(event) {
    const id = event.target.dataset.id;
    const nuevoNombre = prompt('Nuevo nombre del producto:');
    const nuevaDescripcion = prompt('Nueva descripción:');
    const nuevoPrecio = parseFloat(prompt('Nuevo precio:'));

    fetch(`${API_PRODUCTO_URL}${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre_producto: nuevoNombre, descripcion: nuevaDescripcion, precio: nuevoPrecio })
    }).then(() => cargarMenu())
      .catch(error => console.error('Error al editar producto:', error));
}





// Función para eliminar un pedido
function eliminarPedido(event) {
    const id = event.target.dataset.id;

    fetch(`${API_PEDIDOS_URL}${id}`, {
        method: 'DELETE'
    }).then(() => cargarPedidos())
      .catch(error => console.error('Error al eliminar pedido:', error));
}

// Inicializar la carga de tablas
document.addEventListener('DOMContentLoaded', () => {
    cargarMenu();
    cargarPedidos();

    document.getElementById('add-menu-item').addEventListener('click', agregarProducto);
});
