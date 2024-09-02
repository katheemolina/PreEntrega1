const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productos.json');

// Para leer y escribir en el archivo
const readProductsFile = () => {
    const data = fs.readFileSync(productsFilePath, 'utf-8');
    return JSON.parse(data);
};

const writeProductsFile = (data) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(data, null, 2));
};

// Ruta para leer todos los productos
router.get('/', (req, res) => {
    const { limit } = req.query;
    const products = readProductsFile();
    if (limit) {
        return res.json(products.slice(0, parseInt(limit)));
    }
    res.json(products);
});

// Ruta para leer un producto por su ID
router.get('/:pid', (req, res) => {
    const id = req.params.pid;
    const products = readProductsFile();
    const product = products.find(product => product.id === parseInt(id));
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

// Ruta para agregar un nuevo producto
router.post('/', (req, res) => {
    const { title, description, code, price, status, stock, category } = req.body;
    if (!title || !description || !code || !price || !status || !stock || !category) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const products = readProductsFile();
    const id = products.length + 1;
    const newProduct = { id, title, description, code, price, status, stock, category };
    products.push(newProduct);
    writeProductsFile(products);

    res.status(201).json(newProduct);
});

module.exports = router;
