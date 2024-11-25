const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        console.log('Tentando conectar ao MongoDB...');

        await mongoose.connect(process.env.MONGO_URI, {
            ssl: true, // Habilitar SSL para conexões seguras
            useNewUrlParser: true, // Recomendações do Mongoose (mesmo que seja ignorado em versões mais novas)
            useUnifiedTopology: true, 
            serverSelectionTimeoutMS: 30000, // Aumenta o timeout para seleção de servidores (30s)
        });

        console.log('Conexão com o MongoDB estabelecida com sucesso!');
    } catch (error) {
        console.error('Erro ao conectar com o MongoDB:', error.message);

        // Verifica e exibe mais detalhes para conexões fechadas
        if (error.name === 'MongoNetworkError') {
            console.error('Problema de rede: Verifique as regras de firewall ou a configuração do MongoDB no Azure.');
        } else if (error.name === 'MongoTimeoutError') {
            console.error('Timeout ao tentar se conectar ao MongoDB. Tente verificar as configurações da rede ou aumentar o serverSelectionTimeoutMS.');
        }

        process.exit(1); // Sai do processo com erro
    }
};

// Habilitar logs detalhados do Mongoose para depuração
mongoose.set('debug', true);

module.exports = conectarDB;
