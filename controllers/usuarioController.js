const Usuario = require('../models/Usuario');
const logger = require('../utils/loggers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.cadastrarUsuario = async (req, res, next) => {
    const { nome, email, senha } = req.body;
    try {
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            logger.warn(`Tentativa de cadastro com email já existente: ${email}`);
            return res.status(400).json({ error: 'Email já cadastrado.' });
        }

        const novoUsuario = new Usuario({ nome, email, senha });

        // Criptografando a senha antes de salvar
        await novoUsuario.save();
        logger.info(`Usuário cadastrado: ${nome} (${email})`);
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario: novoUsuario });
    } catch (error) {
        logger.error('Erro ao cadastrar usuário:', error);
        next(error);
    }
};


exports.buscarUsuarioPorEmail = async (req, res, next) => {
    const { email } = req.params;
    try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            logger.warn(`Usuário não encontrado: ${email}`);
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        logger.info(`Usuário encontrado: ${usuario.nome} (${email})`);
        res.status(200).json(usuario);
    } catch (error) {
        logger.error('Erro ao buscar usuário:', error);
        next(error);
    }
};

exports.atualizarUsuarioPorEmail = async (req, res, next) => {
    const { email } = req.params;
    const { nome, senha } = req.body;
    try {
        const usuarioAtualizado = await Usuario.findOneAndUpdate(
            { email },
            { nome, senha },
            { new: true }
        );
        if (!usuarioAtualizado) {
            logger.warn(`Usuário não encontrado para atualização: ${email}`);
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        logger.info(`Usuário atualizado: ${usuarioAtualizado.nome} (${email})`);
        res.status(200).json({ message: 'Usuário atualizado com sucesso!', usuario: usuarioAtualizado });
    } catch (error) {
        logger.error('Erro ao atualizar usuário:', error);
        next(error);
    }
};

exports.removerUsuarioPorEmail = async (req, res, next) => {
    const { email } = req.params;
    try {
        const usuarioRemovido = await Usuario.findOneAndDelete({ email });
        if (!usuarioRemovido) {
            logger.warn(`Usuário não encontrado para remoção: ${email}`);
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        logger.info(`Usuário removido: ${usuarioRemovido.nome} (${email})`);
        res.status(200).json({ message: 'Usuário removido com sucesso!' });
    } catch (error) {
        logger.error('Erro ao remover usuário:', error);
        next(error);
    }
};

exports.loginUsuario = async (req, res, next) => {
    const { email, senha } = req.body;
    try {
        // Verificar se o usuário existe
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            logger.warn(`Usuário não encontrado: ${email}`);
            return res.status(404).json({ error: 'Email ou senha inválidos.' });
        }

        // Verificar a senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            logger.warn(`Senha incorreta para o usuário: ${email}`);
            return res.status(400).json({ error: 'Email ou senha inválidos.' });
        }

        // Gerar o token JWT
        const token = jwt.sign(
            { email: usuario.email, id: usuario._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }  // O token expira em 1 hora
        );

        logger.info(`Usuário autenticado: ${usuario.nome} (${email})`);
        res.status(200).json({ message: 'Login realizado com sucesso!', token });
    } catch (error) {
        logger.error('Erro ao fazer login:', error);
        next(error);
    }
};
