import { pool } from "../config/db.js";
import multer from "multer";
import path from "path";

async function getConsultas(req, res) {
    try {

        const id_usuario = req.user.id;
    const [rows] = await pool.query("SELECT consultas_medicas.id, medico.nombre AS medico, paciente.nombre, historial_medico.id AS id_historial, cita.estado, cita.turno, cita.fecha_cita, paciente.id AS id_paciente, cita.id AS id_cita ,medico.id AS id_medico FROM consultas_medicas LEFT JOIN historial_medico ON  historial_medico.id_consultas_medicas = consultas_medicas.id  INNER JOIN cita ON  consultas_medicas.id_cita = cita.id  INNER  JOIN paciente ON cita.id_paciente = paciente.id  INNER  JOIN medico ON medico.id =  consultas_medicas.id_medico  WHERE medico.id = ?", [id_usuario,]);
    res.json(rows);
    } catch (error) {
        return res.status(500).json({message: "something goes wrong"});
    }
}

async function getConsultasCompletada(req, res) {
    try {
        const id_usuario =  req.user.id;
    const [rows] = await pool.query("SELECT consultas_medicas.id, medico.nombre AS medico, paciente.nombre, historial_medico.id AS id_historial, cita.estado, cita.turno, cita.fecha_cita, paciente.id AS id_paciente, cita.id AS id_cita ,medico.id AS id_medico FROM consultas_medicas LEFT JOIN historial_medico ON  historial_medico.id_consultas_medicas = consultas_medicas.id  INNER JOIN cita ON  consultas_medicas.id_cita = cita.id  INNER  JOIN paciente ON cita.id_paciente = paciente.id  INNER  JOIN medico ON medico.id =  consultas_medicas.id_medico  WHERE medico.id = ?  AND cita.estado = 'completado' ", [id_usuario,]);
    res.json(rows);
    } catch (error) {
        return res.status(500).json({message: "something goes wrong"});
    }
}

async function getConsultasPendiente(req, res) {
    try {
        const id_usuario =  req.user.id; 
    const [rows] = await pool.query("SELECT consultas_medicas.id, medico.nombre AS medico, paciente.nombre, historial_medico.id AS id_historial, cita.estado, cita.turno, cita.fecha_cita, paciente.id AS id_paciente, cita.id AS id_cita ,medico.id AS id_medico FROM consultas_medicas LEFT JOIN historial_medico ON  historial_medico.id_consultas_medicas = consultas_medicas.id  INNER JOIN cita ON  consultas_medicas.id_cita = cita.id  INNER  JOIN paciente ON cita.id_paciente = paciente.id  INNER  JOIN medico ON medico.id =  consultas_medicas.id_medico  WHERE medico.id = ?  AND cita.estado = 'pendiente' ", [id_usuario,]);
    res.json(rows);
    } catch (error) {
        return res.status(500).json({message: "something goes wrong"});
    }
}

async function searchConsultations(req, res) {
    try {
        const { searchTerm } = req.query;
        const id_usuario =  req.user.id;
        
        let query = `
            SELECT 
                consultas_medicas.id, 
                medico.nombre AS medico, 
                paciente.nombre, 
                historial_medico.id AS id_historial, 
                cita.estado, 
                cita.turno, 
                cita.fecha_cita, 
                paciente.id AS id_paciente, 
                cita.id AS id_cita,
                medico.id AS id_medico 
            FROM consultas_medicas 
            LEFT JOIN historial_medico ON historial_medico.id_consultas_medicas = consultas_medicas.id  
            INNER JOIN cita ON consultas_medicas.id_cita = cita.id  
            INNER JOIN paciente ON cita.id_paciente = paciente.id  
            INNER JOIN medico ON medico.id = consultas_medicas.id_medico  
            WHERE medico.id = ? 
        `;
        
        let params = [id_usuario];
        
        if (searchTerm) {
            query += ` AND (paciente.nombre LIKE ? OR medico.nombre LIKE ? OR cita.turno LIKE ? OR historial_medico.id LIKE ? )`;
            params.push(`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`);
        }
        
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error en searchConsultations:', error);
        return res.status(500).json({message: "Error al buscar consultas"});
    }
}

async function createHistoria(req, res) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { id_consultas_medicas, id_paciente, id_cita, diagnostico, tratamiento, observaciones} = req.body;
        let insumos = [];
        if (req.body.insumos) {
            insumos = typeof req.body.insumos === 'string' ? 
            JSON.parse(req.body.insumos) : 
            req.body.insumos;
        }
        const archivo = req.file ? `/uploads/${req.file.filename}` : null;

        // 1. Crear historial médico
        const [rows] = await connection.query(
            "INSERT INTO historial_medico (id_consultas_medicas, id_paciente, diagnostico, tratamiento, observaciones, img) VALUES (?, ?, ?, ?, ?, ?)",
            [id_consultas_medicas, id_paciente, diagnostico, tratamiento, observaciones, archivo]
        );

        // 2. Actualizar inventario (si hay insumos)
        if (insumos && insumos.length > 0) {
            req.body.insumos = insumos; // Aseguramos que esté disponible
            console.log(insumos)
            await updateInventarioConsultorio(req);
        }

        // 3. Actualizar estado de la cita
        await connection.query("UPDATE cita SET estado = ? WHERE id = ?", ["completado", id_cita]);

        await connection.commit();

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
        await connection.rollback();
        console.error("Error en createHistoria:", error);
        res.status(500).json({ 
            message: "Error al crear el historial médico",
            error: error.message
        });
    } finally {
        connection.release();
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

  async function updateHistoria(req, res) {
    try {
                // Parsear insumos si vienen como string JSON
                let insumos = [];
                if (req.body.insumos) {
                    insumos = typeof req.body.insumos === 'string' ? 
                    JSON.parse(req.body.insumos) : 
                    req.body.insumos;
                }
                
                console.log("Insumos recibidos para actualizar:", insumos);
                
                if (!insumos || insumos.length === 0) {
                    console.log("No hay insumos para actualizar");
                    return;
                }
        const { id } = req.params;
        const { diagnostico, tratamiento, observaciones } = req.body; // <- Añade insumos
        const archivo = req.file ? `/uploads/${req.file.filename}` : null;

        // 1. Actualizar historial médico
        const [result] = await pool.query(
            "UPDATE historial_medico SET diagnostico = IFNULL(?, diagnostico), tratamiento = IFNULL(?, tratamiento), observaciones = IFNULL(?, observaciones), img = IFNULL(?, img) WHERE id = ?",
            [diagnostico, tratamiento, observaciones, archivo, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Historial no encontrado" });
        }

        // 2. Actualizar inventario (si hay insumos)
        if (insumos && insumos.length > 0) {
            await updateInventarioConsultorio(req); // <- Usa el res real
        }

        // 3. Obtener y devolver el historial actualizado
        const [rows] = await pool.query("SELECT * FROM historial_medico WHERE id = ?", [id]);
        res.json(rows[0]);

    } catch (error) {
        return res.status(500).json({ 
            message: "Error al actualizar el historial médico",
            error: error.message  
        });
    }
}

//API de Estadistica
async function getConsultasTotalCount(req, res) {
    try {
        const id_usuario =  req.user.id;
    const [rows] = await pool.query(" SELECT COUNT(*) FROM consultas_medicas INNER JOIN cita ON  consultas_medicas.id_cita = cita.id INNER JOIN medico ON medico.id =  consultas_medicas.id_medico AND medico.id = ?", [id_usuario,]);
    res.json(rows);
    } catch (error) {
        return res.status(500).json({message: "something goes wrong"});
    }
}

async function getConsultasCompletadasCount(req, res) {
    try {
        const id_usuario =  req.user.id;
    const [rows] = await pool.query(" SELECT COUNT(*) FROM consultas_medicas INNER JOIN cita ON  consultas_medicas.id_cita = cita.id INNER JOIN medico ON medico.id =  consultas_medicas.id_medico AND medico.id = ? AND cita.estado = 'completado' " , [id_usuario,]);
    res.json(rows);
    } catch (error) {
        return res.status(500).json({message: "something goes wrong"});
    }
}

async function getConsultasPendientesCount(req, res) {
    try {
        const id_usuario =  req.user.id; 
    const [rows] = await pool.query(" SELECT COUNT(*) FROM consultas_medicas INNER JOIN cita ON  consultas_medicas.id_cita = cita.id INNER JOIN medico ON medico.id =  consultas_medicas.id_medico AND medico.id = ? AND cita.estado = 'pendiente' " , [id_usuario,]);
    res.json(rows);
    } catch (error) {
        return res.status(500).json({message: "something goes wrong"});
    }
}

// Obtener insumos disponibles SOLO en el almacén "Consultorio"
async function getInsumosConsultorio(req, res) {
    console.log("Entrando a getInsumosConsultorio");
    try {
        // 1. Obtener ID de la ubicación "Consultorio"
        const [ubicacion] = await pool.query(
            "SELECT Id_Ubicacion FROM almacenes_ubicaciones WHERE Area = 'Consultorio' LIMIT 1"
        );
        
        if (!ubicacion || ubicacion.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: "Ubicación 'Consultorio' no encontrada en la base de datos" 
            });
        }

        const idConsultorio = ubicacion[0].Id_Ubicacion;

        // 2. Productos en Consultorio (corregido el nombre de la columna)
        const [productos] = await pool.query(`
            SELECT 
                p.Id_Producto, 
                mp.Nombre, 
                pu.Unidades_Por_Ubicacion,
                'producto' AS tipo
            FROM productos p
            JOIN modelos_productos mp ON p.Id_modelo_productos = mp.Id_Producto
            JOIN productos_ubicacion pu ON p.Id_Producto = pu.Id_Producto
            WHERE pu.Id_Ubicacion = ? AND pu.Unidades_Por_Ubicacion > 0
        `, [idConsultorio]);

        // 3. Instrumentos en Consultorio (la tabla está vacía en tu BD)
        const [instrumentos] = await pool.query(`
            SELECT 
                i.Id_Instrumento, 
                i.Nombre, 
                iu.Unidades_Por_Ubicacion,
                'instrumento' AS tipo
            FROM instrumentos i
            JOIN instrumentos_ubicacion iu ON i.Id_Instrumento = iu.Id_Instrumento
            WHERE iu.Id_Ubicacion = ? AND iu.Unidades_Por_Ubicacion > 0
        `, [idConsultorio]);

        console.log(`Productos encontrados en consultorio (${idConsultorio}):`, productos.length);
        console.log(`Instrumentos encontrados en consultorio (${idConsultorio}):`, instrumentos.length);
        
        res.json({ 
            success: true,
            idConsultorio,
            productos, 
            instrumentos 
        });
    } catch (error) {
        console.error("Error en getInsumosConsultorio:", error);
        res.status(500).json({ 
            success: false,
            error: "Error al obtener insumos",
            details: error.message
        });
    }
}
// Actualizar inventario del Consultorio
// Actualizar inventario del Consultorio (versión mejorada)
async function updateInventarioConsultorio(req) {
    try {
        const { insumos } = req.body;
        console.log(req.body.insumos);
        
        if (!insumos || insumos.length === 0) {
            console.log("No hay insumos para actualizar");
            return;
        }

        // Obtener ID del Consultorio
        const [ubicacion] = await pool.query(
            "SELECT Id_Ubicacion FROM almacenes_ubicaciones WHERE Area = 'Consultorio' LIMIT 1"
        );
        
        if (!ubicacion || ubicacion.length === 0) {
            throw new Error("Ubicación 'Consultorio' no encontrada");
        }

        const idConsultorio = ubicacion[0].Id_Ubicacion;
        const connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();

            for (const insumo of insumos) {
                if (insumo.tipo === 'producto') {
                    await connection.query(
                        `UPDATE productos_ubicacion 
                        SET Unidades_Por_Ubicacion = Unidades_Por_Ubicacion - ? 
                        WHERE Id_Producto = ? AND Id_Ubicacion = ?`,
                        [insumo.cantidad, insumo.id, idConsultorio]
                    );
                } else if (insumo.tipo === 'instrumento') {
                    await connection.query(
                        `UPDATE instrumentos_ubicacion 
                        SET Unidades_Por_Ubicacion = Unidades_Por_Ubicacion - ? 
                        WHERE Id_Instrumento = ? AND Id_Ubicacion = ?`,
                        [insumo.cantidad, insumo.id, idConsultorio]
                    );
                }
                
                console.log(`Descontado ${insumo.cantidad} unidades de ${insumo.tipo} ID ${insumo.id}`);
            }

            await connection.commit();
            console.log("Inventario actualizado correctamente");
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Error en updateInventarioConsultorio:", error);
        throw error; // Re-lanzamos el error para que lo maneje la función llamadora
    }
}
// Code upload File
/*async function updateInventarioConsultorioInterno(req) {
    const { insumos } = req.body;
    const [ubicacion] = await pool.query(
        "SELECT Id_Ubicacion FROM almacenes_ubicaciones WHERE Area = 'Consultorio'"
    );
    const idConsultorio = ubicacion[0].Id_Ubicacion;

    for (const insumo of insumos) {
        if (insumo.tipo === 'producto') {
            await pool.query(
                `UPDATE productos_ubicacion 
                SET Unidades_Por_Ubicacion = Unidades_Por_Ubicacion - ? 
                WHERE Id_Producto = ? AND Id_Ubicacion = ?`,
                [insumo.cantidad, insumo.id, idConsultorio]
            );
        } else if (insumo.tipo === 'instrumento') {
            await pool.query(
                `UPDATE instrumentos_ubicacion 
                SET Unidades_Por_Ubicacion = Unidades_Por_Ubicacion - ? 
                WHERE Id_Instrumento = ? AND Id_Ubicacion = ?`,
                [insumo.cantidad, insumo.id, idConsultorio]
            );
        }
    }
}*/

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

export {getConsultas, createHistoria, deleteHistoria, getHistoriaId, updateHistoria, getConsultasCompletada, getConsultasPendiente,searchConsultations, getConsultasTotalCount, getConsultasCompletadasCount, getConsultasPendientesCount, getInsumosConsultorio, updateInventarioConsultorio, upload };