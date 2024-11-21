const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        console.log('Tentando conectar ao MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Conexão com o MongoDB estabelecida com sucesso!');
    } catch (error) {
        console.error('Erro ao conectar com o MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = conectarDB;
