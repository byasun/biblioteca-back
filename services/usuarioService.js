const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registrarUsuario = async (dados) => {
    const { nome, email, senha, chave } = dados;

    // Verificar se o usuário já existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
        throw new Error('Email já cadastrado.');
    }

    // Criar um novo usuário (não hasheie a senha manualmente aqui)
    const novoUsuario = new Usuario({
        nome,
        email,
        senha, // O hash será tratado pelo `pre('save')` no schema
        chave,
    });

    return await novoUsuario.save();
};

const loginUsuario = async (email, senha) => {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
        throw new Error('Usuário não encontrado');
    }

    // Comparar a senha com o hash armazenado no banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
        throw new Error('Senha inválida');
    }

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return { token, usuario };
};

module.exports = { registrarUsuario, loginUsuario };
