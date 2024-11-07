const Usuario = require('../models/Usuario');

// Registrar usuário
exports.registrarUsuario = async (req, res) => {
    try {
        const { nome, email, senha, chave } = req.body;
        const novoUsuario = new Usuario({ nome, email, senha, chave });
        await novoUsuario.save();
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        res.status(400).json({ error: 'Erro ao registrar usuário.' });
    }
};

// Login de usuário
exports.loginUsuario = async (req, res) => {
    try {
        const { email, senha } = req.body;
        const usuario = await Usuario.findOne({ email });

        if (!usuario || usuario.senha !== senha) {
            return res.status(400).json({ error: 'Credenciais inválidas' });
        }

        res.status(200).json({ message: 'Login bem-sucedido', usuario });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao realizar login' });
    }
};

// Obter perfil do usuário
exports.obterPerfilUsuario = async (req, res) => {
    try {
        const usuarioId = req.usuarioId; // O ID do usuário vem de um token JWT
        const usuario = await Usuario.findById(usuarioId);
        res.status(200).json(usuario);
    } catch (error) {
        res.status(404).json({ error: 'Usuário não encontrado' });
    }
};

// Obter estante do usuário
exports.obterEstante = async (req, res) => {
    try {
        const usuarioId = req.usuarioId;
        const usuario = await Usuario.findById(usuarioId);
        res.status(200).json(usuario.estante);
    } catch (error) {
        res.status(404).json({ error: 'Estante não encontrada' });
    }
};

// Adicionar livro à estante
exports.adicionarLivroEstante = async (req, res) => {
    try {
        const usuarioId = req.usuarioId;
        const { livroId, status, avaliacao, quote } = req.body;

        const usuario = await Usuario.findById(usuarioId);
        usuario.estante.push({ livroId, status, avaliacao, quote });
        await usuario.save();

        res.status(201).json({ message: 'Livro adicionado à estante!' });
    } catch (error) {
        res.status(400).json({ error: 'Erro ao adicionar livro' });
    }
};

// Remover livro da estante
exports.removerLivroEstante = async (req, res) => {
    try {
        const usuarioId = req.usuarioId;
        const { id } = req.params;

        const usuario = await Usuario.findById(usuarioId);
        usuario.estante = usuario.estante.filter((livro) => livro._id != id);
        await usuario.save();

        res.status(200).json({ message: 'Livro removido da estante!' });
    } catch (error) {
        res.status(400).json({ error: 'Erro ao remover livro' });
    }
};
