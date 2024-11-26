const express = require('express');
const usuarioRoutes = require('./usuarioRoutes');
const livroRoutes = require('./livroRoutes');
const logger = require('./utils/logger');

const router = express.Router();

// Middleware global para log de requisições
router.use((req, res, next) => {
    logger.info(`Requisição recebida: ${req.method} ${req.url}`);
    next();
});

// Rotas específicas
router.use('/usuarios', usuarioRoutes);
router.use('/livros', livroRoutes);

// Middleware para rotas não encontradas
router.use((req, res) => {
    logger.warn(`Rota não encontrada: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: 'Rota não encontrada' });
});

router.use((err, req, res, next) => {
    logger.error(`Erro na rota ${req.method} ${req.url}: ${err.message}`);
    res.status(err.status || 500).json({
        error: err.message || 'Erro interno no servidor',
    });
});

module.exports = router;
