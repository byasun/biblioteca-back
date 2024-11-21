const { validationResult } = require('express-validator');

const validarEntradas = (validacoes) => async (req, res, next) => {
    await Promise.all(validacoes.map((validacao) => validacao.run(req)));

    const erros = validationResult(req);
    if (!erros.isEmpty()) {
        return res.status(400).json({ errors: erros.array() });
    }
    next();
};

module.exports = validarEntradas;
