"""
Script de Scraping do Mobuss - Extrai todos os recursos disponíveis
Cria relatório detalhado de formulários, campos, opções e estrutura
"""

import json
import time
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
import os

# Configurações
URL = "https://www.mobuss.com.br/ccweb/htdocs/programs/qualidade/checklist/realizado/iu01_23.jsf"
EMAIL = "ti@grupoinvestcorp.com.br"
SENHA = "FT$0luc0#$TI"

class MobussScraper:
    def __init__(self):
        self.driver = None
        self.data = {
            "timestamp": datetime.now().isoformat(),
            "formularios": [],
            "campos": [],
            "opcoes": [],
            "empreendimentos": [],
            "servicos": [],
            "estrutura": {},
            "urls_visitadas": []
        }

    def setup_driver(self):
        """Configura o driver do Selenium"""
        chrome_options = Options()
        # chrome_options.add_argument("--headless")  # Descomente para modo headless
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")

        self.driver = webdriver.Chrome(options=chrome_options)
        print("✅ Driver iniciado")

    def login(self):
        """Realiza login no Mobuss"""
        try:
            print(f"🔐 Acessando: {URL}")
            self.driver.get(URL)

            # Aguarda carregamento
            time.sleep(3)

            # Encontra campos de login
            email_field = self.driver.find_element(By.CSS_SELECTOR, "input[type='email'], input[name*='email'], input[name*='usuario'], input[type='text']")
            senha_field = self.driver.find_element(By.CSS_SELECTOR, "input[type='password']")

            # Preenche credenciais
            email_field.clear()
            email_field.send_keys(EMAIL)
            time.sleep(1)

            senha_field.clear()
            senha_field.send_keys(SENHA)
            time.sleep(1)

            # Clica em login
            login_btn = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit'], input[type='submit'], button:contains('Entrar'), button:contains('Login')")
            login_btn.click()

            # Aguarda redirecionamento
            time.sleep(5)
            print("✅ Login realizado")

        except Exception as e:
            print(f"❌ Erro no login: {e}")
            self.captura_screenshot("erro_login.png")

    def extrair_formularios(self):
        """Extrai todos os formulários da página"""
        try:
            formularios = self.driver.find_elements(By.TAG_NAME, "form")

            for form in formularios:
                form_data = {
                    "id": form.get_attribute("id"),
                    "name": form.get_attribute("name"),
                    "action": form.get_attribute("action"),
                    "method": form.get_attribute("method"),
                    "campos": self.extrair_campos_formulario(form)
                }
                self.data["formularios"].append(form_data)

            print(f"✅ {len(formularios)} formulário(s) encontrado(s)")

        except Exception as e:
            print(f"❌ Erro ao extrair formulários: {e}")

    def extrair_campos_formulario(self, formulario):
        """Extrai campos de um formulário específico"""
        campos = []

        try:
            # Inputs
            inputs = formulario.find_elements(By.TAG_NAME, "input")
            for inp in inputs:
                campo = {
                    "tipo": "input",
                    "input_type": inp.get_attribute("type"),
                    "name": inp.get_attribute("name"),
                    "id": inp.get_attribute("id"),
                    "placeholder": inp.get_attribute("placeholder"),
                    "required": inp.get_attribute("required"),
                    "value": inp.get_attribute("value")
                }
                campos.append(campo)
                self.data["campos"].append(campo)

            # Selects
            selects = formulario.find_elements(By.TAG_NAME, "select")
            for select in selects:
                opcoes = []
                options = select.find_elements(By.TAG_NAME, "option")
                for opt in options:
                    opcoes.append({
                        "value": opt.get_attribute("value"),
                        "text": opt.text
                    })
                    self.data["opcoes"].append({
                        "select": select.get_attribute("name"),
                        "option": opt.text,
                        "value": opt.get_attribute("value")
                    })

                campo = {
                    "tipo": "select",
                    "name": select.get_attribute("name"),
                    "id": select.get_attribute("id"),
                    "opcoes": opcoes
                }
                campos.append(campo)

            # Textareas
            textareas = formulario.find_elements(By.TAG_NAME, "textarea")
            for textarea in textareas:
                campo = {
                    "tipo": "textarea",
                    "name": textarea.get_attribute("name"),
                    "id": textarea.get_attribute("id")
                }
                campos.append(campo)
                self.data["campos"].append(campo)

            # Buttons
            buttons = formulario.find_elements(By.TAG_NAME, "button")
            for btn in buttons:
                campo = {
                    "tipo": "button",
                    "text": btn.text,
                    "type": btn.get_attribute("type"),
                    "id": btn.get_attribute("id"),
                    "name": btn.get_attribute("name")
                }
                campos.append(campo)

        except Exception as e:
            print(f"⚠️ Erro ao extrair campos: {e}")

        return campos

    def extrair_tabelas(self):
        """Extrai dados de tabelas"""
        try:
            tabelas = self.driver.find_elements(By.TAG_NAME, "table")

            for idx, tabela in enumerate(tabelas):
                # Cabeçalhos
                headers = []
                header_cells = tabela.find_elements(By.TAG_NAME, "th")
                for cell in header_cells:
                    headers.append(cell.text)

                # Linhas
                linhas = []
                rows = tabela.find_elements(By.TAG_NAME, "tr")
                for row in rows[1:]:  # Pula cabeçalho
                    cells = row.find_elements(By.TAG_NAME, "td")
                    linha_data = {}
                    for i, cell in enumerate(cells):
                        if i < len(headers):
                            linha_data[headers[i]] = cell.text
                    if linha_data:
                        linhas.append(linha_data)

                print(f"✅ Tabela {idx + 1}: {len(linhas)} linha(s), {len(headers)} coluna(s)")

        except Exception as e:
            print(f"❌ Erro ao extrair tabelas: {e}")

    def extrair_menu_navegacao(self):
        """Extrai menu de navegação e links"""
        try:
            links = self.driver.find_elements(By.TAG_NAME, "a")
            menu_items = []

            for link in links:
                item = {
                    "text": link.text,
                    "href": link.get_attribute("href"),
                    "id": link.get_attribute("id"),
                    "class": link.get_attribute("class")
                }
                if link.text.strip():
                    menu_items.append(item)

            self.data["estrutura"]["menu"] = menu_items
            print(f"✅ {len(menu_items)} item(s) de menu encontrado(s)")

        except Exception as e:
            print(f"❌ Erro ao extrair menu: {e}")

    def extrair_estrutura_pagina(self):
        """Extrai estrutura geral da página"""
        try:
            estrutura = {
                "titulo": self.driver.title,
                "url_atual": self.driver.current_url,
                "divs": len(self.driver.find_elements(By.TAG_NAME, "div")),
                "forms": len(self.driver.find_elements(By.TAG_NAME, "form")),
                "tables": len(self.driver.find_elements(By.TAG_NAME, "table")),
                "inputs": len(self.driver.find_elements(By.TAG_NAME, "input")),
                "selects": len(self.driver.find_elements(By.TAG_NAME, "select")),
                "buttons": len(self.driver.find_elements(By.TAG_NAME, "button")),
            }
            self.data["estrutura"]["pagina"] = estrutura
            print(f"✅ Estrutura da página extraída")

        except Exception as e:
            print(f"❌ Erro ao extrair estrutura: {e}")

    def navegar_secoes(self):
        """Tenta navegar por outras seções disponíveis"""
        try:
            # Procura por abas/seções
            tabs = self.driver.find_elements(By.CSS_SELECTOR, "[role='tab'], .tab, .aba, li[class*='tab'], li[class*='aba']")

            for tab in tabs[:5]:  # Limita a 5 para não demorar muito
                try:
                    titulo = tab.text
                    if titulo.strip():
                        tab.click()
                        time.sleep(2)

                        # Extrai dados da nova seção
                        self.extrair_formularios()
                        self.extrair_tabelas()

                        print(f"✅ Seção '{titulo}' processada")

                except Exception as e:
                    print(f"⚠️ Erro ao clicar na seção: {e}")

        except Exception as e:
            print(f"⚠️ Erro ao navegar seções: {e}")

    def captura_screenshot(self, nome="screenshot.png"):
        """Captura screenshot da página"""
        try:
            caminho = os.path.join("screenshots", nome)
            os.makedirs("screenshots", exist_ok=True)
            self.driver.save_screenshot(caminho)
            print(f"📸 Screenshot salvo: {caminho}")
        except Exception as e:
            print(f"❌ Erro ao capturar screenshot: {e}")

    def exportar_json(self):
        """Exporta dados em JSON"""
        try:
            caminho = "relatorio_mobuss.json"
            with open(caminho, 'w', encoding='utf-8') as f:
                json.dump(self.data, f, indent=2, ensure_ascii=False)
            print(f"✅ JSON exportado: {caminho}")
        except Exception as e:
            print(f"❌ Erro ao exportar JSON: {e}")

    def exportar_excel(self):
        """Exporta dados em Excel"""
        try:
            wb = Workbook()

            # Aba 1: Estrutura
            ws1 = wb.active
            ws1.title = "Estrutura"
            ws1['A1'] = "Página"
            ws1['B1'] = "Valor"
            row = 2
            for chave, valor in self.data["estrutura"].get("pagina", {}).items():
                ws1[f'A{row}'] = chave
                ws1[f'B{row}'] = str(valor)
                row += 1

            # Aba 2: Campos
            ws2 = wb.create_sheet("Campos")
            ws2['A1'] = "Tipo"
            ws2['B1'] = "Nome"
            ws2['C1'] = "ID"
            ws2['D1'] = "Placeholder"
            row = 2
            for campo in self.data["campos"]:
                ws2[f'A{row}'] = campo.get("tipo", "")
                ws2[f'B{row}'] = campo.get("name", "")
                ws2[f'C{row}'] = campo.get("id", "")
                ws2[f'D{row}'] = campo.get("placeholder", "")
                row += 1

            # Aba 3: Opções
            ws3 = wb.create_sheet("Opções")
            ws3['A1'] = "Select"
            ws3['B1'] = "Opção"
            ws3['C1'] = "Value"
            row = 2
            for opcao in self.data["opcoes"]:
                ws3[f'A{row}'] = opcao.get("select", "")
                ws3[f'B{row}'] = opcao.get("option", "")
                ws3[f'C{row}'] = opcao.get("value", "")
                row += 1

            # Aba 4: Resumo
            ws4 = wb.create_sheet("Resumo")
            ws4['A1'] = "Métrica"
            ws4['B1'] = "Quantidade"
            resumo = [
                ("Formulários", len(self.data["formularios"])),
                ("Campos", len(self.data["campos"])),
                ("Opções", len(self.data["opcoes"])),
                ("Divs", self.data["estrutura"].get("pagina", {}).get("divs", 0)),
                ("Tabelas", self.data["estrutura"].get("pagina", {}).get("tables", 0)),
            ]
            for idx, (metrica, valor) in enumerate(resumo, start=2):
                ws4[f'A{idx}'] = metrica
                ws4[f'B{idx}'] = valor

            # Salva
            caminho = "relatorio_mobuss.xlsx"
            wb.save(caminho)
            print(f"✅ Excel exportado: {caminho}")

        except Exception as e:
            print(f"❌ Erro ao exportar Excel: {e}")

    def executar(self):
        """Executa o scraping completo"""
        try:
            print("🚀 Iniciando scraping do Mobuss...\n")

            self.setup_driver()
            self.login()

            print("\n📊 Extraindo dados da página...\n")
            self.extrair_estrutura_pagina()
            self.extrair_formularios()
            self.extrair_tabelas()
            self.extrair_menu_navegacao()
            self.navegar_secoes()

            print("\n💾 Exportando relatórios...\n")
            self.exportar_json()
            self.exportar_excel()

            self.captura_screenshot("pagina_inicial.png")

            print("\n✅ Scraping concluído com sucesso!")

        except Exception as e:
            print(f"\n❌ Erro geral: {e}")

        finally:
            if self.driver:
                self.driver.quit()
                print("🔌 Driver fechado")

if __name__ == "__main__":
    scraper = MobussScraper()
    scraper.executar()
