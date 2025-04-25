import { pool } from "../config/db.js";
import multer from "multer";
import path from "path";

async function getHitorias(req, res) {
    try {
        const id_usuario = req.user.id;
    const [rows] = await pool.query("SELECT historial_medico.id, paciente.nombre,historial_medico.fecha_registro,historial_medico.diagnostico, historial_medico.observaciones, cita.id AS id_cita FROM consultas_medicas  INNER JOIN historial_medico ON  historial_medico.id_consultas_medicas = consultas_medicas.id  INNER JOIN cita ON  consultas_medicas.id_cita = cita.id  INNER  JOIN paciente ON cita.id_paciente = paciente.id  INNER  JOIN medico ON medico.id =  consultas_medicas.id_medico  WHERE medico.id = ?", [id_usuario,]);
    res.json(rows);
    } catch (error) {
        return res.status(500).json({message: "something goes wrong"});
    }
}

async function getHistoriaId(req, res){
    try {
        const { id } = req.params;
        const id_usuario = req.user.id;
        console.log(id);
        
        const [rows] = await pool.query("SELECT consultas_medicas.id, medico.nombre AS medico, paciente.nombre AS paciente, historial_medico.diagnostico, historial_medico.tratamiento, historial_medico.observaciones, historial_medico.img FROM consultas_medicas INNER JOIN historial_medico ON  historial_medico.id_consultas_medicas = consultas_medicas.id INNER  JOIN paciente ON historial_medico.id_paciente = paciente.id INNER JOIN medico ON medico.id = ? AND historial_medico.id = ?", [id_usuario, id ]);

        res.json(rows);
        
       // return res.status(200).json({ message: "Bien" });
        } catch (error) {
            return res.status(500).json({message: "something goes wrong"});
        }
  }

  async function createHistoria(req, res) {
    try {
        console.log(req.body);
        const { id_consultas_medicas, id_paciente, id_cita, diagnostico, tratamiento, observaciones } = req.body;
        const archivo = req.file ? `/uploads/${req.file.filename}` : null;

        const [rows] = await pool.query(
            "INSERT INTO historial_medico (id_consultas_medicas, id_paciente, diagnostico, tratamiento, observaciones, img) VALUES (?, ?, ?, ?, ?, ?)",
            [id_consultas_medicas, id_paciente, diagnostico, tratamiento, observaciones, archivo]
        );

        await pool.query("UPDATE cita SET estado = ? WHERE id = ?", ["completado", id_cita]);
        res.status(201).json({ 
            id: rows.insertId, 
            id_consultas_medicas, 
            id_paciente, 
            diagnostico, 
            tratamiento, 
            observaciones,
            img: archivo 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something goes wrong" });
    }
}

async function updateHistoria(req, res) {
    try {
        const { id } = req.params;
        const { diagnostico, tratamiento, observaciones } = req.body;
        const archivo = req.file ? `/uploads/${req.file.filename}` : null;

        // Actualiza el historial médico incluyendo el archivo si se subió uno
        const [result] = await pool.query(
            "UPDATE historial_medico SET diagnostico = IFNULL(?, diagnostico), tratamiento = IFNULL(?, tratamiento), observaciones = IFNULL(?, observaciones), img = IFNULL(?, img) WHERE id = ?",
            [diagnostico, tratamiento, observaciones, archivo, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const [rows] = await pool.query("SELECT * FROM historial_medico WHERE id = ?", [id]);
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({ 
            message: "Error al actualizar el historial médico",
            error: error.message  
        });
    }
}

async function deleteHistoria(req, res){
    try {
        const { id, id_cita } = req.params;
      
        const [rows] = await pool.query("DELETE FROM historial_medico WHERE id = ?", [id]);
        await pool.query("UPDATE cita SET estado = ?  WHERE id = ?",[ "pendiente", id_cita ]);
    
        if (rows.affectedRows <= 0) {
        return res.status(404).json({ message: "User not found" });
        }

        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: "Something goes wrong" });
    }
  };

  // Code upload File
  
  // Configuración de Multer para guardar archivos en la carpeta 'public/uploads'
  const storage = multer.diskStorage({
      destination: (req, file, cb) => {
          const uploadPath = path.join(process.cwd(), 'public', 'uploads');
          cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = path.extname(file.originalname);
          cb(null, file.fieldname + '-' + uniqueSuffix + ext);
      }
  });
  
  const upload = multer({ 
      storage: storage,
      fileFilter: (req, file, cb) => {
          const allowedExtensions = ['.pdf', '.docx'];
          const ext = path.extname(file.originalname).toLowerCase();
          if (allowedExtensions.includes(ext)) {
              cb(null, true);
          } else {
              cb(new Error('Solo se permiten archivos PDF o DOCX'), false);
          }
      }
  });

export { getHitorias,  getHistoriaId, deleteHistoria, createHistoria, updateHistoria, upload }