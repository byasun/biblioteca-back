const mongoose = require('mongoose');

const livroSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    autor: {
        type: String,
        required: true
    },
    genero: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true,   // O ISBN é obrigatório agora
        unique: true      // Garante que o ISBN seja único
    },
    emprestado: {
        type: Boolean,
        default: false
    }
});

const Livro = mongoose.model('Livro', livroSchema);

module.exports = Livro;
