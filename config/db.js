const mongoose = require('mongoose');
const logger = require('../utils/logger');

const conectarDB = async () => {
  try {
      await mongoose.connect(process.env.MONGO_URI);
      logger.info('Conexão com o MongoDB estabelecida com sucesso.');
  } catch (error) {
      logger.error('Erro ao conectar ao MongoDB:', error);
      process.exit(1);
  }
};

mongoose.set('debug', process.env.NODE_ENV === 'development');

module.exports = conectarDB;
