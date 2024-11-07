const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    senha: {
        type: String,
        required: true
    },
    chave: {
        type: String,
        default: null
    },
    estante: {
        doacoes: [{
            livroId: mongoose.Schema.Types.ObjectId,
            titulo: String,
            dataDoacao: Date
        }],
        emprestimos: [{
            livroId: mongoose.Schema.Types.ObjectId,
            titulo: String,
            dataEmprestimo: Date,
            dataDevolucao: Date
        }],
        avaliacoes: [{
            livroId: mongoose.Schema.Types.ObjectId,
            titulo: String,
            avaliacao: Number,
            comentario: String
        }],
        quotes: [{
            livroId: mongoose.Schema.Types.ObjectId,
            titulo: String,
            quote: String
        }]
    }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
