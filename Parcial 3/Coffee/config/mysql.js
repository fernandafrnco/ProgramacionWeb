const db = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const connection = db.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Anillo_12',
    database: 'Coffee'
});

connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.message);
    } else {
        console.info('Conectado a la base de datos');
    }
});

module.exports = connection;


