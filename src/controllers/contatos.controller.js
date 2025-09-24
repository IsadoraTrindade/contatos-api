import { pool } from "../db/pool.js";

export const listContatos = async (_req, res) => {
  const [rows] = await pool.query("SELECT id, nome, telefone FROM contatos ORDER BY id DESC");
  return res.status(200).json(rows);
};

export const createContato = async (req, res) => {
  const { nome, telefone } = req.validated;
  const [result] = await pool.query(
    "INSERT INTO contatos (nome, telefone) VALUES (?, ?)",
    [nome, telefone]
  );
  const [rows] = await pool.query("SELECT id, nome, telefone FROM contatos WHERE id = ?", [result.insertId]);
  return res.status(201).json(rows[0]);
};

export const patchContato = async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "id inválido" });

  const [rows] = await pool.query("SELECT id, nome, telefone FROM contatos WHERE id = ?", [id]);
  if (rows.length === 0) return res.status(404).json({ message: "Contato não encontrado" });

  const current = rows[0];
  const novo = { ...current, ...(req.validated || {}) };

  await pool.query("UPDATE contatos SET nome = ?, telefone = ? WHERE id = ?", [novo.nome, novo.telefone, id]);
  return res.status(200).json(novo);
};

export const deleteContato = async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "id inválido" });

  const [rows] = await pool.query("SELECT id FROM contatos WHERE id = ?", [id]);
  if (rows.length === 0) return res.status(404).json({ message: "Contato não encontrado" });

  await pool.query("DELETE FROM contatos WHERE id = ?", [id]);
  return res.status(204).send();
};
