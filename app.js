const express = require('express');
const conectarDB = require('./config/db');
const routes = require('./routes/index.js'); 
const cors = require('cors');
const logger = require('./utils/logger.js');
const errorHandler = require('./middleware/errorHandler');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || '*';

// Middleware de parsing do JSON
app.use(express.json());

// Middleware de cookies e sessões
app.use(cookieParser());
app.use(
  session({
    secret: process.env.JWT_SECRET || 'chave-secreta',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 24 * 60 * 60, // Sessão expira em 24 horas
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS em produção
      httpOnly: true,
      sameSite: 'lax',
    },
  })
);

const corsOptions = {
  origin: FRONTEND_URL, // Domínio do frontend ou qualquer origem
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Permite envio de cookies/autenticação
};

app.use(cors(corsOptions)); // Middleware do CORS
app.options('*', cors(corsOptions));

// Adicione mais middleware ou rotas depois desta configuração
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
