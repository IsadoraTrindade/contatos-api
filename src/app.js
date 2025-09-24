import express from "express";
import { router } from "./routes/contatos.routes.js";

export const app = express();
app.use(express.json());
app.use(router);
