const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/api/usuarios/registrar', usuarioController.cadastrarUsuario);
router.get('/:email', usuarioController.buscarUsuarioPorEmail);
router.put('/:email', usuarioController.atualizarUsuarioPorEmail);
router.delete('/:email', usuarioController.removerUsuarioPorEmail);

router.post('/login', usuarioController.loginUsuario);

module.exports = router;
