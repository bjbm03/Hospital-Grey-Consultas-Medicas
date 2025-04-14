import { pool } from '../config/db.js';

async function getUsers(req, res){
    try {
        const [rows] = await pool.query("SELECT * FROM usuarios");
        res.json(rows);
      } catch (error) {
        return res.status(500).json({ message: "Something goes wrong" });
      }
}

 async function getuserId(req, res){
    try {
      const { id } = req.params;
      const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id,]);
  
      if (rows.length <= 0) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(rows[0]);
    } catch (error) {
      return res.status(500).json({ message: "Something goes wrong" });
    }
  }

async function createUser(req, res){
    try {

      const {nombre, email, password, rol } = req.body;
      const [existingUsers] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email,]);
 
      if(existingUsers.length > 0){
            return res.status(400).json({ message: `El email ${email} ya está registrado` });
        }
      const [rows] = await pool.query("INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)", [nombre, email, password, rol]);
      res.status(201).json({ id: rows.insertId,nombre, email, password, rol });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something goes wrong" });
    }
  };

async function updateUser(req, res){
    try {
      const { id } = req.params;
      const {nombre, email, password, rol } = req.body;
      //Utiliza patch
      //"UPDATE employee SET name = IFNULL(?, name), salary = IFNULL(?, salary) WHERE id = ?",
      //Utiliza put
      const [result] = await pool.query("UPDATE usuarios SET nombre = ?, email = ?, password = ?, rol = ?  WHERE id = ?",[nombre, email, password, rol, id]);
  
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "User not found" });
        const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id,]);
        res.json(rows[0]);
    } catch (error) {
      return res.status(500).json({ message: "Something goes wrong" });
    }
  };

async function deleteUser(req, res){
    try {
      const { id } = req.params;
      const [rows] = await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
  
      if (rows.affectedRows <= 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.sendStatus(204);
    } catch (error) {
      return res.status(500).json({ message: "Something goes wrong" });
    }
  };

export { getUsers, getuserId, createUser, updateUser, deleteUser }


  