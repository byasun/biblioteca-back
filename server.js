const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');
const app = require('./app');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 8080;

// Monitoramento de eventos globais
process.on('uncaughtException', (err) => {
    logger.error('Erro não tratado:', { message: err.message, stack: err.stack });
    process.exit(1); // Finaliza o processo em caso de erro crítico
});

process.on('unhandledRejection', (reason, promise) => {
    logger.warn('Promessa rejeitada:', { promise, reason });
});

// Iniciar o servidor
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            logger.info(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch(err => {
        logger.error('Erro ao conectar ao banco de dados:', { message: err.message });
        process.exit(1);
    });
