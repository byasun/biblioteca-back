const yup = require('yup');

const schemaCadastroUsuario = yup.object().shape({
    nome: yup.string().required('O nome é obrigatório'),
    email: yup.string().email('Email inválido').required('O email é obrigatório'),
    senha: yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres').required('A senha é obrigatória')
});

const validarCadastroUsuario = async (dados) => {
    return await schemaCadastroUsuario.validate(dados, { abortEarly: false });
};

module.exports = {
    validarCadastroUsuario
};
