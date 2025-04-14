import { body, validationResult } from 'express-validator';
import { pool } from '../config/db.js';
import jwt  from 'jsonwebtoken';
import bcrypt  from 'bcryptjs';

// Middleware de validación para registro
const validateRegister = [
  body('nombre').trim().notEmpty().withMessage('Nombre es requerido'),
  body('apellido').trim().notEmpty().withMessage('Nombre es requerido'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

async function register(req, res){
     // 1. Validar errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
      const {nombre, apellido, especialidad, telefono, email, password } = req.body;
      const [existingUsers] = await pool.query("SELECT * FROM medico WHERE email = ?", [email,]);
 
      if(existingUsers.length > 0){
            return res.status(400).json({ message: `El email ${email} ya está registrado` });
        }
        //const hashedPassword = await bcrypt.hash(password, 10);
        const [rows] = await pool.query("INSERT INTO medico (nombre, apellido, especialidad, telefono, email, password ) VALUES (?, ?, ?, ?, ?, ?)", [nombre, apellido, especialidad, telefono, email, password ]);
        res.status(201).json({ id: rows.insertId,nombre, email, password, especialidad });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something goes wrong" });
    }
  };

  async function login(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body;
      const [rows] = await pool.query("SELECT * FROM medico WHERE email = ? ", [email,]);
    
      if(rows.length !== 1 ){
          throw new Error('Credenciales inválidas'); 
      }

      const user = rows[0];
      //console.log(user.password);
      if(user.password !== password ){
        return res.status(400).json({ error: 'Credenciales inválidas' });
      }

      // 3. Comparar contraseña con hash (usando bcrypt)
      /*
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new Error('Credenciales inválidas');
      }
      */

      const token = jwt.sign({ id: user.id, nombre: user.nombre, email: user.email, apellido: user.apellido, especialidad: user.especialidad }, 'secreto', { expiresIn: '6h' });

      // 3. Establecer cookie HTTP-Only
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
        sameSite: 'strict', // Protección contra CSRF
        maxAge: 2 * 60 * 60 * 1000, // 2 horas (debe coincidir con la expiración del JWT)
        path: '/', // Accesible en todas las rutas
      });

      res.json({ 
        message: 'Login exitoso',
        user: { id: user.id, nombre: user.nombre,  email: user.email }
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};
/*
function logout(req, res){
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });
  res.json({ message: 'Sesión cerrada correctamente' });

}
*/
export { register, login,  validateRegister, validateLogin };