const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/usuarios/registrar', (req, res, next) => {
    console.log('Recebendo requisição para registrar usuário.');
    next();
}, usuarioController.cadastrarUsuario);
router.get('/:email', usuarioController.buscarUsuarioPorEmail);
router.put('/:email', usuarioController.atualizarUsuarioPorEmail);
router.delete('/:email', usuarioController.removerUsuarioPorEmail);

router.post('/login', usuarioController.loginUsuario);

module.exports = router;
