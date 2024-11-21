const express = require('express');
const Joi = require('joi');
const {
  registrarUsuario,
  loginUsuario,
  obterPerfilUsuario,
  obterEstante,
  adicionarLivroEstante,
  removerLivroEstante,
} = require('../controllers/usuarioController');
const autenticarUsuario = require('../middleware/authMiddleware'); // Importando o middleware de autenticação
require('dotenv').config();

const router = express.Router();

// Validação dos dados de registro usando Joi
const schema = Joi.object({
  nome: Joi.string().required(),
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required(),
  chave: Joi.string().optional(),
});

// Middleware de validação para o registro de usuário
const validarCadastro = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next(); // Se a validação passar, segue para o próximo middleware (registrarUsuario)
  } catch (err) {
    res.status(400).json({ error: err.details[0].message });
  }
};

// Rota para registrar um novo usuário
router.post('/registrar', validarCadastro, async (req, res) => {
  try {
    const resultado = await registrarUsuario(req, res);
    res.status(201).json({ message: 'Usuário registrado com sucesso!', data: resultado });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar o usuário!' });
  }
});

// Rota para login
router.post('/login', async (req, res) => {
  try {
    const token = await loginUsuario(req, res);
    res.status(200).json({ message: 'Login realizado com sucesso!', token });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao realizar login!' });
  }
});

// Rotas protegidas
router.get('/perfil', autenticarUsuario, async (req, res) => {
  try {
    const perfil = await obterPerfilUsuario(req, res);
    res.status(200).json(perfil);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter o perfil do usuário!' });
  }
});

router.get('/estante', autenticarUsuario, async (req, res) => {
  try {
    const estante = await obterEstante(req, res);
    res.status(200).json(estante);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter a estante do usuário!' });
  }
});

router.post('/estante/adicionar', autenticarUsuario, async (req, res) => {
  try {
    const resultado = await adicionarLivroEstante(req, res);
    res.status(200).json({ message: 'Livro adicionado com sucesso à estante!', data: resultado });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar livro à estante!' });
  }
});

router.delete('/estante/remover/:id', autenticarUsuario, async (req, res) => {
  try {
    const resultado = await removerLivroEstante(req, res);
    if (resultado) {
      res.status(200).json({ message: 'Livro removido da estante com sucesso!' });
    } else {
      res.status(404).json({ error: 'Livro não encontrado na estante!' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover livro da estante!' });
  }
});

module.exports = router;
