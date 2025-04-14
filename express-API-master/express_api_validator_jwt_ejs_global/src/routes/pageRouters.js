import  { Router } from 'express';
import { pool } from '../config/db.js';
const router = Router();

// Ruta de ejemplo para renderizar una plantilla

router.get('/', (req, res) => {
    res.render('index', { title: 'Inicio', message: '¡Hola desde INDEX!' });
 });

 router.get('/about', (req, res) => {
   res.render('about', {  message: '¡Hola desde About!' });
});

router.get('/contacto', (req, res) =>{
    res.render('contacto', {  message: '¡Hola desde Contacto!' })
});

// Rutas de autenticación
router.get('/auth/register', async (req, res) => {
    try {
        const [roles] = await pool.query("SELECT * FROM rol");
       
        res.render('auth/register', { 
            roles,
            message: req.query.registered ? {
                text: 'Registro exitoso. Por favor inicia sesión.',
                type: 'success'
            } : null
        });
    } catch (error) {
        console.error(error);
        res.render('auth/register', { 
            roles: [],
            message: {
                text: 'Error al cargar los roles',
                type: 'error'
            }
        });
    }
});

router.get('/auth/login', (req, res) => {
    res.render('auth/login', { 
        message: req.query.registered ? {
            text: 'Registro exitoso. Por favor inicia sesión.',
            type: 'success'
        } : null
    });
});

export {router} ;