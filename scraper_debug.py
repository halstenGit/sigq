#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Scraper Debug - Analisa o fluxo de login em detalhes
"""

import json
import time
import sys
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import os

LOGIN_URL = "https://www.mobuss.com.br/ccweb/htdocs/programs/portal/home/iu00_02.jsf"
EMAIL = "ti@grupoinvestcorp.com.br"
SENHA = "FT$0luc0#$TI"

def log(nivel, msg):
    ts = datetime.now().strftime("%H:%M:%S")
    print(f"[{ts}] [{nivel}] {msg}")
    sys.stdout.flush()

try:
    log("OK", "Iniciando debug...")

    opts = Options()
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(options=opts)

    # Step 1: Acessar login
    log("INFO", f"Step 1: Acessando {LOGIN_URL}")
    driver.get(LOGIN_URL)
    time.sleep(3)

    # Analisar formulario
    log("INFO", "Step 2: Analisando formulario...")
    forms = driver.find_elements(By.TAG_NAME, "form")
    log("INFO", f"  - Formularios encontrados: {len(forms)}")

    if forms:
        form = forms[0]
        form_action = form.get_attribute("action")
        form_method = form.get_attribute("method")
        form_name = form.get_attribute("name")
        log("INFO", f"  - Form action: {form_action}")
        log("INFO", f"  - Form method: {form_method}")
        log("INFO", f"  - Form name: {form_name}")

        # Inputs do formulario
        inputs = form.find_elements(By.TAG_NAME, "input")
        log("INFO", f"  - Inputs encontrados: {len(inputs)}")
        for inp in inputs:
            inp_type = inp.get_attribute("type")
            inp_name = inp.get_attribute("name")
            inp_id = inp.get_attribute("id")
            log("INFO", f"    * [{inp_type}] name={inp_name}, id={inp_id}")

    # Step 3: Preencher username
    log("INFO", "Step 3: Preenchendo username...")
    user_input = driver.find_element(By.NAME, "username")
    user_input.clear()
    user_input.send_keys(EMAIL)
    time.sleep(1)

    # Capturar HTML do formulario antes de submeter
    form_html = form.get_attribute("outerHTML")
    log("INFO", f"  - Form HTML length: {len(form_html)}")

    # Procurar tokens ocultos
    hidden_inputs = form.find_elements(By.CSS_SELECTOR, "input[type='hidden']")
    log("INFO", f"  - Hidden inputs: {len(hidden_inputs)}")
    for hidden in hidden_inputs[:5]:
        name = hidden.get_attribute("name")
        value = hidden.get_attribute("value")[:50] if hidden.get_attribute("value") else ""
        log("INFO", f"    * {name} = {value}...")

    # Step 4: Clicar em Entrar
    log("INFO", "Step 4: Clicando em Entrar (Etapa 1)...")
    buttons = form.find_elements(By.TAG_NAME, "button")
    if buttons:
        buttons[0].click()
    time.sleep(5)

    # Verificar pagina atual
    url_atual = driver.current_url
    titulo_atual = driver.title
    log("INFO", f"  - URL: {url_atual[:100]}")
    log("INFO", f"  - Titulo: {titulo_atual}")

    # Step 5: Procurar campo de senha
    log("INFO", "Step 5: Procurando campo de senha...")
    try:
        pwd_input = driver.find_element(By.NAME, "password")
        log("OK", "  - Campo de senha encontrado!")

        # Analisar novo formulario
        forms_2 = driver.find_elements(By.TAG_NAME, "form")
        log("INFO", f"  - Formularios agora: {len(forms_2)}")

        if forms_2:
            form_2 = forms_2[0]
            hidden_inputs_2 = form_2.find_elements(By.CSS_SELECTOR, "input[type='hidden']")
            log("INFO", f"  - Hidden inputs no formulario 2: {len(hidden_inputs_2)}")

        # Preencher senha
        pwd_input.clear()
        pwd_input.send_keys(SENHA)
        time.sleep(1)

        # Step 6: Clicar em Entrar novamente
        log("INFO", "Step 6: Clicando em Entrar (Etapa 2)...")
        buttons_2 = form_2.find_elements(By.TAG_NAME, "button")
        if buttons_2:
            buttons_2[0].click()
        else:
            # Tenta submeter o formulario diretamente
            driver.execute_script("arguments[0].submit();", form_2)

        time.sleep(5)

    except Exception as e:
        log("AVISO", f"  - Sem campo de senha: {str(e)[:80]}")

    # Verificar resultado final
    url_final = driver.current_url
    titulo_final = driver.title
    log("INFO", "Step 7: Resultado final...")
    log("INFO", f"  - URL: {url_final[:100]}")
    log("INFO", f"  - Titulo: {titulo_final}")

    # Verificar cookies
    log("INFO", "Step 8: Cookies armazenados...")
    cookies = driver.get_cookies()
    log("INFO", f"  - Total de cookies: {len(cookies)}")
    for cookie in cookies[:3]:
        log("INFO", f"    * {cookie.get('name')[:30]} (expires: {cookie.get('expiry')})")

    # Tentar extrair qualquer mensagem de erro
    log("INFO", "Step 9: Procurando mensagens de erro...")
    try:
        error_msg = driver.find_element(By.CLASS_NAME, "error")
        log("ERRO", f"  - Mensagem de erro: {error_msg.text}")
    except:
        log("INFO", "  - Sem mensagens de erro aparentes")

    # Salvar screenshot final
    os.makedirs("screenshots", exist_ok=True)
    driver.save_screenshot("screenshots/debug_final.png")
    log("OK", "Screenshot salvo: debug_final.png")

    driver.quit()
    log("OK", "Debug concluido!")

except Exception as e:
    log("ERRO", f"Erro geral: {str(e)}")
    try:
        driver.quit()
    except:
        pass
