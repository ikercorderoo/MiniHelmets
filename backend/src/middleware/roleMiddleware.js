module.exports = (...roles) => {
    return (req, res, next) => {
        // req.user ha d'existir prèviament creat per authMiddleware
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Accés prohibit. No tens permisos suficients." });
        }
        next();
    };
};
