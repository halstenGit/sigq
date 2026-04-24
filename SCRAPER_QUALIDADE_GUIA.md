# 🎯 Scraper QUALIDADE - Mobuss

## 📌 O que ele faz?

Extrai **TODOS os dados da seção QUALIDADE** do Mobuss:

### **Seções Processadas:**
- 📊 Painel de Qualidade
- 📋 Cobertura
- 📐 Modelos de Análise
- 📍 Acompanhamento de Inspeções
- ✅ Realizados (Formulários)
- 📝 Cadastros
- 🏷️ Tipos de Formulários
- ⚠️ Gestão (RNCs)
- 🔧 Ações
- 📌 Tipos

### **O que extrai de cada seção:**
- ✅ Formulários (campos, labels, tipos)
- ✅ Tabelas (headers, dados, total de linhas)
- ✅ Dropdowns e opções disponíveis
- ✅ Campos de entrada (input, textarea, select)
- ✅ Estrutura completa da página

---

## 🚀 Como Executar

### **Passo 1: Instalar dependências**

```bash
pip install -r requirements_scraper.txt
```

Ou manualmente:
```bash
pip install selenium==4.15.2 openpyxl==3.11.0
```

### **Passo 2: Baixar ChromeDriver** (se não tiver)

```bash
pip install webdriver-manager
```

Depois edite a linha do script:
```python
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

# Mude:
self.driver = webdriver.Chrome(options=chrome_options)

# Para:
service = Service(ChromeDriverManager().install())
self.driver = webdriver.Chrome(service=service, options=chrome_options)
```

### **Passo 3: Executar o scraper**

```bash
python scraper_mobuss_qualidade.py
```

### **Passo 4: Ver resultados**

```
relatorio_mobuss_qualidade.json    (dados completos - JSON)
relatorio_mobuss_qualidade.xlsx    (tabelas - Excel com 4 abas)
screenshots/                        (imagens das seções)
├── secao_painel_de_qualidade.png
├── secao_cobertura.png
├── secao_realizados.png
├── secao_gestao.png
└── ...
```

---

## 📊 O que você vai receber

### **Excel (relatorio_mobuss_qualidade.xlsx)**

**Aba 1 - Resumo:**
| Seção | URL | Formulários | Tabelas | Campos | Opções |
|-------|-----|-------------|---------|--------|--------|
| Painel de Qualidade | https://... | 2 | 1 | 5 | 3 |
| Realizados | https://... | 1 | 3 | 8 | 2 |
| Gestão (RNCs) | https://... | 3 | 2 | 12 | 5 |
| ... | ... | ... | ... | ... | ... |

**Aba 2 - Campos:**
| Seção | Tipo | Nome | ID | Placeholder |
|-------|------|------|----|-----------  |
| Painel | input | data_inicio | id_001 | dd/mm/yyyy |
| Realizados | select | tipo_fvs | id_fvs | - |
| Gestão | textarea | descricao_rnc | id_desc | Digite aqui... |
| ... | ... | ... | ... | ... |

**Aba 3 - Opções:**
| Seção | Select | Opção | Value |
|-------|--------|-------|-------|
| Painel | empreendimento | Soul Residencial | 001 |
| Painel | empreendimento | Morada de Gaia | 002 |
| Realizados | status | Finalizado | FIN |
| Realizados | status | Rascunho | RAS |
| ... | ... | ... | ... |

**Aba 4 - Tabelas:**
| Seção | Tabela | Headers | Linhas |
|-------|--------|---------|--------|
| Painel | 1 | ID, Data, Status, Inspetor | 45 |
| Cobertura | 1 | Empreendimento, % Cobertura | 12 |
| Realizados | 2 | FVS ID, Serviço, Data, Status | 234 |
| ... | ... | ... | ... |

### **JSON (relatorio_mobuss_qualidade.json)**
Estrutura completa para análise programática:
```json
{
  "secoes": {
    "Painel de Qualidade": {
      "url": "https://...",
      "formularios": [...],
      "tabelas": [...],
      "campos": [...],
      "opcoes": [...]
    },
    "Realizados": {...},
    ...
  }
}
```

---

## ⚡ Tempo de Execução

- Login: ~5 segundos
- Acesso à Qualidade: ~2 segundos
- Extração por seção: ~2-3 segundos
- **Total estimado: 2-5 minutos** (dependendo de quantas seções)

---

## 🔧 Customizações

### **Extrair apenas certas seções**

Edite a lista `secoes_importantes`:
```python
secoes_importantes = [
    "Painel de Qualidade",
    "Realizados",  # Apenas FVS realizadas
    "Gestão",      # Apenas RNCs
]
```

### **Sem mostrar janela do navegador (headless)**

Adicione ao setup:
```python
chrome_options.add_argument("--headless")
```

### **Aumentar espera de carregamento**

Mude os `time.sleep()`:
```python
time.sleep(5)  # Aumenta para 5 segundos
```

---

## 🐛 Troubleshooting

| Erro | Solução |
|------|---------|
| "ChromeDriver not found" | `pip install webdriver-manager` |
| "Login failed" | Verifique email/senha e veja screenshot `erro_login.png` |
| "Element not found" | Adapte os seletores CSS (inspecione a página com F12) |
| "Timeout" | Aumentar `time.sleep()` ou aumentar `WebDriverWait` timeout |

---

## 📈 Próximos Passos

1. ✅ Execute o scraper
2. ✅ Abra `relatorio_mobuss_qualidade.xlsx`
3. ✅ Revise os campos extraídos em cada seção
4. ✅ Compare com o que você tem no SIGQ
5. ✅ Identifique **campos novos** para adicionar
6. ✅ Compartilhe comigo os resultados!

---

## 💡 Dicas

- **Primeira execução pode demorar** — Muitas seções para processar
- **Screenshots ajudam na validação** — Verifique se as seções foram capturadas corretamente
- **JSON tem estrutura completa** — Use para análise detalhada
- **Excel é mais visual** — Use para apresentar resultados

---

## ❓ Dúvidas?

Se houver erro:
1. Compartilhe a mensagem de erro
2. Envie o arquivo `screenshots/erro_login.png` se houver
3. Eu ajusto o script!

**Boa sorte! 🚀**
