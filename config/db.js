const mongoose = require('mongoose');
const logger = require('../utils/loggers');

const conectarDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      logger.info('Conexão com o MongoDB estabelecida com sucesso.');
    } catch (error) {
      logger.error('Erro ao conectar ao MongoDB:', error);
      process.exit(1);
    }
  };
  
  mongoose.set('debug', process.env.NODE_ENV === 'development');
  
module.exports = conectarDB;
