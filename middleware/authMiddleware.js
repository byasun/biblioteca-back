const authMiddleware = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: 'Acesso não autorizado.' });
    }
    req.user = req.session.user;
    next();
};

module.exports = authMiddleware;
