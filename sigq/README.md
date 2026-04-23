# SIGQ - Sistema de Gestão da Qualidade

Sistema web + mobile Android para digitalizar o controle de qualidade nos canteiros de obra da Halsten Incorporadora.

## 📋 Pré-requisitos

### Backend
- Python 3.11+
- PostgreSQL 16

### Frontend
- Node.js 20+
- npm 10+

### Android (opcional)
- Android Studio
- Android SDK
- Java 17+

## 🚀 Quickstart

### 1. Backend (FastAPI)

```bash
cd sigq/backend

# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate

# Instalar dependências
pip install -e ".[dev]"

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# Rodar migrations
alembic upgrade head

# Iniciar servidor
uvicorn app.main:app --reload
```

API estará disponível em `http://localhost:8000`
Documentação interativa: `http://localhost:8000/docs`

### 2. Frontend (React + Vite)

```bash
cd sigq/frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Iniciar dev server
npm run dev
```

App estará disponível em `http://localhost:5173`

### 3. Android (Capacitor)

```bash
cd sigq/frontend

# Build para produção
npm run build

# Sincronizar com Android
npx cap sync android

# Abrir Android Studio
npx cap open android
```

Depois no Android Studio: **Build** > **Build Bundle(s)/APK(s)** > **Build APK(s)**

## 📁 Estrutura do projeto

```
sigq/
├── backend/              # FastAPI + SQLAlchemy
│   ├── app/
│   │   ├── main.py      # App entry point
│   │   ├── models/      # SQLAlchemy models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── routers/     # Endpoints
│   │   ├── services/    # Business logic
│   │   └── core/        # Config, database
│   ├── migrations/      # Alembic migrations
│   ├── tests/           # Unit tests
│   ├── pyproject.toml   # Dependencies
│   └── Dockerfile
│
├── frontend/            # React + Vite + Capacitor
│   ├── src/
│   │   ├── main.tsx     # Entry point
│   │   ├── App.tsx      # Root component
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable components
│   │   ├── services/    # API calls
│   │   └── index.css    # Tailwind styles
│   ├── index.html
│   ├── capacitor.config.ts
│   ├── vite.config.ts
│   └── package.json
│
└── .github/
    └── workflows/       # CI/CD (GitHub Actions)
```

## 🔑 Variáveis de ambiente

Copie `.env.example` para `.env` em ambos os diretórios (backend e frontend) e configure:

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/sigq
SECRET_KEY=sua-chave-secreta
# ...mais variáveis em .env.example
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000
```

## 🧪 Testes

### Backend
```bash
cd sigq/backend
pytest
pytest --cov  # com coverage
```

### Frontend
```bash
cd sigq/frontend
npm run test
```

## 📱 Sobre Capacitor

O Capacitor empacota o mesmo React em um APK Android sem código nativo. A pasta `android/` é gerada automaticamente por `npx cap sync android`.

**Não editar manualmente `android/`** — sempre usar `npx cap sync` após mudanças no frontend.

## 🛠️ Desenvolvimento

### Code style
- Backend: Black + ruff (linter)
- Frontend: ESLint + Prettier (configurados em CI)

### Database migrations
```bash
cd sigq/backend

# Criar nova migration
alembic revision --autogenerate -m "description"

# Rodar migrations
alembic upgrade head

# Reverter última migration
alembic downgrade -1
```

### Git workflow
1. Feature branches: `feat/nome-da-feature`
2. Commit em português, imperativos: "Adiciona endpoint de RNC"
3. PR obrigatório para `main`
4. CI/CD valida build e testes antes de merge

## 📚 Documentação

- [CLAUDE.md](../CLAUDE.md) — contexto completo do projeto
- [FastAPI docs](https://fastapi.tiangolo.com/)
- [React docs](https://react.dev/)
- [Capacitor docs](https://capacitorjs.com/)

## 🤝 Contato

- **Equipe de TI:** Marcelo Sena, Amanda Costa, Francisco Neto
- **Empresa:** Halsten Incorporadora
