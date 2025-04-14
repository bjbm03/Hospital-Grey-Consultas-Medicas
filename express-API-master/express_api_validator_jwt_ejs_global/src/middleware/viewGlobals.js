// Crea un nuevo archivo: middleware/viewGlobals.js
export const viewGlobals = (req, res, next) => {
    // Variables disponibles en todas las vistas
    res.locals.isAuthenticated = !!req.user;
    res.locals.user = req.user || null;
    next();
};