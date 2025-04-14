import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
 
    const token = req.cookies.token;
    console.log("Token recibido:", token); // Para depuración

    if (!token) {
        console.log("Acceso denegado: No se encontró token");
        return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        const decoded = jwt.verify(token, 'secreto');
        console.log( decoded );
        req.user = decoded;
        res.locals.user = decoded; // Esto lo hará disponible en todas las vistas
        next();
    } catch (error) {
        console.error("Error verificando token:", error);
        res.clearCookie('token'); // Limpiar cookie inválida
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

export { authMiddleware };