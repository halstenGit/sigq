# 🤖 Scraper do Mobuss - Guia de Execução

## 📋 O que o script faz?

Extrai **TODOS** os recursos disponíveis no Mobuss:
- ✅ Formulários
- ✅ Campos (inputs, selects, textareas)
- ✅ Opções de dropdowns
- ✅ Tabelas e dados
- ✅ Menu de navegação
- ✅ Estrutura da página
- ✅ Screenshots

## 📊 Saída

Gera **3 arquivos**:
1. **`relatorio_mobuss.json`** — Dados completos em JSON
2. **`relatorio_mobuss.xlsx`** — Tabelas em Excel (4 abas)
3. **`screenshots/`** — Capturas de tela das páginas

---

## 🚀 Como Executar

### **Passo 1: Instalar dependências**

```bash
pip install -r requirements_scraper.txt
```

**Dependências:**
- `selenium` — Automação do navegador
- `openpyxl` — Criação de Excel
- `python-dotenv` — Variáveis de ambiente

### **Passo 2: Baixar ChromeDriver**

O script usa Chrome/Chromium. Você precisa do **ChromeDriver**:

**Opção A: Baixar manualmente**
1. Acesse: https://chromedriver.chromium.org/
2. Baixe a versão que corresponde ao seu Chrome
3. Salve em `C:\scraper_mobuss\` ou adicione ao PATH

**Opção B: Usar webdriver-manager (automático)**
```bash
pip install webdriver-manager
```

Depois, no script, mude a linha:
```python
# De:
self.driver = webdriver.Chrome(options=chrome_options)

# Para:
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

service = Service(ChromeDriverManager().install())
self.driver = webdriver.Chrome(service=service, options=chrome_options)
```

### **Passo 3: Executar o script**

```bash
python scraper_mobuss.py
```

### **Passo 4: Ver resultados**

```
├── relatorio_mobuss.json     (dados completos)
├── relatorio_mobuss.xlsx     (tabelas)
└── screenshots/              (imagens)
    ├── pagina_inicial.png
    ├── erro_login.png (se houver erro)
    └── ...
```

---

## 📈 O que você vai obter

### **Excel (relatorio_mobuss.xlsx)**
- **Aba 1 - Estrutura:** Contagem de elementos (forms, inputs, tables, etc)
- **Aba 2 - Campos:** Lista de todos os campos (tipo, nome, ID)
- **Aba 3 - Opções:** Todas as opções de dropdowns
- **Aba 4 - Resumo:** Métricas consolidadas

### **JSON (relatorio_mobuss.json)**
Estrutura completa para análise programática:
```json
{
  "timestamp": "2026-04-24T...",
  "formularios": [...],
  "campos": [...],
  "opcoes": [...],
  "estrutura": {...},
  "urls_visitadas": [...]
}
```

---

## ⚙️ Customizações

### **Modo Headless (sem mostrar janela)**
Descomente na linha 35:
```python
chrome_options.add_argument("--headless")
```

### **Aumentar timeout de espera**
Mude os `time.sleep()`:
```python
time.sleep(5)  # Aumenta espera
```

### **Navegar mais seções**
Mude a linha que limita a 5:
```python
for tab in tabs[:10]:  # Aumenta para 10
```

---

## 🐛 Troubleshooting

### **Erro: "ChromeDriver not found"**
```bash
pip install webdriver-manager
# Depois aplique a mudança no código acima
```

### **Erro: "Login falhou"**
- Verifique credenciais
- Captura de screenshot é salva em `erro_login.png`
- Talvez o seletor CSS mudou (inspecione a página)

### **Erro: "Element not found"**
Adapte os seletores CSS na função `login()`:
```python
# Inspecione a página (F12) e encontre os IDs/classes corretos
email_field = self.driver.find_element(By.ID, "id_correto")
```

---

## 💡 Dicas

1. **Primeira execução pode demorar** — O script navega múltiplas seções
2. **Credenciais são seguras** — Estão no script (considere usar `.env` depois)
3. **Screenshots ajudam a debugar** — Veja o que foi capturado
4. **Estude o JSON** — Tem informações detalhadas

---

## 📝 Próximos Passos

Após executar:
1. Abra `relatorio_mobuss.xlsx` para ver resumo
2. Analise `relatorio_mobuss.json` para estrutura completa
3. Compartilhe comigo para fazer análise detalhada
4. Identificar campos novos para adicionar ao SIGQ

---

## ❓ Dúvidas?

Se houver erro, me passa:
- A mensagem de erro completa
- O screenshot gerado em `erro_login.png`
- Eu ajusto o script!
