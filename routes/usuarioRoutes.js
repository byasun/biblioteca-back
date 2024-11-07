const express = require('express');
const { 
    registrarUsuario, 
    loginUsuario, 
    obterPerfilUsuario, 
    obterEstante, 
    adicionarLivroEstante, 
    removerLivroEstante 
} = require('../controllers/usuarioController');

const router = express.Router();

// Rota para registrar um novo usuário
router.post('/registrar', registrarUsuario);

// Rota para login
router.post('/login', loginUsuario);

// Rota para obter o perfil do usuário
router.get('/perfil', obterPerfilUsuario);

// Rota para obter a estante de livros
router.get('/estante', obterEstante);

// Rota para adicionar livro à estante
router.post('/estante/adicionar', adicionarLivroEstante);

// Rota para remover livro da estante
router.delete('/estante/remover/:id', removerLivroEstante);

module.exports = router;
