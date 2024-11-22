const express = require('express');
const conectarDB = require('./config/db');
const usuarioRoutes = require('./routes/usuarioRoutes');
const livroRoutes = require('./routes/livroRoutes');
const cors = require('cors');
const logger = require('./utils/loggers');
const errorHandler = require('./middleware/errorHandler');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();

// Conectar ao banco de dados
conectarDB()
    .then(() => logger.info('Banco de dados conectado com sucesso.'))
    .catch((err) => logger.error('Erro ao conectar ao banco de dados:', { message: err.message }));

// Middleware
app.options('*', cors());
app.use(cors({
  origin: process.env.FRONTEND_URL, // Permitir apenas esse domínio
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Permitir o envio de cookies
}));
app.use(express.json()); // Substitui o bodyParser.json()
app.use((req, res, next) => {
    logger.info(`Requisição recebida: ${req.method} ${req.url}`);
    next();
});
app.use(cookieParser());
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS em produção
    httpOnly: true, // Apenas acessível pelo servidor
    sameSite: 'None', // Permitir o envio de cookies entre origens diferentes
  },
}));

// Rotas
app.use('/usuarios', usuarioRoutes);
app.use('/livros', livroRoutes);

// Rota inicial
app.get('/', (req, res) => {
    logger.info('Rota inicial acessada.');
    res.send('API da Biblioteca Comunitária');
});

// Middleware de tratamento de erros
app.use(errorHandler);

module.exports = app;
