import  { Router } from 'express';
const router = Router();

// Ruta de ejemplo para renderizar una plantilla

router.get('/', (req, res) =>{
    res.render('dashbord.ejs', {  message: '¡DASHBORD!' , title:'Pagina Dashbord' })
})

router.get('/consultas', (req, res) =>{
    res.render('consultas.ejs', {  message: 'Consultas!', title:'Pagina Consulta' })
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