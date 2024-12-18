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

exports.doarLivro = async (req, res, next) => {
    const { titulo, autor, genero, descricao, isbn } = req.body;
    try {
        const livroExistente = await Livro.findOne({ isbn });
        if (livroExistente) {
            return res.status(400).json({ error: 'Este livro já está cadastrado.' });
        }
        
        const novoLivro = new Livro({ titulo, autor, genero, descricao, isbn });
        await novoLivro.save();
        logger.info(`Livro doado e cadastrado: ${titulo} (${isbn})`);
        res.status(201).json({ message: 'Livro doado com sucesso!', livro: novoLivro });
    } catch (error) {
        logger.error('Erro ao doar livro:', error);
        next(error);
    }
};

exports.pegarLivro = async (req, res, next) => {
    const { livroId, usuarioId } = req.body;
    try {
        const livro = await Livro.findById(livroId);
        if (!livro) {
            return res.status(404).json({ error: 'Livro não encontrado.' });
        }
        if (livro.emprestado) {
            return res.status(400).json({ error: 'O livro já está emprestado.' });
        }

        const novoEmprestimo = new Emprestimo({ livroId, usuarioId, status: 'emprestado' });
        await novoEmprestimo.save();
        livro.emprestado = true;
        await livro.save();

        logger.info(`Livro emprestado: ${livro.titulo} para usuário ${usuarioId}`);
        res.status(201).json({ message: 'Livro emprestado com sucesso!', emprestimo: novoEmprestimo });
    } catch (error) {
        logger.error('Erro ao pegar livro:', error);
        next(error);
    }
};

exports.devolverLivro = async (req, res, next) => {
    const { emprestimoId } = req.body;
    try {
        const emprestimo = await Emprestimo.findById(emprestimoId);
        if (!emprestimo || emprestimo.status === 'disponivel') {
            return res.status(400).json({ error: 'O empréstimo não é válido ou o livro já foi devolvido.' });
        }

        const livro = await Livro.findById(emprestimo.livroId);
        if (!livro) {
            return res.status(404).json({ error: 'Livro não encontrado.' });
        }

        emprestimo.status = 'disponivel';
        emprestimo.dataDevolucao = new Date();
        await emprestimo.save();

        livro.emprestado = false;
        await livro.save();

        logger.info(`Livro devolvido: ${livro.titulo}`);
        res.status(200).json({ message: 'Livro devolvido com sucesso!' });
    } catch (error) {
        logger.error('Erro ao devolver livro:', error);
        next(error);
    }
};

exports.avaliarLivro = async (req, res, next) => {
    const { livroId, usuarioId, nota, comentario } = req.body;
    try {
        const livro = await Livro.findById(livroId);
        if (!livro) {
            return res.status(404).json({ error: 'Livro não encontrado.' });
        }

        livro.avaliacoes.push({ usuarioId, nota, comentario });
        await livro.save();

        logger.info(`Livro avaliado: ${livro.titulo} por usuário ${usuarioId}`);
        res.status(201).json({ message: 'Avaliação registrada com sucesso!', livro });
    } catch (error) {
        logger.error('Erro ao avaliar livro:', error);
        next(error);
    }
};

exports.adicionarQuote = async (req, res, next) => {
    const { livroId, usuarioId, texto } = req.body;
    try {
        const livro = await Livro.findById(livroId);
        if (!livro) {
            return res.status(404).json({ error: 'Livro não encontrado.' });
        }

        livro.quotes.push({ usuarioId, texto });
        await livro.save();

        logger.info(`Quote adicionada ao livro: ${livro.titulo}`);
        res.status(201).json({ message: 'Quote adicionada com sucesso!', livro });
    } catch (error) {
        logger.error('Erro ao adicionar quote:', error);
        next(error);
    }
};
