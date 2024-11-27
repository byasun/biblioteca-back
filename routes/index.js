const express = require('express');
const usuarioRoutes = require('./usuarioRoutes');
const livroRoutes = require('./livroRoutes');
const logger = require('../utils/loggers');

const router = express.Router();

// Log de requisições recebidas
router.use((req, res, next) => {
  logger.info(`Rota acessada: ${req.method} ${req.originalUrl}`);
  next();
});

// Rotas específicas
router.use('/usuarios', usuarioRoutes);
router.use('/livros', livroRoutes);

// Tratamento de rotas não encontradas
router.use((req, res) => {
  const message = `Rota não encontrada: ${req.method} ${req.originalUrl}`;
  logger.warn(message);
  res.status(404).json({ error: 'Rota não encontrada' });
});

module.exports = router;