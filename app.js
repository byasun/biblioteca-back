const express = require('express');
const conectarDB = require('./config/db');
const usuarioRoutes = require('./routes/usuarioRoutes');
const livroRoutes = require('./routes/livroRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Conectar ao banco de dados
conectarDB()
    .then(() => logger.info('Banco de dados conectado com sucesso.'))
    .catch((err) => logger.error('Erro ao conectar ao banco de dados:', { message: err.message }));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
    logger.info(`Requisição recebida: ${req.method} ${req.url}`);
    next();
});

// Rotas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/livros', livroRoutes);

// Rota inicial
app.get('/', (req, res) => {
    logger.info('Rota inicial acessada.');
    res.send('API da Biblioteca Comunitária');
});

// Middleware de tratamento de erros
app.use(errorHandler);

module.exports = app;
