const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

usuarioSchema.pre('save', async function(next) {
    if (this.isModified('senha')) {
        this.senha = await bcrypt.hash(this.senha, 10);
    }
    next();
});

module.exports = mongoose.model('Usuario', usuarioSchema);