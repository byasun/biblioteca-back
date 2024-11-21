const jwt = require('jsonwebtoken');
const logger = require('./logger');

exports.gerarToken = (payload) => {
    try {
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        logger.info('Token JWT gerado com sucesso.');
        return token;
    } catch (error) {
        logger.error('Erro ao gerar token JWT:', error);
        throw error;
    }
};
