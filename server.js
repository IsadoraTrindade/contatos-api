import express from "express";
import db from "./db.js";

const app = express();
app.use(express.json());

function nomeValido(nome) {
  if (!nome) return false;
  const partes = nome.trim().split(" ");
  if (partes.length < 2) return false;
  return partes.every((p) => p.length >= 3);
}

app.get("/contatos", (req, res) => {
  db.query("SELECT * FROM contatos", (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar contatos" });
    }
    res.json(results);
  });
});

app.post("/contatos", (req, res) => {
  const { nome, telefone } = req.body;
  if (!nomeValido(nome)) {
    return res.status(400).json({
      message:
        "Nome inválido. O nome deve ter ao menos 2 palavras, cada uma com o mínimo de 3 letras.",
    });
  }

  if (!telefone || telefone.length < 9) {
    return res
      .status(400)
      .json({ message: "O telefone deve ter pelo menos 9 números" });
  }

  const sql = "INSERT INTO contatos (nome, telefone) VALUES (?, ?)";
  db.query(sql, [nome, telefone], (err, result) => {
    if (err) return res.status(500).json({ error: "Erro ao salvar contato" });

    const novoContato = { id: result.insertId, nome, telefone };
    res.status(201).json(novoContato);
  });
});

app.patch("/contatos/:id", (req, res) => {
  const { id } = req.params;
  const { nome, telefone } = req.body;

  if (!nome && !telefone) {
    return res
      .status(400)
      .json({ message: "Informe nome ou telefone para atualizar" });
  }

  const campos = [];
  const valores = [];

  if (nome) {
    if (!nomeValido(nome)) {
      return res.status(400).json({ message: "Nome inválido." });
    }
    campos.push("nome = ?");
    valores.push(nome);
  }

  if (telefone) {
    if (telefone.length < 9) {
      return res
        .status(400)
        .json({ message: "O telefone deve ter pelo menos 9 números" });
    }
    campos.push("telefone = ?");
    valores.push(telefone);
  }

  valores.push(id);

  const sql = `UPDATE contatos SET ${campos.join(", ")} WHERE id = ?`;
  db.query(sql, valores, (err, result) => {
    if (err)
      return res.status(500).json({ error: "Erro ao atualizar contato" });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Contato não encontrado" });
    }

    res.status(200).json({ id, nome, telefone });
  });
});

app.delete("/contatos/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM contatos WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Erro ao deletar contato" });
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Contato não encontrado" });

    res.status(204).send();
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
