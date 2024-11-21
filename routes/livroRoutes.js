const express = require('express');
const livroController = require('../controllers/livroController');
const router = express.Router();

router.post('/cadastrar', livroController.cadastrarLivro);
router.get('/', livroController.listarLivros);
router.get('/:busca', livroController.buscarLivroPorTituloOuIsbn);  // Busca por título ou ISBN
router.put('/:id', livroController.atualizarLivro);
router.delete('/:id', livroController.removerLivro);

module.exports = router;
