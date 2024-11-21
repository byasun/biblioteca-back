const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

const validationMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn('Erros de validação:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = validationMiddleware;
