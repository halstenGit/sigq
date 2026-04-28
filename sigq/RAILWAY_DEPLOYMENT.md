# Deployment no Railway - SIGQ

Guia completo de deployment do SIGQ no Railway (monorepo com Frontend + Backend).

## Pré-requisitos

1. Conta no Railway (https://railway.app)
2. Repositório GitHub conectado (halstenGit/sigq)
3. CLI do Railway (opcional)

## Deployment no Railway (Passo a Passo)

### Passo 1: Acessar Railway Dashboard

1. Acesse https://railway.app
2. Clique em "New Project"
3. Selecione "Deploy from GitHub repo"
4. Procure por `halstenGit/sigq` e clique para conectar

### Passo 2: Detectar e Configurar Serviços

Railway vai detectar um monorepo. Para cada serviço:

#### Backend (FastAPI)
1. Clique em "Add Service"
2. Selecione "GitHub repo"
3. Escolha o commit
4. Configure:
   - **Builder**: Docker
   - **Dockerfile path**: `backend/Dockerfile`
   - **Build context**: `backend`
   - **Port**: 8000

#### Frontend (React/Vite)
1. Clique em "Add Service"
2. Selecione "GitHub repo"
3. Escolha o commit
4. Configure:
   - **Builder**: Docker
   - **Dockerfile path**: `frontend/Dockerfile`
   - **Build context**: `frontend`
   - **Port**: 3000

#### Database (PostgreSQL)
1. Clique em "Add Service"
2. Selecione "PostgreSQL"
3. Deixar configurações padrão

### Passo 3: Configurar Variáveis de Ambiente

No Backend, adicione:
```
DATABASE_URL = ${{Postgres.DATABASE_URL}}
PYTHONUNBUFFERED = 1
DEBUG = False
```

No Frontend, adicione:
```
VITE_API_URL = https://your-backend-service.railway.app
```

### Passo 4: Conectar Serviços

1. No Frontend, clique em "Connect"
2. Procure pelo serviço Backend
3. Adicione como variável de ambiente: `VITE_API_URL`

1. No Backend, clique em "Connect"
2. Procure pelo serviço PostgreSQL
3. Selecione para usar sua DATABASE_URL

### Passo 5: Deploy

1. Cada serviço vai fazer deploy automaticamente
2. Acompanhe o progresso na aba "Deployments"
3. Verifique os logs na aba "Logs"

## Solução de Problemas

### Erro: "File does not exist: /app/config/heft.json"

**Causa**: Railway está tentando fazer build da raiz do repositório (onde há SharePoint Framework).

**Solução**: 
- Especificar `rootDirectory` ou `Build context` como `backend` ou `frontend` para cada serviço
- Não deixar Railway detectar automaticamente a raiz

### Erro: "Cannot find module"

**Solução no Backend**:
```bash
# Verificar se requirements.txt ou pyproject.toml estão em backend/
cd backend
pip install -r requirements.txt  # ou -e .
```

**Solução no Frontend**:
```bash
# Verificar se package.json está em frontend/
cd frontend
npm ci
npm run build
```

## Deployment via Railway CLI (Alternativa)

```bash
# Install
npm i -g @railway/cli

# Login
railway login

# Link ao projeto
railway link

# Deploy específico
railway up --service backend
railway up --service frontend
railway up --service postgres
```

## Estrutura do Projeto para Railway

```
sigq/
├── backend/
│   ├── Dockerfile
│   ├── pyproject.toml
│   ├── app/
│   └── ...
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   └── ...
├── docker-compose.yml
├── railway.json          # Configuração multi-service
├── .env.example
└── RAILWAY_DEPLOYMENT.md
```

## Configuração Automática do Railway

O `railway.json` configura:

1. **PostgreSQL**: Banco de dados para persistência
2. **Backend**: FastAPI rodando na porta 8000
3. **Frontend**: React/Vite rodando na porta 3000

## Domínios e URLs

Após deploy, você terá:

- **Frontend**: `https://sigq-frontend.railway.app`
- **Backend API**: `https://sigq-backend.railway.app`
- **Database**: PostgreSQL gerenciado pelo Railway

## Variáveis de Ambiente Automáticas

O Railway fornece automaticamente:

- `DATABASE_URL`: URL do PostgreSQL
- `RAILWAY_DOMAIN`: Seu domínio no Railway
- `PORT`: Porta atribuída (se necessário)

## Logs e Monitoramento

No dashboard:

1. Clique na pasta do serviço
2. Abra a aba "Logs" para ver output
3. Use "Metrics" para monitorar CPU, memória e rede

## Troubleshooting

### Build falha no frontend

```bash
# Garantir que npm ci é executado (não npm install)
# Isso está configurado no Dockerfile
```

### Erro de conexão com banco

1. Verifique se DATABASE_URL está correto
2. Confirme que o PostgreSQL está rodando
3. Verifique logs do backend para detalhes

### Porta incorreta

Railway assigina portas dinamicamente. Use:
- Frontend: `serve -s dist -l 3000`
- Backend: `uvicorn app.main:app --host 0.0.0.0 --port 8000`

## Próximos Passos

1. ✓ Código está pronto para Railway
2. Push para GitHub
3. Conecte no Railway dashboard
4. Configure variáveis de ambiente
5. Deploy automático a cada push

## Documentação Oficial

- Railway Docs: https://docs.railway.app
- Railway GitHub Integration: https://docs.railway.app/reference/railroad#github-integration
- Python Deployments: https://docs.railway.app/guides/deployments#python

## Suporte

Para dúvidas sobre Railway:
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
