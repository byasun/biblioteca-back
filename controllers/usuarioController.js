const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

// Função de validação dos dados de registro com Joi
const validarCadastro = (dados) => {
    const schema = Joi.object({
        nome: Joi.string().min(3).max(255).required(),
        email: Joi.string().email().required(),
        senha: Joi.string().min(6).required(),
        chave: Joi.string().optional(),
    });

    return schema.validate(dados);
};

// Registrar usuário
exports.registrarUsuario = async (req, res) => {
    // Validar dados
    const { error } = validarCadastro(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const { nome, email, senha, chave } = req.body;

        // Verificar se o usuário já existe
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'Email já cadastrado.' });
        }

        // Criar novo usuário
        const novoUsuario = new Usuario({
            nome,
            email,
            senha,  // A senha será criptografada automaticamente
            chave
        });

        await novoUsuario.save();
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao registrar usuário.' });
    }
};

// Função para comparar a senha fornecida com a armazenada
exports.loginUsuario = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const usuario = await Usuario.findOne({ email });
        
        if (!usuario) {
            return res.status(400).json({ error: 'Usuário não encontrado!' });
        }

        // Comparar a senha fornecida com a criptografada no banco
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(400).json({ error: 'Senha inválida!' });
        }

        res.status(200).json({ message: 'Login bem-sucedido!', usuario });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao realizar login' });
    }
};

// Login de usuário
exports.loginUsuario = async (req, res) => {
    try {
        const { email, senha } = req.body;
        const usuario = await Usuario.findOne({ email });

        if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
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