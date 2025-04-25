import  { Router } from 'express';
const router = Router();

// Ruta de ejemplo para renderizar una plantilla

router.get('/', (req, res) =>{
    res.render('dashboard/index.ejs');
})

router.get('/historias', (req, res) =>{
    res.render('dashboard/historias.ejs');
})

router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/'
    });
    res.json({ message: 'Sesión cerrada correctamente' });
});

export {router} ;