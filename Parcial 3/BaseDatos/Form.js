const express = require('express');
const multer = require('multer');
const path = require('path');
const { jsPDF } = require('jspdf');
const fs = require('fs');
const cors = require('cors');
const { check, validationResult } = require('express-validator');

const app = express();
const mysql = require('mysql2');

// Configuración de conexión
const db = mysql.createConnection({
    host: 'localhost', 
    user: 'root',      
    password: '8ugs8unny1064/',     
    database: 'coffee' // Nombre de la base de datos 
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos.');
});

// Configuración de CORS
app.use(cors());

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folder = path.join(__dirname, '/archivos');
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Middleware para procesar JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir la carpeta Archivos como estática para acceder a los archivos generados
app.use('/archivos', express.static(path.join(__dirname, '/archivos')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
   
});


app.get('/api/formulario', (req, res) => {
    const sql = 'SELECT * FROM coffee';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener los datos de la base de datos:', err);
            return res.status(500).json({ error: 'Error en la base de datos', details: err });
        }
    
        console.log('Resultados obtenidos:', results);  // Esto permite ver los datos obtenidos de la base de datos.
        return res.json(results); // Devolvemos los datos como JSON
    });
});
app.post('/FormData', upload.single('archivos'), [
    check('Nombre').isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres.'),
    check('Apellido').isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres.')
], (req, res) => {
    // Validación de datos
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { Nombre, Apellido } = req.body;

    // Verificar si ya existe en la base de datos
    const checkSql = 'SELECT * FROM coffee WHERE nombre = ? AND apellido = ?';
    db.query(checkSql, [Nombre, Apellido], (err, results) => {
        if (err) {
            console.error('Error al verificar en la base de datos:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        if (results.length > 0) {
            // Ya existe
            const existingPdfUrl = results[0].pdf_path;
            return res.status(400).json({
                message: 'El registro ya existe en la base de datos',
                pdfUrl: existingPdfUrl, // Incluye la URL del PDF existente
            });
        }

        // Si no existe, generar un nuevo PDF
        try {
            // Leer la imagen subida como Base64
            const uploadedFile = req.file;
            const imagePath = path.join(__dirname, '/archivos', uploadedFile.filename);
            const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });

            // Crear el PDF usando jsPDF
            const doc = new jsPDF();
            doc.text(`Nombre: ${req.body.Nombre}`, 10, 10);
            doc.text(`Apellido: ${req.body.Apellido}`, 10, 20);
            doc.text(`Archivo recibido: ${uploadedFile.originalname}`, 10, 30);

            // Agregar la imagen al PDF
            const fileExtension = path.extname(uploadedFile.originalname).toLowerCase();
            const imageFormat = fileExtension === '.png' ? 'PNG' : 'JPEG';
            doc.addImage(`data:image/${imageFormat};base64,${imageBase64}`, imageFormat, 10, 40, 100, 100);

            // Generar un nombre único para el PDF basado en el Nombre del formulario
            const sanitizedNombre = req.body.Nombre.replace(/[^a-zA-Z0-9]/g, '_'); // Reemplaza caracteres especiales
            const pdfFileName = `${sanitizedNombre}.pdf`;

            // Guardar el PDF en la carpeta archivos
            const pdfPath = path.join(__dirname, '/archivos', pdfFileName);
            const pdfBuffer = doc.output('arraybuffer');
            fs.writeFileSync(pdfPath, Buffer.from(pdfBuffer));

            // Insertar en la base de datos
            const insertSql = 'INSERT INTO coffee (nombre, apellido, pdf_path) VALUES (?, ?, ?)';
            db.query(insertSql, [Nombre, Apellido, `/archivos/${pdfFileName}`], (err, result) => {
                if (err) {
                    console.error('Error al insertar en la base de datos:', err);
                    return res.status(500).json({ error: 'Error al guardar en la base de datos' });
                }

                console.log('Datos guardados en la base de datos:', result);
                return res.json({
                    message: 'Datos guardados correctamente y PDF generado',
                    pdfUrl: `/archivos/${pdfFileName}`,
                });
            });
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            res.status(500).json({ error: 'Error en la generación del PDF' });
        }
    });
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});