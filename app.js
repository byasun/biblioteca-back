const express = require('express');
const conectarDB = require('./config/db');
const routes = require('./routes/index.js'); 
const cors = require('cors');
const logger = require('./utils/loggers.js');
const errorHandler = require('./middleware/errorHandler');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || '*';

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
      sameSite: 'None', // Permitir envio de cookies entre origens diferentes
    },
  })
);

// Configuração de CORS
const corsOptions = {
  origin: FRONTEND_URL || '*', // Certifique-se de que isso esteja correto
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

// Rotas com prefixo '/api'
app.use('/api', routes);

// Rota inicial
app.get('/', (req, res) => {
  logger.info('Rota inicial acessada.');
  res.send('API da Biblioteca Comunitária');
});

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// Exporta o aplicativo
module.exports = app;
