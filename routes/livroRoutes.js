const express = require('express');
const router = express.Router();
const livroController = require('../controllers/livroController');

router.post('/', livroController.cadastrarLivro);
router.get('/', livroController.listarLivros);
router.get('/:termo', livroController.buscarLivroPorNomeOuISBN);
router.put('/:termo', livroController.atualizarLivroPorNomeOuISBN);
router.delete('/:termo', livroController.removerLivroPorNomeOuISBN);
router.post('/doar', livroController.doarLivro);
router.post('/pegar', livroController.pegarLivro);
router.post('/devolver', livroController.devolverLivro);
router.post('/avaliar', livroController.avaliarLivro);
router.post('/quotes', livroController.adicionarQuote);

module.exports = router;
