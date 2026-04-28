# Deployment no Railway

Guia de deployment do SIGQ no Railway.

## Pré-requisitos

1. Conta no Railway (https://railway.app)
2. Git instalado e repositório configurado
3. CLI do Railway instalado (opcional)

## Opção 1: Deployment via GitHub (Recomendado)

### Passo 1: Preparar repositório no GitHub

```bash
git init
git add .
git commit -m "Initial commit: SIGQ application ready for Railway"
git branch -M main
git remote add origin https://github.com/seu-usuario/sigq.git
git push -u origin main
```

### Passo 2: Conectar no Railway

1. Acesse https://railway.app
2. Clique em "New Project"
3. Selecione "Deploy from GitHub"
4. Conecte sua conta GitHub e selecione o repositório `sigq`
5. Railway vai detectar automaticamente a estrutura

### Passo 3: Configurar variáveis de ambiente

No dashboard do Railway, configure:

```
DATABASE_URL: postgresql://... (gerado automaticamente pelo plugin PostgreSQL)
DEBUG: True
PYTHONUNBUFFERED: 1
VITE_API_URL: https://api-seu-projeto.railway.app
```

## Opção 2: Deployment via Railway CLI

### Passo 1: Instalar Railway CLI

```bash
npm i -g @railway/cli
```

### Passo 2: Login e deploy

```bash
railway login
railway link  # Seleciona projeto
railway up
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
