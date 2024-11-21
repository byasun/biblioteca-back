const express = require('express');
const usuarioRoutes = require('./usuarioRoutes');
const livroRoutes = require('./livroRoutes');
const logger = require('../utils/logger');

const router = express.Router();

router.use((req, res, next) => {
    logger.info(`Requisição recebida: ${req.method} ${req.url}`);
    next();
});

router.use('/usuarios', usuarioRoutes);
router.use('/livros', livroRoutes);

router.use((req, res) => {
    logger.warn(`Rota não encontrada: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: 'Rota não encontrada' });
});

module.exports = router;
