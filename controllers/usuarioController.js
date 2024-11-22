const Usuario = require('../models/Usuario');
const logger = require('../utils/loggers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.cadastrarUsuario = async (req, res, next) => {
    const { nome, email, senha, chave = null } = req.body; // Valor padrão para chave

    try {
        // Verificar se o e-mail já está cadastrado
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'Email já cadastrado.' });
        }

        // Validar a senha (se estiver vazia ou com menos de 6 caracteres)
        if (!senha || senha.length < 6) {
            return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres.' });
        }

        // Criptografar a senha
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        // Criar novo usuário
        const novoUsuario = new Usuario({
            nome,
            email,
            senha: senhaCriptografada,
            chave, // Campo tratado mesmo que seja null
            estante: {
                doacoes: [],
                emprestimos: [],
                avaliacoes: [],
                quotes: []
            }
        });

        // Salvar no banco de dados
        const usuarioSalvo = await novoUsuario.save();

        // Logar informações do cadastro
        logger.info(`Usuário cadastrado: ${nome} (${email})`);

        // Enviar resposta de sucesso
        res.status(201).json({
            message: 'Usuário cadastrado com sucesso!',
            usuario: {
                id: usuarioSalvo._id,
                nome: usuarioSalvo.nome,
                email: usuarioSalvo.email,
                chave: usuarioSalvo.chave
            }
        });
    } catch (error) {
        // Logar erro de cadastro
        logger.error('Erro ao cadastrar usuário:', error);
        next(error); // Passa o erro para o middleware de erro
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
        // Atualizar a senha, caso fornecida
        const updates = { nome };
        if (senha) {
            updates.senha = await bcrypt.hash(senha, 10);
        }

        const usuarioAtualizado = await Usuario.findOneAndUpdate(
            { email },
            updates,
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
    const { email, password } = req.body;

    console.log('Dados recebidos na requisição:', req.body);

    try {
        // Buscar usuário pelo email
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(404).json({ error: 'Email ou senha inválidos.' });
        }

        console.log('Usuário encontrado:', usuario);
        console.log('Senha recebida:', password); // Verifique a senha fornecida
        console.log('Senha armazenada no banco:', usuario.senha); // Verifique o hash da senha armazenada

        // Comparar a senha fornecida com o hash armazenado
        const senhaValida = await bcrypt.compare(password.trim(), usuario.senha);
        console.log('Resultado da comparação de senha:', senhaValida); // Verifique o resultado da comparação

        if (!senhaValida) {
            return res.status(400).json({ error: 'Email ou senha inválidos.' });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { email: usuario.email, id: usuario._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('Token gerado com sucesso.');

        res.status(200).json({
            message: 'Login realizado com sucesso!',
            token,
            user: {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
                estante: usuario.estante,
            }
        });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        next(error);
    }
};