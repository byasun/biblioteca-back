const express = require('express');
const usuarioRoutes = require('./usuarios');
const livroRoutes = require('./livros');

const router = express.Router();

router.use('/usuarios', usuarioRoutes);
router.use('/livros', livroRoutes); // Opcional

module.exports = router;
