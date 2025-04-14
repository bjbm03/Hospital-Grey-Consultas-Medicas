import  { Router } from 'express';
const router = Router();

// Ruta de ejemplo para renderizar una plantilla

router.get('/', (req, res) => {
    res.render('index', { title: 'Inicio' });
 });


// Rutas de autenticación
router.get('/auth/register', async (req, res) => {
    res.render('auth/register');
 
});

router.get('/auth/login', (req, res) => {
     res.render('auth/login');
    
});

export {router} ;