const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const router = express.Router();

router.post('/cadastrar', usuarioController.cadastrarUsuario);
router.get('/', usuarioController.listarUsuarios);

module.exports = router;
