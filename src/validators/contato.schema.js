import { z } from "zod";

export const createContatoSchema = z.object({
  nome: z.string()
    .trim()
    .refine(val => {
      const partes = val.split(" ").filter(Boolean);
      return (
        partes.length >= 2 && partes.every(p => p.length >= 3)
      );
    }, {
      message: "Informe nome e sobrenome, cada um com pelo menos 3 letras."
    }),
  telefone: z.string()
    .trim()
    .min(9, "Telefone é obrigatório.")
});

export const patchContatoSchema = z.object({
  nome: z.string()
    .trim()
    .refine(val => {
      const partes = val.split(" ").filter(Boolean);
      return (
        partes.length >= 2 && partes.every(p => p.length >= 3)
      );
    }, {
      message: "Informe nome e sobrenome, cada um com pelo menos 3 letras."
    })
    .optional(),
  telefone: z.string()
    .trim()
    .min(9, "Telefone é obrigatório.")
    .optional()
}).refine(data => Object.keys(data).length > 0, {
  message: "Envie ao menos um campo para atualização."
});
