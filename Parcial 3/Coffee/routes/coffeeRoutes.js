const express = require('express');
const router = express.Router();
const{
    getPedido,
    getPedidos,
    editPedido,
    createPedido,
    deletePedido,

    getMenu,
    getProducto,
    editProducto,
    createProducto,
    deleteProducto
} = require('../Controllers/coffeeController')
router.get('/pedido/', getPedidos);
router.get('/pedido/:id_pedido', getPedido);
router.put('/pedido/:id_pedido', editPedido);
router.post('/pedido/', createPedido);
router.delete('/pedido/:id_pedido', deletePedido);

router.get('/menu/', getMenu);
router.get('/producto/:id_producto', getProducto);
router.put('/producto/:id_producto', editProducto);
router.post('/producto/', createProducto);
router.delete('/producto/:id_producto', deleteProducto);


module.exports = router;