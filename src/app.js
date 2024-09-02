const express = require('express');
const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');

const app = express();

app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const PORT = 3003; 
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
