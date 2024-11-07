const mongoose = require('mongoose');

// Conexão ao banco de dados
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Conectado ao banco de dados');
    } catch (error) {
        console.error('Erro na conexão com o banco de dados', error);
        process.exit(1); // Finaliza o processo com erro
    }
};

module.exports = connectDB;
