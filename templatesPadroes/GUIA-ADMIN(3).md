# Guia do Administrador — Infra Admin

Referência para configurar o ambiente, conectar apps e gerenciar parâmetros do painel administrativo.

**Painel:** `https://painel.halsten.com.br`
**Gateway API:** `https://admin.halsten.com.br`

---

## Sumário

1. [Arquitetura Geral](#1-arquitetura-geral)
2. [Azure AD (Entra ID) — Configuração](#2-azure-ad-entra-id--configuração)
3. [Variáveis de Ambiente](#3-variáveis-de-ambiente)
4. [Conectar um Novo App](#4-conectar-um-novo-app)
5. [Gestão de Usuários e Acessos](#5-gestão-de-usuários-e-acessos)
6. [Grupos e Acessos em Lote](#6-grupos-e-acessos-em-lote)
7. [Projetos (Obras)](#7-projetos-obras)
8. [Bundles de Apps](#8-bundles-de-apps)
9. [Feature Flags](#9-feature-flags)
10. [Credenciais Sienge](#10-credenciais-sienge)
11. [Service Accounts (API Keys)](#11-service-accounts-api-keys)
12. [CORS — Domínios Permitidos](#12-cors--domínios-permitidos)
13. [Deploy (Railway)](#13-deploy-railway)
14. [Segurança](#14-segurança)
15. [Checklist — Novo App](#15-checklist--novo-app)

---

## 1. Arquitetura Geral

**Fluxo de autenticacao:**

> App → Admin Gateway → Azure AD → Gateway callback → App (com tokens)

O gateway centraliza toda interacao com Azure AD. Apps nunca falam diretamente com o Azure — apenas redirecionam para o gateway, que devolve tokens via redirect.

**Componentes:**

| Serviço | Stack | URL | Função |
|---------|-------|-----|--------|
| admin-gateway | FastAPI + PostgreSQL | admin.halsten.com.br | API central de auth, acesso, config |
| admin-painel | React + Vite + Nginx | painel.halsten.com.br | Interface do admin |
| PostgreSQL | Railway native | interno | Banco de dados |
| Azure AD | Microsoft Entra ID | login.microsoftonline.com | Provedor de identidade |

---

## 2. Azure AD (Entra ID) — Configuração

### 2.1 Onde encontrar os parâmetros

Acesse o [Portal Azure](https://portal.azure.com) > **Azure Active Directory** > **App Registrations**.

| Parâmetro | Onde encontrar | Variável de ambiente |
|-----------|---------------|---------------------|
| **Tenant ID** (Directory ID) | Overview do tenant | `AZURE_TENANT_ID` |
| **Client ID** (Application ID) | Overview do App Registration | `AZURE_CLIENT_ID` |
| **Client Secret** | Certificates & Secrets > New client secret | `AZURE_CLIENT_SECRET` |

### 2.2 App Registration — Config obrigatória

**Redirect URIs (Authentication):**
```
https://admin.halsten.com.br/auth/callback
```

**Token Configuration — Claims opcionais (ID Token):**
- `email`
- `preferred_username`

**API Permissions:**
- `openid` (delegated)
- `profile` (delegated)
- `email` (delegated)

**Para listar usuários do Azure (opcional):**
- `User.Read.All` (application)
- Requer **Admin Consent**
- Usar `GRAPH_CLIENT_ID` e `GRAPH_CLIENT_SECRET` separados (ou os mesmos, se preferir)

### 2.3 Rotação de Client Secret

O Client Secret expira. Quando expirar:

1. Portal Azure > App Registration > Certificates & Secrets
2. Criar novo secret
3. Atualizar `AZURE_CLIENT_SECRET` no Railway
4. Redeploy do admin-gateway

> **Não deletar o secret antigo até confirmar que o novo funciona.**

---

## 3. Variáveis de Ambiente

### 3.1 admin-gateway (Backend)

| Variável | Obrigatório | Exemplo | Descrição |
|----------|-------------|---------|-----------|
| `DATABASE_URL` | Sim | `postgresql://user:pass@host:5432/infra_admin` | Conexão PostgreSQL |
| `AZURE_TENANT_ID` | Sim | `cd3b24d8-...` | Directory ID do Azure AD |
| `AZURE_CLIENT_ID` | Sim | `eee78f30-...` | Application ID do App Registration |
| `AZURE_CLIENT_SECRET` | Sim | `9E48Q~...` | Client Secret do Azure AD |
| `AZURE_REDIRECT_URI` | Sim | `https://admin.halsten.com.br/auth/callback` | URI de callback OAuth |
| `JWT_SECRET` | Sim | `8a5f8279...` (64 hex chars) | Chave para assinar tokens internos |
| `ENCRYPTION_KEY` | Sim | `J49lL3jo...` (base64) | Chave Fernet para criptografar segredos (Sienge) |
| `ENVIRONMENT` | Não | `production` | Ambiente (`development` / `production`) |
| `ALLOWED_ORIGINS` | Não | `https://admin.halsten.com.br,https://painel.halsten.com.br` | Domínios CORS separados por vírgula |
| `PORT` | Não | `8000` | Porta do servidor |
| `PANEL_URL` | Não | `https://painel.halsten.com.br` | URL do painel (para redirecionamentos) |
| `GRAPH_CLIENT_ID` | Não | `eee78f30-...` | Client ID para Microsoft Graph API |
| `GRAPH_CLIENT_SECRET` | Não | `...` | Client Secret para Microsoft Graph API |

**Gerar JWT_SECRET:**
```bash
openssl rand -hex 32
```

**Gerar ENCRYPTION_KEY:**
```python
from cryptography.fernet import Fernet
print(Fernet.generate_key().decode())
```

### 3.2 admin-painel (Frontend)

| Variável | Obrigatório | Exemplo | Descrição |
|----------|-------------|---------|-----------|
| `VITE_API_URL` | Sim | `https://admin.halsten.com.br` | URL do gateway API |

> Variáveis `VITE_*` são injetadas no build. Qualquer alteração requer **rebuild e redeploy**.

---

## 4. Conectar um Novo App

### 4.1 Registrar no painel

**Painel > Apps > Novo App**

| Campo | Exemplo | Obrigatório | Notas |
|-------|---------|-------------|-------|
| Slug | `fluxo-caixa` | Sim | Identificador único, lowercase, sem espaços |
| Nome | `Fluxo de Caixa` | Sim | Nome de exibição |
| Descrição | `Gestão de fluxo de caixa` | Não | — |
| URL Base | `https://fluxocaixa.halsten.com.br` | Não | URL do app (para links no hub) |
| Requer Projeto | `true` / `false` | Não | Se `true`, usuário precisa ter projeto vinculado |

> O **slug** é o identificador usado em todas as chamadas de API (`/auth/check?app_slug=fluxo-caixa`).

### 4.2 Configurar o app para autenticar

O app precisa implementar o fluxo OAuth com o gateway. Dois caminhos:

**Apps com interface (frontend):**
```
1. Redirecionar para: GET /auth/login?redirect_uri=https://seuapp.com/callback
2. Gateway autentica com Azure AD internamente (usa callback proprio)
3. Gateway redireciona de volta para redirect_uri com access_token, id_token e expires_in como query params
4. App armazena token em memoria e usa em requisicoes
```

> Use `id_token` para chamadas ao gateway. O `access_token` e para Microsoft Graph.

**Apps sem interface (backend/cron/ETL):**
```
1. Criar Service Account no painel (ver seção 11)
2. Usar API key no header X-API-Key em todas requisições
```

### 4.3 Variáveis que o app precisa

```env
# Frontend (React/Vite)
VITE_ADMIN_URL=https://admin.halsten.com.br
VITE_APP_SLUG=fluxo-caixa

# Backend (Python/Node)
ADMIN_URL=https://admin.halsten.com.br
APP_SLUG=fluxo-caixa
ADMIN_API_KEY=sa_your-service-account-key
```

### 4.4 Validar acesso no app

Cada requisição do app deve validar o token do usuário chamando:

```
GET /auth/check?app_slug={slug}
Authorization: Bearer {token}
```

Response inclui: `allowed`, `role`, `user`, `projects`, `features`.

> Detalhes completos de integração no código: ver `docs/INTEGRACAO.md`.

---

## 5. Gestão de Usuários e Acessos

### 5.1 Como usuários entram no sistema

1. **Automático via login:** Ao fazer login com Azure AD pela primeira vez, o usuário é criado automaticamente como `internal`
2. **Manual pelo admin:** Painel > Users > Criar Usuário (tipo `external` para parceiros)
3. **Importar do Azure AD:** Painel > Users > buscar e importar diretamente do diretório

### 5.2 Tipos de usuário

| Tipo | Descrição | Login |
|------|-----------|-------|
| `internal` | Colaborador com conta Microsoft | Azure AD (automático) |
| `external` | Parceiro/consultor sem conta MS | Precisa ser vinculado manualmente |

### 5.3 Conceder acesso a um app

**Painel > Users > [Usuário] > Acessos**

| Campo | Opções | Descrição |
|-------|--------|-----------|
| App | (lista de apps cadastrados) | App ao qual conceder acesso |
| Role | `viewer`, `editor`, `admin` | Nível de permissão |
| Expira em | data (opcional) | Acesso temporário |

**Hierarquia de roles:**
- `viewer` — somente leitura
- `editor` — leitura e escrita
- `admin` — controle total dentro do app

### 5.4 Flag de administrador global

**Painel > Users > [Usuário] > Editar > Is Admin**

Admins globais têm:
- Acesso total a todos os apps (bypass de verificação)
- Acesso ao painel administrativo
- Permissão para gerenciar outros usuários

---

## 6. Grupos e Acessos em Lote

### 6.1 Criar grupo

**Painel > Groups > Novo Grupo**

| Campo | Exemplo | Descrição |
|-------|---------|-----------|
| Slug | `engenharia` | Identificador único |
| Nome | `Engenharia` | Nome de exibição |
| Azure Group ID | `abc-123...` | (opcional) Vincular a grupo do Azure AD |

### 6.2 Vincular acesso por grupo

Em vez de dar acesso individualmente a 20 usuários, criar um grupo e dar acesso ao grupo:

1. **Painel > Groups > [Grupo] > Membros** — adicionar usuários
2. **Painel > Groups > [Grupo] > Acessos** — vincular apps com role

> Acesso por grupo é **herdado**: todos os membros ganham o acesso automaticamente.

### 6.3 Prioridade de acesso

```
Acesso direto do usuário > Acesso via grupo
```

Se o usuário tem acesso direto com role `viewer` e o grupo tem `editor`, prevalece o acesso direto.

---

## 7. Projetos (Obras)

### 7.1 Quando usar projetos

Projetos são necessários quando um app tem `requires_project_scope = true`. Isso significa que o usuário precisa ter pelo menos um projeto vinculado para acessar o app.

### 7.2 Cadastrar projeto

**Painel > Projects > Novo Projeto**

| Campo | Exemplo | Descrição |
|-------|---------|-----------|
| Slug | `obra-alpha` | Identificador único |
| Nome | `Residencial Alpha` | Nome da obra |
| Sienge Project ID | `12345` | (opcional) Vínculo com projeto no Sienge |
| Cidade | `São Paulo` | — |
| Estado | `SP` | — |
| Status | `active` | `active`, `completed`, `cancelled` |

### 7.3 Vincular usuário a projeto

**Painel > Users > [Usuário] > Projetos**

| Campo | Opções | Descrição |
|-------|--------|-----------|
| Projeto | (lista de projetos) | Projeto a vincular |
| Role | `viewer`, `editor`, `admin` | Nível de permissão no projeto |

> O endpoint `/auth/check` retorna a lista de projetos do usuário quando `requires_project_scope = true`.

---

## 8. Bundles de Apps

Bundles agrupam apps em pacotes para facilitar a concessão de acesso.

### 8.1 Criar bundle

**Painel > Bundles > Novo Bundle**

| Campo | Exemplo |
|-------|---------|
| Slug | `pack-financeiro` |
| Nome | `Pack Financeiro` |

### 8.2 Adicionar apps ao bundle

Selecionar apps que fazem parte do pacote (ex: Fluxo Caixa + Fluxo CP + Budget).

> Bundles são uma conveniência administrativa. O acesso efetivo ainda é por app individual.

---

## 9. Feature Flags

### 9.1 Criar flag

**Painel > Features > Nova Flag**

| Campo | Exemplo | Descrição |
|-------|---------|-----------|
| App | Fluxo de Caixa | App vinculado |
| Flag Key | `novo-dashboard` | Identificador no código |
| Ativada | sim/não | Estado global |
| Tipo de Targeting | `all`, `user`, `percentage` | Quem recebe a flag |

### 9.2 Tipos de targeting

| Tipo | Comportamento | Configuração |
|------|--------------|--------------|
| `all` | Todos os usuários do app | Apenas on/off |
| `user` | Usuários específicos | Lista de user IDs |
| `percentage` | X% dos usuários | Percentual (hash consistente) |
| `group` | Membros de grupos específicos | Lista de group IDs |

### 9.3 Como apps consomem

Flags são retornadas automaticamente no `/auth/check`:

```json
{
  "features": {
    "novo-dashboard": true,
    "export-pdf": false
  }
}
```

Ou consulta individual: `GET /features/check?app_slug=X&flag=novo-dashboard`

---

## 10. Credenciais Sienge

### 10.1 Cadastrar credencial

**Painel > Sienge > Credentials > Nova Credencial**

| Campo | Exemplo | Descrição |
|-------|---------|-----------|
| Label | `Sienge Produção` | Identificador legível |
| Base URL | `https://api.sienge.com.br` | URL base da API Sienge |
| API Key | `abc-123...` | Chave de acesso |
| API Secret | `xyz-789...` | Segredo de acesso |
| Company ID | `456` | ID da empresa no Sienge |

> Credenciais são **criptografadas** (Fernet) no banco. Apenas apps autorizados recebem as credenciais descriptografadas.

### 10.2 Vincular credencial a apps

Definir quais apps podem usar a credencial e quais endpoints cada app pode acessar.

### 10.3 Aprovação de endpoints

1. App registra endpoints que precisa: `POST /sienge/endpoints/register`
2. Admin revisa em **Painel > Sienge > Endpoints**
3. Admin aprova ou rejeita cada endpoint

### 10.4 Monitoramento de uso

**Painel > Sienge > Usage** mostra:
- Chamadas por app/endpoint
- Status codes
- Tempo de resposta médio

---

## 11. Service Accounts (API Keys)

### 11.1 Quando usar

- Comunicação backend-to-backend
- Crons e ETL
- n8n, Zapier, Power Automate
- Qualquer serviço sem usuário logado

### 11.2 Criar service account

**Painel > Service Accounts > Nova**

| Campo | Exemplo | Descrição |
|-------|---------|-----------|
| Nome | `n8n-sync` | Identificador do serviço |
| App Owner | `fluxo-caixa` | App ao qual pertence |
| Apps Permitidos | `fluxo-caixa, fluxo-cp` | (opcional) Limitar a apps específicos |

> **A API key (`sa_...`) aparece UMA ÚNICA VEZ na criação. Copie e salve imediatamente.**
> Não é possível recuperar a key depois. Se perder, deletar e criar nova.

### 11.3 Usar a API key

```
Header: X-API-Key: sa_abc123...
```

Rate limit padrão: 1000 req/min (configurável por service account).

> **Endpoints acessíveis com X-API-Key:** além de `/auth/service/check`, service accounts podem acessar `/sienge/credentials`, `/sienge/usage/log`, `/sienge/endpoints/register` e `/sienge/endpoints`. Isso permite que backends e crons busquem credenciais Sienge e loguem uso sem usuario logado.

---

## 12. CORS — Domínios Permitidos

Cada app frontend que faz chamadas diretas ao gateway precisa ter seu domínio na lista CORS.

### 12.1 Domínios atuais

Variável `ALLOWED_ORIGINS` (vírgula-separado):
```
https://admin.halsten.com.br
https://painel.halsten.com.br
```

### 12.2 Adicionar novo domínio

1. Acessar Railway > admin-gateway > Variables
2. Adicionar domínio em `ALLOWED_ORIGINS`:
   ```
   https://admin.halsten.com.br,https://painel.halsten.com.br,https://novoapp.halsten.com.br
   ```
3. Redeploy automático após salvar

### 12.3 Desenvolvimento local

Para dev local, adicionar `http://localhost:5173` (ou porta do Vite):
```
ALLOWED_ORIGINS=https://admin.halsten.com.br,https://painel.halsten.com.br,http://localhost:5173
```

---

## 13. Deploy (Railway)

### 13.1 Estrutura do projeto no Railway

| Serviço | Builder | Porta | Health Check |
|---------|---------|-------|-------------|
| admin-gateway | Dockerfile | 8000 | `GET /health` |
| admin-painel | Dockerfile (multi-stage) | 8080 | — |
| PostgreSQL | Railway native | 5432 | automático |

### 13.2 Domínios customizados

No Railway, em cada serviço > Settings > Domains:
- admin-gateway: `admin.halsten.com.br`
- admin-painel: `painel.halsten.com.br`

DNS: apontar CNAME para o domínio Railway fornecido.

### 13.3 Banco de dados

- `DATABASE_URL` é gerado automaticamente pelo Railway ao adicionar PostgreSQL
- Formato: `postgresql://user:pass@host:5432/infra_admin`
- Internamente convertido para `postgresql+asyncpg://...` (driver async)

### 13.4 Atualizar variáveis

```bash
# Railway CLI
railway login
railway link          # selecionar projeto
railway service       # selecionar serviço (gateway ou painel)
railway variables set VARIAVEL="valor"
```

Ou pelo dashboard Railway: serviço > Variables > editar.

### 13.5 Redeploy

Qualquer push na branch principal ou alteração de variável dispara redeploy automático.

Para redeploy manual:
```bash
railway up
```

---

## 14. Segurança

### 14.1 Práticas aplicadas

| Aspecto | Implementação |
|---------|--------------|
| **Tokens** | Armazenados em memória (nunca localStorage/sessionStorage) |
| **Senhas** | Não existem — autenticação exclusiva via Azure AD |
| **Segredos Sienge** | Criptografados com Fernet (AES-128-CBC) no banco |
| **API Keys** | Hash SHA-256 no banco (irreversível) |
| **CORS** | Restrito a domínios explícitos |
| **Rate Limiting** | Ativo via slowapi no gateway |
| **Auditoria** | Toda ação admin logada com actor, ação, alvo e timestamp |
| **JWKS** | Validação de assinatura dos tokens Azure com cache de 1h |

### 14.2 O que NUNCA fazer

- Colocar tokens em `localStorage` ou `sessionStorage`
- Expor `AZURE_CLIENT_SECRET`, `JWT_SECRET` ou `ENCRYPTION_KEY` no frontend
- Commitar `.env` ou `setup-railway.sh` no git
- Desativar CORS em produção
- Dar `is_admin = true` sem necessidade

### 14.3 Rotação de segredos

| Segredo | Quando trocar | Impacto |
|---------|--------------|---------|
| `AZURE_CLIENT_SECRET` | Antes de expirar (Azure mostra data) | Logins param até atualizar |
| `JWT_SECRET` | Se comprometido | Todos tokens ativos invalidados |
| `ENCRYPTION_KEY` | Se comprometido | Credenciais Sienge ficam ilegíveis — recriar todas |

---

## 15. Checklist — Novo App

```
Etapa                                         Status
─────────────────────────────────────────────────────
1. App registrado no painel (slug definido)    [ ]
2. Usuários/grupos com acesso vinculado        [ ]
3. Domínio adicionado ao CORS                  [ ]
4. Fluxo de login implementado no app          [ ]
   - OAuth (frontend) ou Service Account       [ ]
5. /auth/check chamado para validar acesso     [ ]
6. Roles respeitadas na UI/API do app          [ ]
7. Feature flags configuradas (se usar)        [ ]
8. Credenciais Sienge cadastradas (se usar)    [ ]
   - Endpoints registrados e aprovados         [ ]
9. Variáveis de ambiente configuradas          [ ]
   - VITE_ADMIN_URL / ADMIN_URL                [ ]
   - VITE_APP_SLUG / APP_SLUG                  [ ]
10. Token em memória (nunca localStorage)      [ ]
11. Testado em ambiente dev                    [ ]
12. Deploy em produção                         [ ]
```

---

## Referências

- [Manual de Integração (código)](INTEGRACAO.md) — exemplos de código, endpoints, troubleshooting
- [Blueprint Técnico](../infra-admin-blueprint.md) — arquitetura, SQL migrations, decisões técnicas
- [Portal Azure](https://portal.azure.com) — gerenciar App Registration, secrets, permissions
- [Railway Dashboard](https://railway.app) — deploy, variáveis, logs
