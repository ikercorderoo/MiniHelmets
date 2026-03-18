const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Obtenir el token del header (format "Bearer <token>")
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Accés denegat. No s'ha proporcionat cap token." });
        }

        const token = authHeader.replace('Bearer ', '');
        
        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Afegir usuari a la petició
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token no vàlid o expirat." });
    }
};

module.exports = authMiddleware;
