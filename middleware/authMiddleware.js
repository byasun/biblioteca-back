const jwt = require('jsonwebtoken');

const autenticarUsuario = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Acesso negado! Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuarioId = decoded.id;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado! Faça login novamente.' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ error: 'Token inválido!' });
        }
        return res.status(500).json({ error: 'Erro interno no servidor!' });
    }
};

module.exports = autenticarUsuario;
