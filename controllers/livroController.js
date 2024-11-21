const Livro = require('../models/Livro');
const logger = require('../utils/logger');

exports.cadastrarLivro = async (req, res, next) => {
    const { titulo, autor, genero, descricao, isbn } = req.body;
    try {
        const novoLivro = new Livro({ titulo, autor, genero, descricao, isbn });
        await novoLivro.save();
        logger.info(`Livro cadastrado: ${titulo} (${isbn})`);
        res.status(201).json({ message: 'Livro cadastrado com sucesso!', livro: novoLivro });
    } catch (error) {
        logger.error('Erro ao cadastrar livro:', error);
        next(error);
    }
};

exports.listarLivros = async (req, res, next) => {
    try {
        const livros = await Livro.find();
        logger.info('Lista de livros recuperada com sucesso.');
        res.status(200).json(livros);
    } catch (error) {
        logger.error('Erro ao listar livros:', error);
        next(error);
    }
};

exports.buscarLivroPorNomeOuISBN = async (req, res, next) => {
    const { termo } = req.params; // termo pode ser título ou ISBN
    try {
        const query = isNaN(termo) // Verifica se o termo é número (ISBN)
            ? { titulo: new RegExp(termo, 'i') } // Busca por título (case insensitive)
            : { isbn: termo }; // Busca por ISBN
        const livro = await Livro.findOne(query);
        if (!livro) {
            logger.warn(`Livro não encontrado: ${termo}`);
            return res.status(404).json({ error: 'Livro não encontrado' });
        }
        logger.info(`Livro encontrado: ${livro.titulo} (${livro.isbn})`);
        res.status(200).json(livro);
    } catch (error) {
        logger.error('Erro ao buscar livro:', error);
        next(error);
    }
};

exports.atualizarLivroPorNomeOuISBN = async (req, res, next) => {
    const { termo } = req.params;
    const { titulo, autor, genero, descricao, isbn } = req.body;
    try {
        const query = isNaN(termo) ? { titulo: termo } : { isbn: termo };
        const livroAtualizado = await Livro.findOneAndUpdate(
            query,
            { titulo, autor, genero, descricao, isbn },
            { new: true }
        );
        if (!livroAtualizado) {
            logger.warn(`Livro não encontrado para atualização: ${termo}`);
            return res.status(404).json({ error: 'Livro não encontrado' });
        }
        logger.info(`Livro atualizado: ${livroAtualizado.titulo} (${livroAtualizado.isbn})`);
        res.status(200).json({ message: 'Livro atualizado com sucesso!', livro: livroAtualizado });
    } catch (error) {
        logger.error('Erro ao atualizar livro:', error);
        next(error);
    }
};

exports.removerLivroPorNomeOuISBN = async (req, res, next) => {
    const { termo } = req.params;
    try {
        const query = isNaN(termo) ? { titulo: termo } : { isbn: termo };
        const livroRemovido = await Livro.findOneAndDelete(query);
        if (!livroRemovido) {
            logger.warn(`Livro não encontrado para remoção: ${termo}`);
            return res.status(404).json({ error: 'Livro não encontrado' });
        }
        logger.info(`Livro removido: ${livroRemovido.titulo} (${livroRemovido.isbn})`);
        res.status(200).json({ message: 'Livro removido com sucesso!' });
    } catch (error) {
        logger.error('Erro ao remover livro:', error);
        next(error);
    }
};
