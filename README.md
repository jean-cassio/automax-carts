# Automax Carts

Automax Carts é uma aplicação full-stack para gerenciamento de carrinhos de compras. Ela consome dados da **Fake Store API**, armazena localmente e permite filtros e consultas através de uma API FastAPI no **backend**, com uma interface React no **frontend**.

---

## Tecnologias

### Backend

- **Python 3.11**
- **FastAPI**: API REST
- **SQLModel**: ORM para SQLite
- **APScheduler**: Agendamento de sincronização automática
- **Docker**: Containerização

### Frontend

- **React 19**
- **Vite**: Build rápido
- **Axios**: Requisições HTTP
- **React Router**: Navegação
- **React Toastify**: Notificações
- **Docker + Nginx**: Servidor frontend

---

## Estrutura do projeto

```

backend/
├─ app/
│  ├─ api/
│  ├─ application/
│  ├─ core/
│  ├─ domain/
│  ├─ infrastructure/
│  ├─ tests/
│  └─ main.py
│  └─ requirements.txt
├─ data/
├─ .env
├─ Dockerfile

frontend/
├─ src/
│  ├─ assets/
│  ├─ components/
│  ├─ contexts/
│  ├─ hooks/
│  ├─ pages/
│  ├─ services/
│  └─ App.jsx
│  └─ main.jsx
├─ .env
├─ Dockerfile
└─ package.json

```

---

## Configuração

### Backend

O arquivo `.env` já está incluso e configurado no repositório, portanto não é necessário criar/copiar nada.

1. Instale dependências:

```bash
cd backend
pip install -r app/requirements.txt
```

2. Rode o servidor localmente:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- A API estará disponível em `http://localhost:8000/carts`.
- Documentação interativa: `http://localhost:8000/docs`

### Frontend

O arquivo .env já está incluso e configurado apontando para o backend, portanto não é necessário criar/copiar nada.

1. Instale dependências e rode localmente:

```bash
cd frontend
npm install
npm run dev
```

- A aplicação estará disponível em `http://localhost:5173` (padrão do Vite).
- **Atenção:** Ao acessar o frontend pela primeira vez, será necessário fazer login com o usuário fictício abaixo:

  - **Email:** `admin@email.com`
  - **Senha:** `*Abc123`

---

## Docker

O projeto possui **Dockerfiles** separados para backend e frontend. É possível rodar ambos usando **docker-compose**.

```bash
docker-compose up --build
```

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:8080`

> O backend utiliza SQLite como banco local e sincroniza dados da **Fake Store API** periodicamente.

---

## Funcionalidades

### Backend

- Endpoints:

  - `GET /carts/` → Lista todos os carrinhos, com filtros opcionais por `user_id` e intervalo de datas (`start_date`, `end_date`).
  - `GET /carts/{id}` → Detalhes de um carrinho específico.
  - `POST /sync/` → Sincroniza os carrinhos com a **Fake Store API**.

- Sincronização automática a cada X horas (configurável via `.env`).

### Frontend

- Lista de carrinhos com filtros por **user ID** e **intervalo de datas**.
- Ordenação por data de criação.
- Tela de detalhes do carrinho mostrando os itens e quantidades.
- Mensagens de erro e loading states.

---

## Observações

- Para o **backend**, o banco SQLite é criado automaticamente na primeira execução.
- O Docker garante que a aplicação rode de forma isolada, tanto backend quanto frontend.
