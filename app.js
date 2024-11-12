const express = require('express');
const cors = require('cors');
const usuarioRoutes = require('./routes/usuarioRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Permitir CORS para todas as origens
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://brave-smoke-0bf91ef0f.5.azurestaticapps.net'
}));

// Middleware básico
app.use(express.json());

// Rota de usuário
app.use('/api/usuarios', usuarioRoutes);

// Middleware de tratamento de erros
app.use(errorHandler);

module.exports = app;
