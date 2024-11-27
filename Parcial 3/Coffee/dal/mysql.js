const db = require('../config/mysql');

exports.selectPedidos=async()=>{
    let resultado = await db.promise()
    .query('SELECT id_pedido, fecha, nombre_cliente, domicilio, total, estado FROM pedido');
    console.log(resultado);
    return resultado [0];
}

exports.selectMenu=async()=>{
    let resultado = await db.promise()
    .query('SELECT id_producto, nombre_producto, descripcion, precio, categoria FROM menu');
    console.log(resultado);
    return resultado [0];
}

exports.selectPedido = async (id_pedido)=>{
    let resultado /*[rows, fields]*/ = await db.promise().query(
        'SELECT id_pedido, fecha, nombre_cliente, domicilio, total, estado FROM pedido WHERE id_pedido =?',
        [id_pedido]
    );
    console.log(resultado);
    return resultado[0].length ? resultado[0][0] : undefined; 

}
exports.selectProducto = async (id_producto)=>{
    let resultado /*[rows, fields]*/ = await db.promise().query(
        'SELECT id_producto, nombre_producto, descripcion, precio, categoria,  FROM menu WHERE id_producto =?',
        [id_producto]
    );
    console.log(resultado);
    return resultado[0].length ? resultado[0][0] : undefined; 

}

exports.insertPedido = async ( id_pedido, fecha, nombre_cliente, domicilio, total, estado)=>{
    let result /*[rows, fields]*/ = await db.promise().query(
        'INSERT INTO pedido ( id_pedido, fecha, nombre_cliente, domicilio, total, estado) VALUES (?,?,?,?,?,?)',
        [ id_pedido, fecha, nombre_cliente, domicilio, total, estado]
    );
    return result[0].insertId;
}

exports.insertProducto = async (id_producto, nombre_producto, descripcion, precio, categoria, )=>{
    let result /*[rows, fields]*/ = await db.promise().query(
        'INSERT INTO menu ( id_producto, nombre_producto, descripcion, precio, categoria, ) VALUES (?,?,?,?,?,?)',
        [ id_producto, nombre_producto, descripcion, precio, categoria, ]
    );
    return result[0].insertId;
}

exports.updatePedido=async(id_pedido, fecha, nombre_cliente, domicilio, total, estado)=>{
    let result=await db.promise().execute(
        'UPDATE pedido SET fecha = ?,nombre_cliente =?, domicilio =?, total =?, estado=? WHERE id_pedido=?',
        [fecha, nombre_cliente, domicilio, total, estado, id_pedido]
    );
    return result[0].affectedRows;
}

exports.updateProducto=async(id_producto, nombre_producto, descripcion, precio, categoria, )=>{
    let result=await db.promise().execute(
        'UPDATE menu SET nombre_producto =?, descripcion =?, precio =?, categoria =? WHERE id_producto=?',
        [ nombre_producto, descripcion, precio, categoria,id_producto]
    );
    return result[0].affectedRows;
}


exports.deletePedido=async(id_pedido)=>{
    let result=await db.promise().execute(
        'DELETE FROM pedido WHERE id_pedido=?',
        [id_pedido]
    );
    return result[0].affectedRows;
}
exports.deleteProducto=async(id_producto)=>{
    let result=await db.promise().execute(
        'DELETE FROM menu WHERE id_producto=?',
        [id_producto]
    );
    return result[0].affectedRows;
}