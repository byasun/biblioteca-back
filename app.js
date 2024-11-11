const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const usuarioRoutes = require('./routes/usuarioRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Permitir CORS para todas as origens
app.use(cors());

// Conectar ao banco de dados
connectDB();

// Middleware básico
app.use(express.json());

// Rota de usuário
app.use('/api/usuarios', usuarioRoutes);

// Middleware de tratamento de erros
app.use(errorHandler);

module.exports = app;
