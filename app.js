const express = require('express');
const conectarDB = require('./config/db');
const routes = require('./routes/index.js'); 
const cors = require('cors');
const logger = require('./utils/loggers.js');
const errorHandler = require('./middleware/errorHandler');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware de parsing do JSON
app.use(express.json());

// Middleware de cookies e sessões
app.use(cookieParser());
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS em produção
      httpOnly: true, // Apenas acessível pelo servidor
      sameSite: 'None', // Permitir o envio de cookies entre origens diferentes
    },
  })
);

// Configuração de CORS
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware de log de requisições
app.use((req, res, next) => {
  logger.info(`Requisição recebida: ${req.method} ${req.url}`);
  next();
});

// Rotas principais (usando o roteador principal)
app.use('/api', routes);

// Rota inicial
app.get('/', (req, res) => {
  logger.info('Rota inicial acessada.');
  res.send('API da Biblioteca Comunitária');
});

// Middleware para rotas não encontradas (aplicado após as rotas principais)
app.use((req, res) => {
  const message = `Rota não encontrada: ${req.method} ${req.originalUrl}`;
  logger.warn(message);

  res.status(404).json({
    error: 'Rota não encontrada',
    method: req.method,
    path: req.originalUrl,
  });
});

// Middleware de tratamento de erros (deve ser o último)
app.use((err, req, res, next) => {
  logger.error(`Erro na rota ${req.method} ${req.originalUrl}: ${err.message}`);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno no servidor',
  });
});

// Exporta o aplicativo
module.exports = app;
