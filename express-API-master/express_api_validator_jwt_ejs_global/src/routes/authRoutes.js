import express from 'express';
import { register, login, rol, validateRegister, validateLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/register',validateRegister,  register);
router.post('/login',validateLogin, login);
router.get('/rol', rol);

export { router };