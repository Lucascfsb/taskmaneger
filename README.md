# 📋 Task Management API

API REST para gerenciamento de tarefas, equipes e controle de acessos baseados em permissões (`ADMIN` / `MEMBER`).

🔗 **Link do Deploy Público:** [https://taskmanagement-api-ilvz.onrender.com](https://taskmanagement-api-ilvz.onrender.com)

---

## 💻 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 18 LTS ou superior recomendada)
- **PostgreSQL** (ou um banco relacional compatível)
- **npm** (ou gerenciador de pacotes equivalente)

---

## ⚙️ Instalação e Execução Local

1. **Clonar o repositório:**
   ```bash
   git clone <https://github.com/Lucascfsb/taskmaneger>
   cd taskmaneger
   ```

2. **Instalar as dependências:**
   ```bash
   npm install
   ```

3. **Subir o Banco de Dados com Docker:**
  ```bash
  docker compose up -d
  ```

4. **Configurar as Variáveis de Ambiente:**
   Crie um arquivo `.env` na raiz do projeto:
   ```env
   PORT=3000
   DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/NOME_DO_BANCO?schema=public"
   JWT_SECRET="sua_chave_secreta_jwt_bem_segura"
   ```

5. **Executar as Migrações do Banco (Prisma):**
   ```bash
   npx prisma migrate dev --name init
   ```

6. **Iniciar a aplicação em modo de desenvolvimento:**
   ```bash
   npm run dev
   ```

A API estará acessível em `http://localhost:3000`.

---

## 🧪 Como Rodar os Testes

O projeto utiliza **Vitest** para a execução de testes automatizados.

* **Executar todos os testes:**
  ```bash
  npm run test
  ```

* **Executar testes em modo watch (desenvolvimento contínuo):**
  ```bash
  npm run test:watch
  ```

---

## 📌 Documentação dos Endpoints

A autenticação é realizada via **JWT**. Para acessar rotas protegidas, inclua o cabeçalho:
`Authorization: Bearer <SEU_TOKEN_JWT>`

### 🔑 Autenticação & Sessão

| Método | Endpoint | Requer Auth | Permissão | Descrição |
| --- | --- | --- | --- | --- |
| `POST` | `/sessions` | Não | Pública | Realiza login e retorna o Token JWT |

---

### 👤 Usuários (`/users`)

| Método | Endpoint | Requer Auth | Permissão | Descrição |
| --- | --- | --- | --- | --- |
| `POST` | `/users` | Não | Pública | Cadastra um novo usuário no sistema |
| `GET` | `/users` | Sim | `ADMIN` | Lista todos os usuários cadastrados |
| `GET` | `/users/:id` | Sim | Qualquer | Exibe dados detalhados de um usuário |
| `PUT` | `/users/:id` | Sim | Qualquer | Atualiza dados do usuário |
| `DELETE` | `/users/:id` | Sim | `ADMIN` | Remove um usuário |

---

### 👥 Times (`/teams`)

| Método | Endpoint | Requer Auth | Permissão | Descrição |
| --- | --- | --- | --- | --- |
| `GET` | `/teams` | Sim | `ADMIN` | Lista todos os times |
| `POST` | `/teams` | Sim | `ADMIN` | Cria um novo time |
| `GET` | `/teams/:id` | Sim | Qualquer | Exibe detalhes de um time específico |
| `PUT` | `/teams/:id` | Sim | `ADMIN` | Atualiza informações de um time |
| `DELETE` | `/teams/:id` | Sim | `ADMIN` | Remove um time |
| `GET` | `/teams/:id/members` | Sim | Qualquer | Lista os membros vinculados ao time |
| `POST` | `/teams/:id/members` | Sim | `ADMIN` | Adiciona um membro ao time |
| `DELETE` | `/teams/:id/members/:userId` | Sim | `ADMIN` | Remove um membro do time |

---

### 📝 Tarefas (`/tasks`)

| Método | Endpoint | Requer Auth | Permissão | Descrição |
| --- | --- | --- | --- | --- |
| `GET` | `/tasks` | Sim | Qualquer | Lista tarefas (Filtros via Query: `status`, `priority`, `teamId`) |
| `POST` | `/tasks` | Sim | `ADMIN` | Cria uma nova tarefa |
| `PUT` | `/tasks/:id` | Sim | Qualquer | Atualiza dados ou status de uma tarefa |
| `DELETE` | `/tasks/:id` | Sim | `ADMIN` | Apaga uma tarefa |
| `PATCH` | `/tasks/:id/assign` | Sim | `ADMIN` | Atribui a tarefa a um usuário específico |
| `GET` | `/tasks/:id/history` | Sim | Qualquer | Exibe o histórico de alterações da tarefa |

---
