const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

// Função de validação dos dados de registro com Joi
const validarCadastro = (dados) => {
    const schema = Joi.object({
        nome: Joi.string().min(3).max(255).required(),
        email: Joi.string().email().required(),
        senha: Joi.string().min(6).required(),
        senhaConfirmar: Joi.any().strip(), // Ignorar o campo senhaConfirmar
        chave: Joi.string().optional(),
    });

    return schema.validate(dados);
};

// Registrar usuário
exports.registrarUsuario = async (req, res) => {
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

        // Hash da senha antes de salvar no banco de dados
        const senhaHashada = await bcrypt.hash(senha, 10); // 10 é o número de rounds de salt

        // Criar um novo usuário com a senha hashada
        const novoUsuario = new Usuario({
            nome,
            email,
            senha: senhaHashada,  // Usar a senha hashada
            chave
        });

        // Salvar o novo usuário no banco de dados
        await novoUsuario.save();
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao registrar usuário.' });
    }
};

// Função para realizar login e gerar token JWT
exports.loginUsuario = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const usuario = await Usuario.findOne({ email });
        
        if (!usuario) {
            return res.status(400).json({ error: 'Usuário não encontrado!' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(400).json({ error: 'Senha inválida!' });
        }

        // Gerar o token JWT com o ID do usuário
        const token = jwt.sign(
            { id: usuario._id },
            process.env.JWT_SECRET,  // Chave secreta para assinatura do token
            { expiresIn: '1h' }      // Token expira em 1 hora
        );

        res.status(200).json({ message: 'Login bem-sucedido!', token, usuario: { id: usuario._id, nome: usuario.nome, email: usuario.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao realizar login' });
    }
};

// Obter perfil do usuário (rota protegida)
exports.obterPerfilUsuario = async (req, res) => {
    try {
        const usuarioId = req.usuarioId;
        const usuario = await Usuario.findById(usuarioId);
        res.status(200).json(usuario);
    } catch (error) {
        res.status(404).json({ error: 'Usuário não encontrado' });
    }
};

// Obter estante do usuário (rota protegida)
exports.obterEstante = async (req, res) => {
    try {
        const usuarioId = req.usuarioId;
        const usuario = await Usuario.findById(usuarioId);
        res.status(200).json(usuario.estante);
    } catch (error) {
        res.status(404).json({ error: 'Estante não encontrada' });
    }
};

// Adicionar livro à estante (rota protegida)
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

// Remover livro da estante (rota protegida)
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
