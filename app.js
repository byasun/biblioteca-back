const express = require('express');
const conectarDB = require('./config/db');
const usuarioRoutes = require('./routes/usuarioRoutes');
const livroRoutes = require('./routes/livroRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Conectar ao banco de dados
conectarDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/livros', livroRoutes);

// Rota inicial
app.get('/', (req, res) => {
    res.send('API da Biblioteca Comunitária');
});

module.exports = app;
