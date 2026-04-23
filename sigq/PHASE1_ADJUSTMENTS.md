# 🔧 Ajustes Necessários - Fase 1

Análise dos problemas encontrados durante a implementação e recomendações de correção.

---

## 🚨 Problemas Críticos (Impedem Fase 2)

### 1. **Conflito de Versões Capacitor** (CRÍTICO)
**Problema:**
```
@capacitor/core@6.2.1 vs @capacitor/android@8.3.1 (incompatível)
Warning: versions don't match
```

**Impacto:** APK pode não funcionar corretamente, plugins podem falhar

**Solução Recomendada:**
Atualizar para versões compatíveis (manter coerência na versão 6):

```bash
npm install @capacitor/core@^6.0.0
npm install @capacitor/android@^6.0.0 --save-dev --legacy-peer-deps
# Remover versão 8 incompatível
npm uninstall @capacitor/android
```

**Arquivo a atualizar:** `sigq/frontend/package.json`

---

### 2. **Hook useOfflineStorage Referencia Pacote Inexistente** (CRÍTICO)
**Arquivo:** `sigq/frontend/src/hooks/useOfflineStorage.ts`

**Problema:**
```typescript
import { SQLiteDBConnection, CapacitorSQLite } from '@capacitor-community/sqlite'
// Este pacote não foi instalado!
```

**Impacto:** Compilação quebrada, app não roda

**Soluções (escolha uma):**

**Opção A: Remover hook por enquanto** (Recomendado para Fase 1)
- Deletar arquivo `useOfflineStorage.ts`
- Removar importação de `useOfflineStorage` do `App.tsx`
- Implementar storage offline na Fase 2 com solução testada

**Opção B: Usar localStorage nativo do browser** (Fallback)
```typescript
// Reescrever hook para usar localStorage em vez de SQLite
export function useOfflineStorage() {
  const saveForSync = async (type: string, data: any) => {
    const queue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
    queue.push({ type, data, timestamp: Date.now() });
    localStorage.setItem('syncQueue', JSON.stringify(queue));
  };
  // ... implementar resto do hook
}
```

**Recomendação:** Opção A (mais limpa) - implementar storage offline adequadamente na Fase 2

---

### 3. **TypeScript Warnings do SPFx** (CRÍTICO)
**Problema:**
```
[WARNING] Cannot find base config file "./node_modules/@microsoft/spfx-web-build-rig/..."
```

**Causa:** `sigq/frontend/tsconfig.json` está estendendo configuração pai errada

**Solução:**
Remover referência ao SPFx (não é necessário para React puro):

```json
// Atual (ERRADO):
{
  "extends": "../../tsconfig.json",  // SPFx config
  ...
}

// Corrigido:
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    ...
  },
  // Não estender nada
}
```

**Arquivo a atualizar:** `sigq/frontend/tsconfig.json`

---

## ⚠️ Problemas Importantes (Melhoram Estabilidade)

### 4. **Backend: Falta de Error Handling Robusto**
**Problema:**
```python
# Atual em empreendimentos.py
@router.delete("/{empreendimento_id}", status_code=204)
async def deletar_empreendimento(...):
    empreendimento = EmpreendimentoService.obter_por_id(db, empreendimento_id)
    if not empreendimento:
        raise HTTPException(status_code=404, ...)
    EmpreendimentoService.deletar(db, empreendimento)
    # Sem try-catch! Erro no DB causaria 500
```

**Solução:**
Adicionar error handling em todos os endpoints:

```python
from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError

@router.delete("/{empreendimento_id}", status_code=204)
async def deletar_empreendimento(...):
    try:
        empreendimento = EmpreendimentoService.obter_por_id(db, empreendimento_id)
        if not empreendimento:
            raise HTTPException(status_code=404, detail="Não encontrado")
        
        EmpreendimentoService.deletar(db, empreendimento)
    except SQLAlchemyError as e:
        logger.error(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Erro ao deletar")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Erro interno")
```

**Arquivos a atualizar:**
- `sigq/backend/app/routers/empreendimentos.py`
- Todos os routers futuros

---

### 5. **Backend: Logging Não Configurado**
**Problema:** Sem logs estruturados, difícil debugar em produção

**Solução:**
Adicionar logging centralizado:

**Novo arquivo:** `sigq/backend/app/core/logging.py`
```python
import logging
import logging.config
import json
from app.core.config import settings

LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        },
        "detailed": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s"
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "default",
        },
        "file": {
            "class": "logging.FileHandler",
            "filename": "logs/sigq.log",
            "formatter": "detailed",
        },
    },
    "root": {
        "level": "INFO" if not settings.DEBUG else "DEBUG",
        "handlers": ["console", "file"],
    },
}

def setup_logging():
    logging.config.dictConfig(LOGGING_CONFIG)

logger = logging.getLogger(__name__)
```

**Usar em app/main.py:**
```python
from app.core.logging import setup_logging

setup_logging()

app = FastAPI(...)
```

---

### 6. **Backend: Testes Incompletos**
**Problema:** Apenas `test_health.py`, sem testes CRUD

**Solução:**
Adicionar testes para empreendimentos:

**Novo arquivo:** `sigq/backend/tests/test_empreendimentos.py`
```python
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal, Base, engine

@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    yield SessionLocal()
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)

def test_criar_empreendimento():
    response = client.post(
        "/v1/empreendimentos",
        json={"nome": "Test", "descricao": "Test"}
    )
    assert response.status_code == 201
    assert response.json()["nome"] == "Test"

def test_listar_empreendimentos():
    response = client.get("/v1/empreendimentos")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_empreendimento_nao_encontrado():
    response = client.get("/v1/empreendimentos/nonexistent-id")
    assert response.status_code == 404
```

**Rodar testes:**
```bash
pytest tests/ -v --cov=app
```

---

### 7. **Alembic Config: Auto-upgrade Desabilitado**
**Problema:**
App não executa migrations automaticamente no startup

**Solução:**
Criar função de auto-upgrade:

**Novo arquivo:** `sigq/backend/app/core/migrations.py`
```python
from alembic import command
from alembic.config import Config
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

def run_migrations():
    """Executa migrations pendentes no startup"""
    try:
        alembic_cfg = Config("alembic.ini")
        alembic_cfg.set_main_option("sqlalchemy.url", settings.DATABASE_URL)
        command.upgrade(alembic_cfg, "head")
        logger.info("✓ Migrations executadas com sucesso")
    except Exception as e:
        logger.error(f"✗ Erro ao executar migrations: {e}")
        raise

# Em app/main.py, antes de iniciar FastAPI:
from contextlib import asynccontextmanager
from app.core.migrations import run_migrations

@asynccontextmanager
async def lifespan(app):
    # Startup
    run_migrations()
    yield
    # Shutdown

app = FastAPI(lifespan=lifespan)
```

---

## ℹ️ Problemas Menores (Nice to Have)

### 8. **Frontend: Vulnerabilidades npm**
```
12 vulnerabilities (4 moderate, 8 high)
```

**Solução:**
```bash
npm audit fix
# Ou revisar cada uma: npm audit
```

---

### 9. **Frontend: Bundle Size Não Otimizado**
**Problema:** 238 KB é aceitável, mas pode melhorar

**Solução para Fase 2:**
- Lazy load de componentes
- Tree-shaking de dependências não usadas
- Compression de assets

---

### 10. **Capacitor: Plugin Versions Desatualizadas**
```
@capacitor/camera@6.1.3 (funciona)
@capacitor/filesystem@6.0.4 (funciona)
@capacitor/network@6.0.4 (funciona)
```

**Impacto:** Menor, funcionam mas podem ter bugs

**Solução:** Atualizar após validar APK funciona

---

## 📋 Checklist de Ajustes Recomendados

### Críticos (Corrigir AGORA)
- [ ] Resolver conflito Capacitor (atualizar para v6 consistente)
- [ ] Remover/refatorar `useOfflineStorage.ts`
- [ ] Corrigir `tsconfig.json` (remover referência SPFx)

### Importantes (Corrigir antes da Fase 2)
- [ ] Adicionar error handling robusto no backend
- [ ] Configurar logging centralizado
- [ ] Implementar testes para CRUD
- [ ] Auto-migrate on startup

### Nice to Have (Fase 2+)
- [ ] Rodar `npm audit fix`
- [ ] Otimizar bundle size
- [ ] Atualizar plugin versions

---

## 🎯 Prioridade de Implementação

### 1️⃣ **Urgente** (bloqueia desenvolvimento)
```
1. Fixar Capacitor version mismatch
2. Remover useOfflineStorage ou refatorar com localStorage
3. Corrigir TypeScript config
```
⏱️ **Tempo estimado:** 30 minutos

### 2️⃣ **Importante** (melhora qualidade)
```
4. Error handling
5. Logging
6. Testes CRUD
```
⏱️ **Tempo estimado:** 2 horas

### 3️⃣ **Opcional** (Fase 2)
```
7. npm audit fix
8. Bundle optimization
9. Plugin updates
```

---

## 📊 Impacto dos Ajustes

| Ajuste | Crítico? | Tempo | Impacto |
|--------|----------|-------|---------|
| Capacitor versions | ✅ | 15 min | Alto - APK build |
| useOfflineStorage | ✅ | 10 min | Alto - compilação |
| TypeScript config | ✅ | 5 min | Médio - warnings |
| Error handling | ⚠️ | 1h | Alto - produção |
| Logging | ⚠️ | 30 min | Médio - debug |
| Testes | ⚠️ | 1h | Médio - qualidade |

---

## 🚀 Recomendação Final

**Para continuar com Fase 2 (APK + Câmera):**

### Mínimo obrigatório (30 min):
1. ✅ Corrigir Capacitor versions
2. ✅ Remover useOfflineStorage.ts
3. ✅ Corrigir tsconfig.json
4. ✅ Testar que build ainda funciona

### Recomendado antes de APK (1.5h total):
1. ✅ + Error handling (30 min)
2. ✅ + Logging básico (20 min)
3. ✅ + Testes CRUD (30 min)

**Resultado:** Código robusto, debugável, testado ✅

Quer que eu implemente todos os ajustes críticos agora?
