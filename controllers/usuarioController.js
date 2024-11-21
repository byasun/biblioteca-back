const Usuario = require('../models/Usuario');

exports.cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        const novoUsuario = new Usuario({ nome, email, senha });
        await novoUsuario.save();
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario: novoUsuario });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao cadastrar usuário' });
    }
};

exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.status(200).json(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
};
