# 🚀 Getting Started - SIGQ

Guia passo a passo para rodar o SIGQ localmente.

## 1️⃣ Clone e acesso ao projeto

```bash
cd sigq
```

## 2️⃣ Inicie o PostgreSQL (Docker)

```bash
# Se tiver Docker instalado
docker-compose up -d postgres

# Ou use a imagem diretamente:
docker run -d \
  --name sigq-postgres \
  -e POSTGRES_USER=sigq \
  -e POSTGRES_PASSWORD=sigq-dev-password \
  -e POSTGRES_DB=sigq \
  -p 5432:5432 \
  postgres:16-alpine
```

Você pode verificar se está rodando com:
```bash
docker ps
```

## 3️⃣ Setup Backend

### 3.1 Criar ambiente virtual

```bash
cd backend

# No Windows
python -m venv venv
venv\Scripts\activate

# No macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3.2 Instalar dependências

```bash
pip install -e ".[dev]"
```

### 3.3 Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env` com sua configuração. Para desenvolvimento local, use:

```env
DEBUG=True
DATABASE_URL=postgresql://sigq:sigq-dev-password@localhost:5432/sigq
SECRET_KEY=dev-secret-key-change-in-production
```

### 3.4 Rodar migrations

```bash
alembic upgrade head
```

Você deve ver:
```
INFO [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO [alembic.runtime.migration] Will assume transactional DDL.
...
```

### 3.5 Iniciar servidor

```bash
uvicorn app.main:app --reload
```

✅ Backend rodando em **http://localhost:8000**

Visite a documentação interativa: **http://localhost:8000/docs**

## 4️⃣ Setup Frontend

### 4.1 Instalar Node modules

```bash
cd ../frontend
npm install
```

### 4.2 Configurar variáveis

```bash
cp .env.example .env
```

Por padrão já aponta para `http://localhost:8000`.

### 4.3 Iniciar dev server

```bash
npm run dev
```

✅ Frontend rodando em **http://localhost:5173**

## 5️⃣ Testar a integração

1. Acesse **http://localhost:5173** no navegador
2. Clique em **"Novo Empreendimento"**
3. Preencha o formulário e clique em **"Salvar"**
4. Você deve ver o empreendimento listado abaixo

Se funcionou, você tem a stack completa rodando! 🎉

## 📝 Próximos passos

### Rodar testes do backend

```bash
cd backend
pytest
```

### Criar uma nova migration

```bash
cd backend
alembic revision --autogenerate -m "Descrição da mudança"
```

### Build para Android (Capacitor)

```bash
cd frontend

# Build para produção
npm run build

# Sincronizar com Android
npx cap sync android

# Abrir Android Studio
npx cap open android
```

No Android Studio: **Build** > **Build Bundle(s)/APK(s)** > **Build APK(s)**

## 🐛 Troubleshooting

### "PostgreSQL connection refused"

Certifique-se que o PostgreSQL está rodando:
```bash
docker ps | grep postgres
```

Se não estiver, inicie:
```bash
docker-compose up -d postgres
```

### "Module not found" no backend

Certifique-se que o ambiente virtual está ativado e dependências instaladas:
```bash
cd backend
source venv/bin/activate  # ou venv\Scripts\activate no Windows
pip install -e ".[dev]"
```

### Frontend não conecta na API

Verifique:
1. Backend está rodando: http://localhost:8000/health (deve retornar 200)
2. Variável `VITE_API_BASE_URL` em `frontend/.env` está correta
3. CORS está habilitado (veja `backend/app/core/config.py`)

### "Port already in use"

Mude a porta no comando:
```bash
# Backend em porta 8001
uvicorn app.main:app --reload --port 8001

# Frontend em porta 5174
npm run dev -- --port 5174
```

## 📚 Documentação rápida

- **API Docs:** http://localhost:8000/docs (Swagger UI)
- **README:** [README.md](README.md)
- **CLAUDE.md:** [../CLAUDE.md](../CLAUDE.md)

## ✅ Checklist

- [ ] PostgreSQL rodando em Docker
- [ ] Backend respondendo em http://localhost:8000/health
- [ ] Frontend carregando em http://localhost:5173
- [ ] Consegui criar um empreendimento
- [ ] Consegui listar empreendimentos
- [ ] Consegui deletar um empreendimento

Se tudo passou ✅, seu ambiente está pronto!

## 🤝 Próximas tarefas

1. Explorar API docs em http://localhost:8000/docs
2. Criar modelos adicionais (Bloco, Pavimento, FVS, RNC)
3. Implementar autenticação com Entra ID
4. Integrar com Sienge e Prevision APIs
5. Adicionar upload de fotos com Cloudflare R2
6. Implementar sincronização offline no app Android

---

**Dúvidas?** Veja [CLAUDE.md](../CLAUDE.md) ou entre em contato com a equipe de TI.
