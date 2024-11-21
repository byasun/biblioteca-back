const mongoose = require('mongoose');

const emprestimoSchema = new mongoose.Schema({
    livroId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Livro',
        required: true
    },
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    status: {
        type: String,
        enum: ['disponivel', 'emprestado'],
        default: 'disponivel'
    },
    dataEmprestimo: {
        type: Date,
        default: Date.now
    },
    dataDevolucao: Date
});

const Emprestimo = mongoose.model('Emprestimo', emprestimoSchema);

module.exports = Emprestimo;
