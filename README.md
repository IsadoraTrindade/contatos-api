# Contatos API

API simples para gerenciar contatos com **Node.js**, **Express** e **MySQL**.

---

## 💻 Tecnologias

- Node.js
- Express
- MySQL
- dotenv (para variáveis de ambiente)

---

## 🚀 Instalação

1. Clone o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
cd contatos-api

```

2. Instale as dependências:

```bash
npm install

```

3. Configure o arquivo `.env` na raiz do projeto:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123456
DB_NAME=contatosdb
DB_PORT=3306

```

> Ajuste as variáveis de acordo com o seu banco MySQL.
> 
1. Inicie o servidor:

```bash
node server.js

```

ou, se quiser reinício automático ao salvar:

```bash
nodemon server.js --watch

```

---

## 📦 Rotas

### GET /contatos

- Retorna todos os contatos.
- **Status**: 200

### POST /contatos

- Cria um novo contato.
- Body JSON:

```json
{
  "nome": "Isadora Trindade",
  "telefone": "11912345678"
}

```

- **Status**: 201
- Validações:
    - Nome: mínimo 2 palavras, cada uma com pelo menos 3 letras
    - Telefone: mínimo 9 dígitos

### PATCH /contatos/:id

- Atualiza um contato existente.
- Body JSON: `{ "nome": "...", "telefone": "..." }` (pode enviar um ou ambos)
- **Status**: 200 ou 404 se contato não encontrado

### DELETE /contatos/:id

- Remove um contato pelo ID.
- **Status**: 204 ou 404 se contato não encontrado

---

## ⚠️ Observações

- O banco MySQL precisa estar rodando antes de iniciar a API.
- IDs dos contatos são gerados pelo banco.
- Use Postman ou outro cliente HTTP para testar as rotas.

---

## 👩‍💻 Autor

Isadora Trindade

