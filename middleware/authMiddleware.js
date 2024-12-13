const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    console.log("Header Authorization:", authHeader); // Verifica se o header chega
    console.log("Token extraído:", token);

    if (!token) {
        logger.warn('Token de autenticação não fornecido.');
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        logger.info(`Usuário autenticado: ${decoded.email}`);
        next();
    } catch (error) {
        logger.error('Erro ao verificar token de autenticação:', error);
        res.status(401).json({ error: 'Token inválido.' });
    }
};

module.exports = authMiddleware;
