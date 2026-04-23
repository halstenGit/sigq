# 🚀 SIGQ Fase 2: APK + Câmera + Autenticação

**Data:** 2026-04-23  
**Status:** 🎯 **EM ANDAMENTO**

---

## 📋 Objetivos da Fase 2

```
Priority 1: Android APK Funcional
├─ [ ] Configurar Android Studio + SDK
├─ [ ] Build debug APK
├─ [ ] Testar em emulador
└─ [ ] Validar integração API

Priority 2: Câmera Nativa
├─ [ ] UI para captura de foto
├─ [ ] @capacitor/camera integration
├─ [ ] Salvar em Cloudflare R2
└─ [ ] EXIF metadata handling

Priority 3: Autenticação
├─ [ ] Entra ID (Azure AD)
├─ [ ] Login flow
├─ [ ] JWT tokens
└─ [ ] Auth middleware

Priority 4: Persistência Offline
├─ [ ] SQLite local (Capacitor Community)
├─ [ ] Fila de sincronização
└─ [ ] Detecção de reconexão
```

---

## 🎯 1. Android APK Build

### 1.1 Pré-requisitos

```
✅ Capacitor configurado (já feito)
✅ Web assets built (já feito: npm run build)
✅ Android project generated (já feito: npx cap add android)

❌ Android Studio (precisa instalar)
❌ Android SDK (precisa via Android Studio)
❌ Java 17+ (verificar)
```

### 1.2 Passos

#### Passo 1: Instalar Android Studio
```
1. Download: https://developer.android.com/studio
2. Instalar e executar
3. Na primeira execução:
   - Accept licenças
   - Instalar Android SDK (API 24-35)
   - Instalar emulador
```

#### Passo 2: Abrir projeto Capacitor
```bash
cd sigq/frontend
npx cap open android
# Abre Android Studio com o projeto pronto
```

#### Passo 3: Build Debug APK
```
No Android Studio:
1. Menu: Build → Build Bundle(s)/APK(s) → Build APK(s)
2. Aguarda build (1-5 minutos)
3. APK salvo em:
   android/app/build/outputs/apk/debug/app-debug.apk
```

#### Passo 4: Instalar no Emulador
```bash
# Verificar emuladores disponíveis
adb devices

# Instalar APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Ou arrastar para emulador
```

#### Passo 5: Testar
```
1. Abrir app SIGQ no emulador
2. Tentar criar empreendimento
3. Verificar se conecta em http://localhost:8000
4. Logs em: adb logcat
```

### 1.3 Troubleshooting APK

**APK não instala:**
```bash
adb uninstall com.halsten.sigq
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

**App pede permissões:**
- Android pede sempre na primeira execução
- Grant permissions para: Câmera, Armazenamento, Rede

**API não responde:**
```
Emulador não acessa localhost:8000 do host
Solução: Usar IP real (172.17.0.2 ou adb forward)

adb forward tcp:8000 tcp:8000
# Depois acessar: http://localhost:8000 funciona
```

---

## 📷 2. Câmera Nativa

### 2.1 Implementação

**Novo componente:** `CameraCapture.tsx`

```typescript
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useState } from 'react';

export function CameraCapture() {
  const [photo, setPhoto] = useState<string | undefined>();

  const takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });
    setPhoto(image.base64String);
  };

  return (
    <div>
      <button onClick={takePicture}>📷 Tirar Foto</button>
      {photo && <img src={`data:image/jpeg;base64,${photo}`} />}
    </div>
  );
}
```

### 2.2 Upload para Cloudflare R2

**Backend novo endpoint:**
```python
@router.post("/v1/evidencias/upload")
async def upload_evidencia(
    file: UploadFile,
    db: Session = Depends(get_db),
):
    # Salvar em R2
    s3_client.put_object(
        Bucket="sigq-evidencias",
        Key=f"evidencias/{uuid.uuid4()}",
        Body=await file.read(),
        ContentType=file.content_type,
    )
    return {"url": "https://r2-url"}
```

**Frontend:**
```typescript
const uploadToR2 = async (base64Photo: string) => {
  const blob = base64ToBlob(base64Photo, 'image/jpeg');
  const formData = new FormData();
  formData.append('file', blob);

  const response = await fetch('/v1/evidencias/upload', {
    method: 'POST',
    body: formData,
  });
  const { url } = await response.json();
  return url;
};
```

### 2.3 EXIF Metadata

```typescript
import exifParser from 'exif-parser';

const getExifData = async (base64: string) => {
  const buffer = Buffer.from(base64, 'base64');
  const exif = exifParser.create(buffer);
  return {
    latitude: exif.result?.tags?.GPSLatitude,
    longitude: exif.result?.tags?.GPSLongitude,
    timestamp: exif.result?.tags?.DateTime,
  };
};
```

### 2.4 Model RNC (Registro de Não Conformidade)

```python
class RNC(Base):
    __tablename__ = "rncs"

    id = Column(UUID, primary_key=True)
    fvs_id = Column(UUID, ForeignKey("fvs.id"))
    descricao = Column(String(500))
    gravidade = Column(String(50))  # critica, maior, menor, observacao
    status = Column(String(50))  # aberta, em_analise, em_correcao, fechada
    
    # Evidências
    evidencias = relationship("Evidencia")

class Evidencia(Base):
    __tablename__ = "evidencias"

    id = Column(UUID, primary_key=True)
    rnc_id = Column(UUID, ForeignKey("rncs.id"))
    tipo = Column(String(20))  # foto, documento
    url_r2 = Column(String(255))
    metadata = Column(JSON)  # EXIF, coordenadas, etc
```

---

## 🔐 3. Autenticação (Entra ID)

### 3.1 Setup Azure (Entra ID)

**No Azure Portal:**
1. App registrations → New registration
2. Nome: SIGQ
3. Redirect URI: `http://localhost:5173/auth/callback`
4. Copy: Client ID, Tenant ID
5. Criar Client Secret

### 3.2 Backend - JWT Middleware

**Novo arquivo:** `backend/app/core/auth.py`

```python
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthCredentials

security = HTTPBearer()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=8)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt

def verify_token(credentials: HTTPAuthCredentials = Depends(security)):
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido"
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido"
        )
    return username

# Usar em routers:
@router.get("/protected")
async def protected_route(user = Depends(verify_token)):
    return {"user": user}
```

### 3.3 Frontend - Entra ID Login

**Instalar:**
```bash
npm install @azure/msal-browser @azure/msal-react
```

**Novo componente:** `LoginButton.tsx`

```typescript
import { useMsalContext, useAccount } from "@azure/msal-react";

export function LoginButton() {
  const { instance, accounts } = useMsalContext();
  const account = useAccount(accounts[0]);

  const handleLogin = async () => {
    try {
      const result = await instance.loginPopup({
        scopes: ["User.Read"],
      });
      
      // Get token
      const tokenResponse = await instance.acquireTokenSilent({
        scopes: ["api://sigq-api/.default"],
        account: result.account,
      });

      // Save token
      localStorage.setItem("token", tokenResponse.accessToken);
      
      // Use in API calls
      const response = await fetch("/v1/empreendimentos", {
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={handleLogin}>
      {account ? `Bem-vindo, ${account.name}` : "Login com Azure"}
    </button>
  );
}
```

### 3.4 Proteger Rotas

```python
from app.core.auth import verify_token

@router.post("/v1/empreendimentos")
async def criar_empreendimento(
    obj_in: EmpreendimentoCreate,
    user: str = Depends(verify_token),  # ← Protegido
    db: Session = Depends(get_db),
):
    logger.info(f"User {user} creating empreendimento")
    return EmpreendimentoService.criar(db, obj_in)
```

---

## 💾 4. Persistência Offline (Opcional)

### 4.1 SQLite Local com Capacitor Community

```bash
npm install @capacitor-community/sqlite
npx cap sync android
```

### 4.2 Hook para Sync

```typescript
export function useSyncQueue() {
  const { getQueue, removeFromQueue } = useOfflineQueue();
  
  const syncAll = async () => {
    const queue = getQueue();
    
    for (const item of queue) {
      try {
        const response = await fetch(item.endpoint, {
          method: item.type.toUpperCase(),
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify(item.data),
        });
        
        if (response.ok) {
          removeFromQueue(item.id);
        }
      } catch (error) {
        console.error(`Failed to sync ${item.id}`, error);
      }
    }
  };

  // Sincronizar quando reconectar
  useEffect(() => {
    const unsubscribe = Network.addListener('networkStatusChange', (status) => {
      if (status.connected) {
        syncAll();
      }
    });
    return () => unsubscribe.then(e => e());
  }, []);

  return { syncAll };
}
```

---

## 🔄 Fluxo Completo (Fase 2)

### User Story: Criar RNC com Foto

```
1. Inspetor abre app SIGQ
   ↓
2. Faz login com Entra ID
   ↓
3. Lista empreendimentos
   ↓
4. Abre serviço específico
   ↓
5. Cria RNC (Registro de Não Conformidade)
   ↓
6. Tira foto com câmera nativa
   ↓
7. Carrega foto para Cloudflare R2
   ↓
8. Salva RNC com referência à foto
   ↓
9. Se offline, enfileira sincronização
   ↓
10. Quando reconecta, sincroniza automaticamente
```

---

## 📦 Dependências Novas

### Frontend
```json
{
  "@capacitor/camera": "^6.0.0",
  "@azure/msal-browser": "^3.0.0",
  "@azure/msal-react": "^2.0.0",
  "exif-parser": "^0.1.12",
  "@capacitor-community/sqlite": "^5.5.0"
}
```

### Backend
```toml
boto3>=1.34.0           # Cloudflare R2 (S3-compatible)
python-multipart>=0.0.5 # File uploads
azure-identity>=1.13.0  # Azure AD validation
```

---

## 🧪 Testes Fase 2

### Camera
```python
def test_camera_captures_photo():
    # Mock capacitor camera
    photo = {"base64String": "..."}
    assert photo["base64String"]

def test_upload_to_r2():
    response = client.post("/v1/evidencias/upload", files={"file": photo})
    assert response.status_code == 200
    assert "url" in response.json()
```

### Auth
```python
def test_login_entra_id():
    token = get_token_from_entra()
    response = client.get(
        "/v1/empreendimentos",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200

def test_no_token_unauthorized():
    response = client.get("/v1/empreendimentos")
    assert response.status_code == 401
```

---

## ⏱️ Cronograma Estimado

| Tarefa | Tempo | Depende de |
|--------|-------|-----------|
| Android Studio setup | 30 min | Nada |
| Build APK debug | 15 min | Android Studio |
| Testar em emulador | 20 min | APK |
| Câmera UI + @capacitor/camera | 1h | Nada |
| R2 upload endpoint | 1h | Câmera |
| EXIF metadata | 30 min | R2 upload |
| Entra ID setup (Azure) | 20 min | Nada |
| JWT middleware | 1h | Nada |
| Login UI (@azure/msal-react) | 1h | JWT + Entra setup |
| Proteger rotas | 30 min | JWT |
| Testes (Auth + Camera) | 1.5h | Todas as features |
| **Total** | **~8h** | - |

---

## 🎯 Success Criteria

```
✅ APK roda em emulador
✅ App conecta na API
✅ Login Entra ID funciona
✅ Câmera tira fotos
✅ Fotos são salvas em R2
✅ Offline queueing funciona
✅ Sincronização automática
✅ Testes de integração passam
```

---

## 📝 Próximas Etapas

1. **Agora:** Implementar câmera + R2 upload (não precisa Android Studio)
2. **Quando tiver Android Studio:** Build APK
3. **Paralelo:** Implementar Entra ID + JWT

**Vamos começar? 🚀**
