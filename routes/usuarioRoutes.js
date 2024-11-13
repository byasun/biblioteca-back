const express = require('express');
const Joi = require('joi');
const {
  registrarUsuario,
  loginUsuario,
  obterPerfilUsuario,
  obterEstante,
  adicionarLivroEstante,
  removerLivroEstante
} = require('../controllers/usuarioController');
const autenticarUsuario = require('../middleware/authMiddleware'); // Importando o middleware de autenticação
require('dotenv').config();

const router = express.Router();

// Validação dos dados de registro usando Joi
const schema = Joi.object({
  nome: Joi.string().required(),
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required(),
  chave: Joi.string().optional()
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
router.post('/registrar', validarCadastro, registrarUsuario);

// Rota para login
router.post('/login', loginUsuario);

// Rotas protegidas
router.get('/perfil', autenticarUsuario, obterPerfilUsuario);
router.get('/estante', autenticarUsuario, obterEstante);
router.post('/estante/adicionar', autenticarUsuario, adicionarLivroEstante);
router.delete('/estante/remover/:id', autenticarUsuario, removerLivroEstante);

module.exports = router;
