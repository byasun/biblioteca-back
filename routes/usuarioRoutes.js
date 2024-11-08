const express = require('express');
const { 
    registrarUsuario, 
    loginUsuario, 
    obterPerfilUsuario, 
    obterEstante, 
    adicionarLivroEstante, 
    removerLivroEstante 
} = require('../controllers/usuarioController');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const router = express.Router();

// Middleware de autenticação usando o Auth0
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_API_IDENTIFIER,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
});

// Rota para registrar um novo usuário
router.post('/registrar', registrarUsuario);

// Rota para login
router.post('/login', loginUsuario);

// Rotas protegidas
router.get('/perfil', checkJwt, obterPerfilUsuario);
router.get('/estante', checkJwt, obterEstante);
router.post('/estante/adicionar', checkJwt, adicionarLivroEstante);
router.delete('/estante/remover/:id', checkJwt, removerLivroEstante);

module.exports = router;
