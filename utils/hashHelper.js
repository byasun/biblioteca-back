const bcrypt = require('bcrypt');

const gerarHash = async (senha, saltRounds = 10) => {
    return await bcrypt.hash(senha, saltRounds);
};

const compararHash = async (senha, hash) => {
    return await bcrypt.compare(senha, hash);
};

module.exports = {
    gerarHash,
    compararHash
};
