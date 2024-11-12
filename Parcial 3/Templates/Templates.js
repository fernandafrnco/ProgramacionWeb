const express = require ('express');

const path = require ('path');
const app = express();

app.use(express.json());
/*app.use(express.text());*/

app.set('view engine','pug');
app.set('views', path.join(__dirname,'views'));

app.get('/administrativos',(req,res) => {
    console.log(req.query);
    res.render('admin');
})

app.get('/maestros',(req,res) => {
    console.log(req.body);
    res.send('Servidor constestando a peticion GET');
})

app.get('/estudiantes/:carrera',(req,res) => {
    console.log(req.params.carrera);
    console.log(req.query.control);
    res.send('Servidor constestando a peticion GET');
})

app.listen(8080, () => {
    console.log('Servidor express escuchando en puerto 8080');
})