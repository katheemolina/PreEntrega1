const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const cartsFilePath = path.join(__dirname, '../data/carrito.json');

// Funciones para leer y escribir en el archivo JSON
const readCartsFile = () => {
    const data = fs.readFileSync(cartsFilePath, 'utf-8');
    return JSON.parse(data);
};

const writeCartsFile = (data) => {
    fs.writeFileSync(cartsFilePath, JSON.stringify(data, null, 2));
};

// Ruta para crear un nuevo carrito
router.post('/', (req, res) => {
    const { id, products } = req.body;
    if (id && products) {
        const carts = readCartsFile();
        carts.push({ id, products });
        writeCartsFile(carts);
        res.status(201).json({ id, products });
    } else {
        res.status(400).json({ error: 'id and products are required' });
    }
});

// Ruta para obtener un carrito por su ID
router.get('/:cid', (req, res) => {
    const id = req.params.cid;
    const carts = readCartsFile();
    const cart = carts.find(cart => cart.id === id);
    if (cart) {
        res.json(cart);
    } else {
        res.status(404).json({ error: 'Cart not found' });
    }
});

// Ruta para agregar un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const productToAdd = {
        product: productId,
        quantity: 1
    };

    const carts = readCartsFile();
    const cartIndex = carts.findIndex(cart => cart.id === cartId);
    if (cartIndex !== -1) {
        carts[cartIndex].products.push(productToAdd);
        writeCartsFile(carts);
        res.status(200).json({ message: 'Product added to cart successfully' });
    } else {
        res.status(404).json({ error: 'Cart not found' });
    }
});

module.exports = router;
