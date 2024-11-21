const jwt = require('jsonwebtoken');

const autenticarUsuario = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Acesso não autorizado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decoded.id; // Adiciona o id do usuário à requisição
    next();
  } catch (error) {
    return res.status(400).json({ error: 'Token inválido' });
  }
};

module.exports = { autenticarUsuario };
