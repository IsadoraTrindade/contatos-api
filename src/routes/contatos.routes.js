import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { createContatoSchema, patchContatoSchema } from "../validators/contato.schema.js";
import { listContatos, createContato, patchContato, deleteContato } from "../controllers/contatos.controller.js";

export const router = Router();

router.get("/contatos", listContatos);
router.post("/contatos", validate(createContatoSchema), createContato);
router.patch("/contatos/:id", validate(patchContatoSchema), patchContato);
router.delete("/contatos/:id", deleteContato);
