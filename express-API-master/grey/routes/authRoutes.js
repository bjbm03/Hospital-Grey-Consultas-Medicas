import express from 'express';
import { register, login, validateRegister, validateLogin } from '../controller/authControler.js';

const router = express.Router();

router.post('/register',validateRegister,  register);
router.post('/login',validateLogin, login);
//router.post('/logout', logout);

export { router };
