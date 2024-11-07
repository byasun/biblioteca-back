const express = require('express');
const connectDB = require('./config/db');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();

// Conectar ao banco de dados
connectDB();

// Middleware básico
app.use(express.json());

// Rota de usuário
app.use('/api/usuarios', usuarioRoutes);

module.exports = app;
