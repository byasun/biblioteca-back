const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;

    // Log do erro completo
    logger.error('Erro capturado:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    // Resposta adequada ao ambiente
    if (process.env.NODE_ENV === 'development') {
        // Detalhes completos no ambiente de desenvolvimento
        res.status(statusCode).json({
            error: err.message,
            stack: err.stack,
        });
    } else {
        // Mensagem genérica no ambiente de produção
        res.status(statusCode).json({ error: 'Algo deu errado!' });
    }
};

module.exports = errorHandler;
