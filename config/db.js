const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        console.log('Tentando conectar ao MongoDB...');

        await mongoose.connect(process.env.MONGO_URI, {
            ssl: true, 
            useNewUrlParser: true,
            useUnifiedTopology: true, 
            serverSelectionTimeoutMS: 60000,
        });

        console.log('Conexão com o MongoDB estabelecida com sucesso!');
    } catch (error) {
        console.error('Erro ao conectar com o MongoDB:', error.message);

        if (error.name === 'MongoNetworkError') {
            console.error('Problema de rede: Verifique as regras de firewall ou a configuração do MongoDB no Azure.');
        } else if (error.name === 'MongoTimeoutError') {
            console.error('Timeout ao tentar se conectar ao MongoDB. Tente verificar as configurações da rede ou aumentar o serverSelectionTimeoutMS.');
        }

        process.exit(1); 
    }
};

mongoose.set('debug', true);

module.exports = conectarDB;
