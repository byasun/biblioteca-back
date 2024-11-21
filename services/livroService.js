const Livro = require('../models/Livro');

const cadastrarLivro = async (dadosLivro) => {
    const novoLivro = new Livro(dadosLivro);
    return await novoLivro.save();
};

const listarLivros = async () => {
    return await Livro.find();
};

const buscarLivroPorTituloOuIsbn = async (busca) => {
    return await Livro.findOne({
        $or: [{ titulo: new RegExp(busca, 'i') }, { isbn: busca }]
    });
};

const atualizarLivro = async (id, dadosAtualizados) => {
    return await Livro.findByIdAndUpdate(id, dadosAtualizados, { new: true });
};

const removerLivro = async (id) => {
    return await Livro.findByIdAndDelete(id);
};

module.exports = {
    cadastrarLivro,
    listarLivros,
    buscarLivroPorTituloOuIsbn,
    atualizarLivro,
    removerLivro
};
