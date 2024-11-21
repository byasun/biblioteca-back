const express = require('express');
const router = express.Router();
const livroController = require('../controllers/livroController');

router.post('/', livroController.cadastrarLivro);
router.get('/', livroController.listarLivros);
router.get('/:termo', livroController.buscarLivroPorNomeOuISBN);
router.put('/:termo', livroController.atualizarLivroPorNomeOuISBN);
router.delete('/:termo', livroController.removerLivroPorNomeOuISBN);

module.exports = router;
