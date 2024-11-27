const express = require('express');
const usuarioController = require('../controllers/usuarioController');

const router = express.Router();

// Rota para cadastrar usuário
router.post('/cadastrar', usuarioController.cadastrarUsuario);

// Rota para buscar usuário por email
router.get('/buscar/:email', usuarioController.buscarUsuarioPorEmail);

// Rota para atualizar usuário por email
router.put('/atualizar/:email', usuarioController.atualizarUsuarioPorEmail);

// Rota para remover usuário por email
router.delete('/remover/:email', usuarioController.removerUsuarioPorEmail);

module.exports = router;