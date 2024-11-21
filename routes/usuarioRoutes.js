const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/', usuarioController.cadastrarUsuario);
router.get('/:email', usuarioController.buscarUsuarioPorEmail);
router.put('/:email', usuarioController.atualizarUsuarioPorEmail);
router.delete('/:email', usuarioController.removerUsuarioPorEmail);

module.exports = router;
