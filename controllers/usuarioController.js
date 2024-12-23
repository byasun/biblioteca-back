const Usuario = require("../models/Usuario");
const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { addToBlacklist } = require('../utils/jwtHelper');

exports.cadastrarUsuario = async (req, res) => {
  const { nome, email, senha, chave = null } = req.body;

  try {
    // Verificar se o e-mail já existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: "Email já cadastrado." });
    }

    // Validar senha
    if (!senha || senha.length < 6) {
      return res
        .status(400)
        .json({ error: "A senha deve ter pelo menos 6 caracteres." });
    }

    // Criar novo usuário (sem hashear manualmente a senha)
    const novoUsuario = new Usuario({
      nome,
      email,
      senha,
      chave,
      estante: {
        doacoes: [],
        emprestimos: [],
        avaliacoes: [],
        quotes: [],
      },
    });

    // Salvar no banco de dados
    const usuarioSalvo = await novoUsuario.save();

    res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      usuario: {
        id: usuarioSalvo._id,
        nome: usuarioSalvo.nome,
        email: usuarioSalvo.email,
        chave: usuarioSalvo.chave,
      },
    });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    res
      .status(500)
      .json({ error: "Erro no servidor. Tente novamente mais tarde." });
  }
};

exports.buscarUsuarioPorEmail = async (req, res, next) => {
  const { email } = req.params;
  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      logger.warn(`Usuário não encontrado: ${email}`);
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    logger.info(`Usuário encontrado: ${usuario.nome} (${email})`);
    res.status(200).json(usuario);
  } catch (error) {
    logger.error("Erro ao buscar usuário:", error);
    next(error);
  }
};

exports.atualizarUsuarioPorEmail = async (req, res, next) => {
  const { email } = req.params;
  const { nome, senha, chave } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Atualizar somente os campos necessários
    if (senha) {
      usuario.senha = senha; // Deixe o `pre('save')` cuidar do hash
    }
    if (nome) {
      usuario.nome = nome;
    }
    if (chave) {
      usuario.chave = chave;
    }

    const usuarioAtualizado = await usuario.save();
    res.status(200).json({
      message: "Usuário atualizado com sucesso!",
      usuario: usuarioAtualizado,
    });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res
      .status(500)
      .json({ error: "Erro no servidor. Tente novamente mais tarde." });
  }
};

exports.removerUsuarioPorEmail = async (req, res, next) => {
  const { email } = req.params;

  try {
    const usuario = await Usuario.findOneAndDelete({ email });
    if (!usuario) {
      logger.warn(`Usuário não encontrado para remoção: ${email}`);
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    logger.info(`Usuário removido: ${usuario.nome} (${email})`);
    res.status(200).json({ message: "Usuário removido com sucesso!", usuario });
  } catch (error) {
    logger.error("Erro ao remover usuário:", error);
    res
      .status(500)
      .json({ error: "Erro no servidor. Tente novamente mais tarde." });
  }
};

exports.loginUsuario = async (req, res, next) => {
  console.log("Recebida requisição de login:", req.method, req.originalUrl);
  console.log("Body recebido:", req.body);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.warn("Campos obrigatórios ausentes.");
      return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      console.warn(`Usuário não encontrado para email: ${email}`);
      return res.status(404).json({ error: "Email ou senha inválidos." });
    }

    const senhaValida = await bcrypt.compare(password.trim(), usuario.senha);
    if (!senhaValida) {
      console.warn("Senha inválida fornecida.");
      return res.status(400).json({ error: "Email ou senha inválidos." });
    }

    const token = jwt.sign(
      { email: usuario.email, id: usuario._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Login bem-sucedido para:", usuario.email);

    res.status(200).json({
      message: "Login realizado com sucesso!",
      token,
      user: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        estante: usuario.estante,
      },
    });
  } catch (error) {
    console.error("Erro ao processar login:", error);
    next(error);
  }
};

exports.logoutUsuario = (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          return res.status(500).json({ error: "Erro ao encerrar a sessão." });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logout realizado com sucesso." });
  });
};
