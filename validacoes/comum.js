const yup = require('yup');

const validarObjectId = (id) => {
    return yup.string().matches(/^[0-9a-fA-F]{24}$/, 'ID inválido').isValidSync(id);
};

module.exports = {
    validarObjectId
};
