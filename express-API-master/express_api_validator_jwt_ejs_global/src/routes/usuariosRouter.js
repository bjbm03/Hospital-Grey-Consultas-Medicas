import  { Router } from 'express';
import  { getUsers, getuserId, createUser, updateUser, deleteUser } from "../controllers/usuariosController.js"
const router = Router();

// GET all User
router.get("/usuario", getUsers );

// GET one or id User
router.get("/usuario/:id", getuserId );

// Post create User
router.post("/usuario/", createUser );

// Put create User
router.put("/usuario/:id", updateUser);

// Delete  User
router.delete("/usuario/:id", deleteUser);

export {router} ;