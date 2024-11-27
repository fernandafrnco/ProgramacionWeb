const express = require('express');
const dotenv = require('dotenv');
const pedidoRoutes = require('./routes/coffeeRoutes');
// const menuRoutes = require('./routes/menuRoutes');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(cors());

app.use(express.json());

app.use('/Coffee', pedidoRoutes);
// app.use('/Coffee/menu', menuRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.info(`Servidor corriendo en el puerto ${PORT}`);    
});