const bcrypt = require('bcrypt');
const logger = require('./logger');

exports.hashSenha = async (senha) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(senha, salt);
        logger.info('Senha hash gerada com sucesso.');
        return hashed;
    } catch (error) {
        logger.error('Erro ao gerar hash da senha:', error);
        throw error;
    }
};

exports.verificarSenha = async (senha, hash) => {
    try {
        const isValid = await bcrypt.compare(senha, hash);
        logger.info('Validação de senha concluída.');
        return isValid;
    } catch (error) {
        logger.error('Erro ao verificar senha:', error);
        throw error;
    }
};
