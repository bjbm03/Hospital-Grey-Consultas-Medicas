import { Router } from "express";
import { getConsultas, createHistoria, deleteHistoria, getHistoriaId, updateHistoria, getConsultasCompletada, getConsultasPendiente,searchConsultations, getConsultasTotalCount, getConsultasCompletadasCount, getConsultasPendientesCount, upload  } from "../controller/consultasController.js";
const router = Router();

router.get("/consultas", getConsultas);

router.get("/consultas_completada", getConsultasCompletada);

router.get("/consultas_pendiente", getConsultasPendiente);

router.get("/consultas/search", searchConsultations);

router.post("/historia", upload.single('archivo'),  createHistoria);

router.patch("/historia/:id", upload.single('archivo'), updateHistoria);

router.delete("/historia/:id/:id_cita", deleteHistoria);

router.get("/historia/:id", getHistoriaId);

//API de estadistica

router.get("/consultas_total_stast", getConsultasTotalCount);

router.get("/consultas_completadas_stast", getConsultasCompletadasCount);

router.get("/consultas_pendientes_stast", getConsultasPendientesCount);

export {router};