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
        res.status(400).json({ error: 'Token inválido!' });
    }
};

module.exports = autenticarUsuario;
