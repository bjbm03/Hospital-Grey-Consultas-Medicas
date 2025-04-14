import { Router } from "express";
import { getHitorias, getHistoriaId, deleteHistoria, createHistoria, updateHistoria, upload  } from "../controller/historialController.js";
const router = Router();

router.get("/historias", getHitorias);

router.get("/historia/:id", getHistoriaId);

router.delete("/historia/:id/:id_cita", deleteHistoria);

router.post("/historia", upload.single('archivo'), createHistoria);

router.patch("/historia/:id", upload.single('archivo'), updateHistoria);

export {router};