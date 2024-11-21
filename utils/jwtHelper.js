const jwt = require('jsonwebtoken');

const gerarToken = (dados, segredo, tempoExpiracao = '1h') => {
    return jwt.sign(dados, segredo, { expiresIn: tempoExpiracao });
};

const verificarToken = (token, segredo) => {
    try {
        return jwt.verify(token, segredo);
    } catch (error) {
        return null;
    }
};

module.exports = {
    gerarToken,
    verificarToken
};
