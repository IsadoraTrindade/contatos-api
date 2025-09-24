# 📘 `README.md` — Documentação do Projeto


## 📌 Visão Geral

API de **Contatos** desenvolvida em **Node.js + Express + MySQL**, com **validação em runtime usando Zod**.
A API permite **criar, listar, atualizar e excluir** contatos.
Validação de nome: **mínimo de duas palavras**, cada uma com **pelo menos 3 letras**.

## 🗂️ Estrutura de Pastas

```
api-contatos/
├─ .env
├─ docker-compose.yml
├─ Dockerfile
├─ package.json
├─ requests.http                 # arquivo para testar a API no VS Code
├─ src/
│  ├─ app.js
│  ├─ server.js
│  ├─ db/
│  │  └─ pool.js
│  ├─ routes/
│  │  └─ contatos.routes.js
│  ├─ controllers/
│  │  └─ contatos.controller.js
│  ├─ validators/
│  │  └─ contato.schema.js
│  ├─ middlewares/
│  │  └─ validate.js
│  └─ utils/
└─ infra/
   └─ mysql/
      ├─ init/
      │  ├─ 01_schema.sql       # esquema inicial (executado uma única vez)
      │  └─ 02_seed.sql         # dados de exemplo (opcional)
      └─ my.cnf                 # configuração mysql (opcional)
```

## 🔧 Requisitos

* **Docker** e **Docker Compose** instalados
* **Node.js 18+** (apenas se quiser rodar a API fora do Docker)
* Opcional: VS Code com extensão **REST Client** (para usar `requests.http`)

## ⚙️ Configuração

Crie um arquivo `.env` na raiz:

```dotenv
# App
PORT=3000
NODE_ENV=development

# MySQL (usado pela API dentro do Docker)
MYSQL_HOST=db
MYSQL_PORT=3306
MYSQL_USER=app_user
MYSQL_PASSWORD=app_password
MYSQL_DB=contatos_db

# MySQL root (apenas para inicialização do container)
MYSQL_ROOT_PASSWORD=root_password
```

> **Importante:** Dentro do Docker, a API acessa o banco pelo host **`db`** (nome do serviço no `docker-compose.yml`).

## ▶️ Como rodar (via Docker Compose)

```bash
# subir containers e construir imagens
docker compose up --build

# (ou via npm scripts, se configurado)
# npm run compose:up
```

* O serviço **db** (MySQL) sobe primeiro, executa os scripts de `infra/mysql/init/*.sql` **uma única vez** (cria base, tabela e seeds).
* Quando o **db** estiver saudável, o serviço **api** inicia.
* API disponível em: **[http://localhost:3000](http://localhost:3000)**

Para derrubar tudo e limpar volume de dados:

```bash
docker compose down -v
# npm run compose:down
```

## 🧪 Testar a API

Abra o arquivo `requests.http` e clique em **Send Request** nas seções desejadas.
Ou use `curl`:

```bash
curl http://localhost:3000/contatos

curl -X POST http://localhost:3000/contatos \
  -H "Content-Type: application/json" \
  -d '{"nome":"Carlos Alberto","telefone":"11911112222"}'
```

## 🧩 Rotas

* **POST** `/contatos`
  Body: `{"nome": "string", "telefone": "string"}`
  Validação:

  * `nome`: **duas palavras+**, cada uma com **≥3 letras** (Unicode, aceita acento)
  * `telefone`: obrigatório (string não vazia)
    Respostas:
  * `201` contato criado
  * `400` erro de validação

* **GET** `/contatos`
  Retorna lista de contatos. `200`

* **PATCH** `/contatos/:id`
  Body opcional: `{"nome": "string", "telefone": "string"}` (ao menos **1 campo**)
  Respostas:

  * `200` contato atualizado
  * `400` id inválido ou body vazio
  * `404` não encontrado

* **DELETE** `/contatos/:id`
  Respostas:

  * `204` deletado
  * `400` id inválido
  * `404` não encontrado

## 🗄️ Acessando o MySQL local

### Linha de comando (dentro do container)

```bash
docker exec -it contatos_mysql mysql -uapp_user -papp_password contatos_db
```

Comandos úteis:

```sql
SHOW TABLES;
DESCRIBE contatos;
SELECT * FROM contatos;
```

### GUI (DBeaver, Beekeeper, TablePlus…)

* Host: `127.0.0.1`
* Port: `3306`
* Database: `contatos_db`
* User: `app_user`
* Password: `app_password`

> Só funciona se a porta `3306:3306` estiver publicada no `docker-compose.yml` (está no exemplo).

## 🧱 Observações de implementação

* **Validação** é feita com **Zod**:

  * `src/validators/contato.schema.js` define os schemas de **criação** e **atualização**.
  * `src/middlewares/validate.js` aplica o schema ao `req.body` e injeta `req.validated`.
* **Conexão MySQL** com `mysql2/promise` (pool):

  * `src/db/pool.js` lê variáveis do `.env` (o compose injeta para o container).
* **SQL inicial**:

  * `infra/mysql/init/01_schema.sql` cria a base e tabela.
  * `infra/mysql/init/02_seed.sql` insere dados exemplo.

## 🐞 Troubleshooting

* **API não sobe / ER\_ACCESS\_DENIED\_ERROR**
  Checar variáveis do `.env` e se o serviço `db` ficou saudável.
  Apagar volume e subir de novo:

  ```bash
  docker compose down -v && docker compose up --build
  ```

* **Rodando API fora do Docker** (para desenvolvimento local sem container):

  * No `.env`, use:

    ```
    MYSQL_HOST=127.0.0.1
    MYSQL_PORT=3306
    ```
  * Suba **apenas** o banco:

    ```bash
    docker compose up db
    ```
  * E rode a API local:

    ```bash
    npm run dev
    ```

* **Charset/acentos estranhos**
  Use `my.cnf` com `utf8mb4` (já incluso em `infra/mysql/my.cnf` no exemplo).

## ✅ Critérios do teste atendidos

* API em **Node.js + Express + MySQL**
* **CRUD** completo de contatos
* **Validações** (nome com 2+ palavras, 3+ letras cada; telefone obrigatório)
* **.env** para credenciais/variáveis
* **Documentação** (este README + `requests.http`)
* Execução local via **Docker Compose**, com **init SQL** autoaplicado
