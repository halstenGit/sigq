# Manual de Integração — Infra Admin

Guia para conectar qualquer projeto interno ao painel centralizado de autenticação e gerenciamento.

**Base URL:** `https://admin.halsten.com.br`

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Pré-requisitos](#2-pré-requisitos)
3. [Autenticação de Usuários (Apps com UI)](#3-autenticação-de-usuários-apps-com-ui)
4. [Service Accounts (Backend / Crons / ETL)](#4-service-accounts-backend--crons--etl)
5. [Verificação de Acesso](#5-verificação-de-acesso)
6. [Feature Flags](#6-feature-flags)
7. [Credenciais Sienge](#7-credenciais-sienge)
8. [Referência Rápida de Endpoints](#8-referência-rápida-de-endpoints)
9. [Exemplos Completos](#9-exemplos-completos)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Visão Geral

O **Infra Admin** centraliza:

| Recurso | Descrição |
|---------|-----------|
| **Autenticação** | Login via Azure AD (Entra ID) com OAuth 2.0 |
| **Autorização** | Controle de acesso por app, grupo, projeto e role |
| **Feature Flags** | Toggles por app com targeting (all, user, percentage) |
| **Credenciais Sienge** | Armazenamento criptografado + controle de endpoints |
| **Service Accounts** | API keys para comunicação entre serviços |
| **Auditoria** | Log completo de todas ações administrativas |

Cada app registrado recebe um **slug** único (ex: `fluxo-caixa`, `fluxo-cp`) que serve como identificador em todas as chamadas.

---

## 2. Pré-requisitos

### 2.1 Registrar o app no painel

Antes de integrar, o app precisa ser cadastrado pelo admin no painel (`painel.halsten.com.br`), na seção **Apps**.

Dados necessários:

| Campo | Exemplo | Obrigatório |
|-------|---------|-------------|
| `slug` | `fluxo-caixa` | Sim |
| `name` | `Fluxo de Caixa` | Sim |
| `description` | `Gestão de fluxo de caixa` | Não |
| `base_url` | `https://fluxocaixa.halsten.com.br` | Não |
| `requires_project_scope` | `true` | Não (default: false) |

> **`requires_project_scope`**: se `true`, usuários só acessam se tiverem pelo menos um projeto vinculado. O response de `/auth/check` inclui lista de projetos do usuário.

### 2.2 Conceder acesso aos usuários

No painel, seção **Users**, vincular usuários (ou grupos) ao app com role:

- `viewer` — somente leitura
- `editor` — leitura e escrita
- `admin` — controle total dentro do app

Acessos podem ter data de expiração.

### 2.3 Adicionar domínio ao CORS

Se o app roda em domínio diferente, pedir para adicionar na variável `ALLOWED_ORIGINS` do gateway.

---

## 3. Autenticação de Usuários (Apps com UI)

### 3.1 Fluxo OAuth

1. App redireciona o browser para `ADMIN_URL/auth/login?redirect_uri=APP_URL/callback`
2. Gateway autentica com Azure AD usando callback proprio (`admin.halsten.com.br/auth/callback`)
3. Apos login, gateway redireciona de volta para o `redirect_uri` do app com tokens nos query params

> O app **nunca** interage diretamente com Azure AD. O gateway centraliza toda autenticacao.

### 3.2 Passo a passo

**1. Redirecionar para login:**

```
GET https://admin.halsten.com.br/auth/login?redirect_uri=https://seuapp.halsten.com.br/callback
```

O gateway cuida de toda interacao com Azure AD.

**2. Receber tokens no callback:**

O gateway redireciona o browser de volta para o seu app com tokens nos query params:

```
https://seuapp.halsten.com.br/callback?access_token=eyJ...&id_token=eyJ...&expires_in=3600
```

> Use `id_token` para chamadas ao gateway (`/auth/check`). O `access_token` e para Microsoft Graph e nao e validado pelo gateway.

**3. Armazenar token em memoria (nunca localStorage):**

```typescript
// CORRETO — variável em memória
let token: string | null = null

// ERRADO — nunca fazer isso
// localStorage.setItem('token', token)
```

**4. Usar token em todas as requisições:**

```typescript
headers: {
  'Authorization': `Bearer ${token}`
}
```

### 3.3 Client API (TypeScript)

Copie este client para seu projeto:

```typescript
let _token: string | null = null

export function setToken(token: string | null) {
  _token = token
}

export function getToken(): string | null {
  return _token
}

const ADMIN_URL = import.meta.env.VITE_ADMIN_URL ?? 'https://admin.halsten.com.br'

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (_token) {
    headers['Authorization'] = `Bearer ${_token}`
  }

  const res = await fetch(`${ADMIN_URL}${path}`, { method, headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    let message = `HTTP ${res.status}`
    try {
      const err = (await res.json()) as { detail?: string; message?: string }
      message = err.detail ?? err.message ?? message
    } catch { /* ignore */ }
    throw new Error(message)
  }

  if (res.status === 204) return undefined as unknown as T
  return res.json() as Promise<T>
}

export const adminApi = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
}
```

### 3.4 Client API (Python)

```python
import httpx

ADMIN_URL = "https://admin.halsten.com.br"

class AdminClient:
    def __init__(self, token: str):
        self._client = httpx.AsyncClient(
            base_url=ADMIN_URL,
            headers={"Authorization": f"Bearer {token}"},
        )

    async def check_access(self, app_slug: str) -> dict:
        r = await self._client.get("/auth/check", params={"app_slug": app_slug})
        r.raise_for_status()
        return r.json()

    async def get_me(self) -> dict:
        r = await self._client.get("/auth/me")
        r.raise_for_status()
        return r.json()

    async def check_feature(self, app_slug: str, flag: str) -> bool:
        r = await self._client.get("/features/check",
            params={"app_slug": app_slug, "flag": flag})
        r.raise_for_status()
        return r.json()["enabled"]

    async def get_sienge_credentials(self, app_slug: str) -> list[dict]:
        r = await self._client.get("/sienge/credentials",
            params={"app_slug": app_slug})
        r.raise_for_status()
        return r.json()["credentials"]

    async def close(self):
        await self._client.aclose()
```

---

## 4. Service Accounts (Backend / Crons / ETL)

Para comunicação backend-to-backend sem usuário logado.

### 4.1 Criar service account no painel

Na seção **Service Accounts**, criar com:

| Campo | Exemplo |
|-------|---------|
| `name` | `n8n-sync` |
| `owner_app_slug` | `fluxo-caixa` |
| `allowed_apps` | `["fluxo-caixa", "fluxo-cp"]` (opcional) |

> **A API key aparece uma única vez na criação.** Salve imediatamente. Não é possível recuperar depois.

### 4.2 Usar a API key

```typescript
// Header obrigatório
headers: {
  'X-API-Key': 'sa_abc123...'
}
```

### 4.3 Verificar service account

```
GET /auth/service/check
Header: X-API-Key: sa_abc123...
```

Response:
```json
{
  "service_account": "n8n-sync",
  "allowed_apps": ["uuid-1", "uuid-2"]
}
```

### 4.4 Rate limiting

Cada service account tem `rate_limit` configurável (default: 1000 req/min).

### 4.5 Endpoints acessíveis com API key

Além de `/auth/service/check`, service accounts podem acessar:

| Endpoint | Descrição |
|----------|-----------|
| `GET /sienge/credentials?app_slug=X` | Obter credenciais Sienge |
| `POST /sienge/usage/log` | Logar uso de endpoint |
| `POST /sienge/endpoints/register` | Registrar endpoints |
| `GET /sienge/endpoints?app_slug=X` | Listar endpoints |

---

## 5. Verificação de Acesso

### 5.1 `GET /auth/check?app_slug={slug}`

Endpoint principal. Verifica se o usuário autenticado tem acesso ao app.

**Headers:** `Authorization: Bearer {token}`

**Response (sucesso):**
```json
{
  "allowed": true,
  "role": "editor",
  "user": {
    "id": "uuid",
    "email": "joao@halsten.com.br",
    "name": "João Silva",
    "department": "Engenharia",
    "user_type": "internal",
    "is_admin": false
  },
  "projects": [
    {
      "id": "uuid",
      "slug": "obra-alpha",
      "name": "Obra Alpha",
      "role": "editor"
    }
  ],
  "features": {
    "novo-dashboard": true,
    "export-pdf": false
  }
}
```

> `projects` só vem preenchido se `requires_project_scope = true`.
> `features` traz todas as flags do app já avaliadas para o usuário.

**Response (sem acesso):**
```json
// HTTP 403
{
  "detail": {
    "allowed": false,
    "reason": "no_access"    // ou "expired" ou "no_project_access"
  }
}
```

### 5.2 `GET /auth/me`

Retorna dados do usuário logado + grupos.

```json
{
  "id": "uuid",
  "email": "joao@halsten.com.br",
  "name": "João Silva",
  "department": "Engenharia",
  "user_type": "internal",
  "is_admin": false,
  "groups": ["engenharia", "gestao-obras"]
}
```

### 5.3 Lógica de acesso (ordem de prioridade)

```
1. Usuário é admin global? → acesso total
2. Tem acesso direto (user_app_access)? → usa role direto
3. Pertence a grupo com acesso (group_app_access)? → herda role do grupo
4. Nenhum dos acima? → 403
5. Se app requires_project_scope e user não tem projetos → 403
6. Se acesso tem expires_at e já passou → 403
```

---

## 6. Feature Flags

### 6.1 Consultar flag individual

```
GET /features/check?app_slug={slug}&flag={flag_key}
Header: Authorization: Bearer {token}
```

Response:
```json
{ "enabled": true }
```

### 6.2 Todas as flags via `/auth/check`

O endpoint `/auth/check` já retorna todas as flags do app no campo `features`:

```json
{
  "features": {
    "novo-dashboard": true,
    "modo-escuro": false,
    "beta-export": true
  }
}
```

### 6.3 Tipos de targeting

| Tipo | Comportamento |
|------|--------------|
| `all` | Ativada para todos |
| `user` | Ativada apenas para user IDs específicos |
| `percentage` | Ativada para X% dos usuários (hash consistente) |

### 6.4 Pattern recomendado no frontend

```typescript
// Hook React
function useFeatureFlag(flag: string): boolean {
  const { features } = useAuth() // dados do /auth/check
  return features[flag] ?? false
}

// Uso
function Dashboard() {
  const showNewChart = useFeatureFlag('novo-dashboard')

  return showNewChart ? <NewChart /> : <LegacyChart />
}
```

---

## 7. Credenciais Sienge

Para apps que consomem a API do Sienge.

### 7.1 Obter credenciais

```
GET /sienge/credentials?app_slug={slug}
Header: Authorization: Bearer {token}
```

Response:
```json
{
  "credentials": [
    {
      "id": "uuid",
      "label": "Sienge Produção",
      "base_url": "https://api.sienge.com.br",
      "api_key": "decrypted-key",
      "api_secret": "decrypted-secret",
      "company_id": 123,
      "allowed_endpoints": ["/projects", "/financial/*"]
    }
  ]
}
```

> Credenciais são armazenadas criptografadas (Fernet) e descriptografadas na resposta.

### 7.2 Registrar endpoints que seu app precisa

Ao iniciar seu app, declare quais endpoints do Sienge ele consome:

```
POST /sienge/endpoints/register
Header: Authorization: Bearer {token}
```

Body:
```json
{
  "app_slug": "fluxo-caixa",
  "endpoints": [
    { "method": "GET", "path": "/projects", "description": "Listar obras" },
    { "method": "GET", "path": "/financial/entries", "description": "Lançamentos financeiros" },
    { "method": "POST", "path": "/financial/entries", "description": "Criar lançamento" }
  ]
}
```

Response:
```json
{ "registered": 3, "already_exists": 0 }
```

> Endpoints registrados ficam com status `requested` até um admin aprovar no painel.

### 7.3 Logar uso (auditoria)

```
POST /sienge/usage/log
Header: Authorization: Bearer {token}
```

Body:
```json
{
  "app_slug": "fluxo-caixa",
  "credential_id": "uuid",
  "endpoint_path": "/projects",
  "method": "GET",
  "status_code": 200,
  "response_time_ms": 342
}
```

### 7.4 Pattern recomendado

```python
class SiengeService:
    def __init__(self, admin_client: AdminClient, app_slug: str):
        self.admin = admin_client
        self.app_slug = app_slug
        self._creds = None

    async def _get_creds(self):
        if not self._creds:
            self._creds = await self.admin.get_sienge_credentials(self.app_slug)
        return self._creds[0]  # primeira credencial ativa

    async def get_projects(self):
        creds = await self._get_creds()
        async with httpx.AsyncClient() as client:
            r = await client.get(
                f"{creds['base_url']}/projects",
                auth=(creds['api_key'], creds['api_secret']),
            )
            r.raise_for_status()
            return r.json()
```

---

## 8. Referência Rápida de Endpoints

### Endpoints públicos (usados por apps)

| Método | Path | Auth | Descrição |
|--------|------|------|-----------|
| `GET` | `/health` | — | Health check |
| `GET` | `/auth/login?redirect_uri=` | — | Inicia OAuth |
| `GET` | `/auth/callback?code=&state=` | — | Troca code por tokens |
| `GET` | `/auth/check?app_slug=` | Bearer | Verifica acesso do usuário |
| `GET` | `/auth/me` | Bearer | Dados do usuário logado |
| `GET` | `/auth/service/check` | X-API-Key | Valida service account |
| `GET` | `/features/check?app_slug=&flag=` | Bearer | Consulta feature flag |
| `GET` | `/sienge/credentials?app_slug=` | Bearer ou X-API-Key | Obtém credenciais Sienge |
| `GET` | `/sienge/endpoints?app_slug=` | Bearer ou X-API-Key | Lista endpoints registrados |
| `POST` | `/sienge/endpoints/register` | Bearer ou X-API-Key | Registra endpoints usados |
| `POST` | `/sienge/usage/log` | Bearer ou X-API-Key | Loga uso de endpoint |

### Códigos de erro comuns

| Código | Significado |
|--------|-------------|
| `401` | Token inválido, expirado, ou API key inválida |
| `403` | Sem permissão (`no_access`, `expired`, `no_project_access`) |
| `404` | App slug não encontrado ou inativo |

---

## 9. Exemplos Completos

### 9.1 App React + Vite (TypeScript)

**`.env`:**
```
VITE_ADMIN_URL=https://admin.halsten.com.br
VITE_APP_SLUG=meu-app
```

**`auth.ts`:**
```typescript
import { adminApi, setToken, getToken } from './adminClient'

const APP_SLUG = import.meta.env.VITE_APP_SLUG

// Redireciona para login
export function redirectToLogin() {
  const redirect = encodeURIComponent(window.location.origin + '/callback')
  window.location.href =
    `${import.meta.env.VITE_ADMIN_URL}/auth/login?redirect_uri=${redirect}`
}

// Callback handler — chamar na rota /callback
// Gateway redireciona com tokens nos query params
export function handleCallback(): boolean {
  const params = new URLSearchParams(window.location.search)
  const token = params.get('id_token') || params.get('access_token')
  if (token) {
    setToken(token)
    return true
  }
  return false
}

// Verificar acesso ao app
export async function checkAccess() {
  if (!getToken()) return null
  try {
    return await adminApi.get<AuthCheckResponse>(
      `/auth/check?app_slug=${APP_SLUG}`
    )
  } catch {
    return null
  }
}

interface AuthCheckResponse {
  allowed: boolean
  role: string
  user: {
    id: string
    email: string
    name: string
    department: string | null
    user_type: string
    is_admin: boolean
  }
  projects: Array<{ id: string; slug: string; name: string; role: string }>
  features: Record<string, boolean>
}
```

### 9.2 App FastAPI (Python)

**Middleware de autenticação:**

```python
from fastapi import Depends, HTTPException, Header
import httpx

ADMIN_URL = "https://admin.halsten.com.br"
APP_SLUG = "meu-app"

async def require_access(authorization: str = Header(...)):
    """Dependency — valida token e acesso via infra-admin."""
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f"{ADMIN_URL}/auth/check",
            params={"app_slug": APP_SLUG},
            headers={"Authorization": authorization},
        )

    if r.status_code == 401:
        raise HTTPException(401, "Token inválido ou expirado")
    if r.status_code == 403:
        raise HTTPException(403, "Sem acesso a este aplicativo")
    if r.status_code != 200:
        raise HTTPException(502, "Erro ao validar acesso")

    return r.json()

# Uso nas rotas
@app.get("/dados")
async def listar_dados(auth: dict = Depends(require_access)):
    user = auth["user"]
    role = auth["role"]
    projects = auth["projects"]
    # ... lógica do app
```

### 9.3 Cron / ETL com Service Account (Python)

```python
import httpx

ADMIN_URL = "https://admin.halsten.com.br"
API_KEY = "sa_abc123..."  # de variável de ambiente!

async def run_sync():
    async with httpx.AsyncClient(
        headers={"X-API-Key": API_KEY}
    ) as client:
        # Validar service account
        r = await client.get(f"{ADMIN_URL}/auth/service/check")
        r.raise_for_status()
        print(f"Service: {r.json()['service_account']}")

        # ... executar lógica de sync
```

---

## 10. Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| `401 Invalid authorization header` | Header sem `Bearer ` prefix | Usar `Authorization: Bearer {token}` |
| `401 Invalid or expired token` | Token Azure expirado | Refazer fluxo OAuth |
| `403 no_access` | Usuário sem vínculo ao app | Admin vincular no painel |
| `403 expired` | Acesso expirou | Admin renovar acesso |
| `403 no_project_access` | App requer projeto, user sem nenhum | Admin vincular projeto ao user |
| `404 app_not_found` | Slug errado ou app inativo | Verificar slug no painel |
| `401 Invalid API key` | API key incorreta ou desativada | Verificar key / criar nova |
| CORS bloqueado | Domínio não está em `ALLOWED_ORIGINS` | Adicionar domínio na config |

---

## Checklist de Integração

```
[ ] App registrado no painel com slug definido
[ ] Domínio adicionado ao CORS (se necessário)
[ ] Fluxo de login implementado (OAuth ou Service Account)
[ ] Endpoint /auth/check chamado para validar acesso
[ ] Role do usuário respeitada na UI/API
[ ] Feature flags consultadas (se usar)
[ ] Credenciais Sienge obtidas via API (se usar)
[ ] Endpoints Sienge registrados (se usar)
[ ] Variáveis de ambiente configuradas
[ ] Token armazenado em memória (nunca localStorage)
```
