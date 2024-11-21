const Livro = require('../models/Livro');
const Emprestimo = require('../models/Emprestimo');
const mongoose = require('mongoose');

// Cadastrar livro
exports.cadastrarLivro = async (req, res) => {
    const { titulo, autor, genero, descricao, isbn } = req.body;
    try {
        const novoLivro = new Livro({ titulo, autor, genero, descricao, isbn });
        await novoLivro.save();
        res.status(201).json({ message: 'Livro cadastrado com sucesso!', livro: novoLivro });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao cadastrar livro' });
    }
};

// Listar livros
exports.listarLivros = async (req, res) => {
    try {
        const livros = await Livro.find();
        res.status(200).json(livros);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar livros' });
    }
};

// Buscar livro por título ou ISBN
exports.buscarLivroPorTituloOuIsbn = async (req, res) => {
    const { busca } = req.params;  // 'busca' pode ser o título ou ISBN
    try {
        // Tentar buscar pelo título ou ISBN
        const livro = await Livro.findOne({ 
            $or: [{ titulo: new RegExp(busca, 'i') }, { isbn: busca }] 
        });

        if (!livro) {
            return res.status(404).json({ error: 'Livro não encontrado' });
        }

        res.status(200).json(livro);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar livro' });
    }
};

// Atualizar livro
exports.atualizarLivro = async (req, res) => {
    const { id } = req.params;
    const { titulo, autor, genero, descricao, isbn } = req.body;
    try {
        const livroAtualizado = await Livro.findByIdAndUpdate(id, { titulo, autor, genero, descricao, isbn }, { new: true });
        if (!livroAtualizado) {
            return res.status(404).json({ error: 'Livro não encontrado' });
        }
        res.status(200).json({ message: 'Livro atualizado com sucesso!', livro: livroAtualizado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar livro' });
    }
};

// Remover livro (verificando empréstimo)
exports.removerLivro = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        // Verificar se o livro está associado a algum empréstimo
        const livroEmprestado = await Emprestimo.findOne({ livroId: id, status: 'emprestado' });
        if (livroEmprestado) {
            return res.status(400).json({ error: 'O livro não pode ser removido, pois está emprestado' });
        }

        const livroRemovido = await Livro.findByIdAndDelete(id);
        if (!livroRemovido) {
            return res.status(404).json({ error: 'Livro não encontrado' });
        }

        res.status(200).json({ message: 'Livro removido com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao remover livro' });
    }
};
