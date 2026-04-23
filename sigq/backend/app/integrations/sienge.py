"""Sienge ERP API integration

API: https://api.sienge.com.br/halsten/public/api/v1
Autenticação: Basic Auth (SIENGE_USERNAME:SIENGE_PASSWORD)

Este módulo fornece acesso aos dados do Sienge (empreendimentos, estrutura analítica, etc.)
"""

import requests
from requests.auth import HTTPBasicAuth
from typing import Any, Dict, List, Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class SiengeClient:
    def __init__(self):
        self.base_url = settings.SIENGE_BASE_URL
        self.auth = HTTPBasicAuth(settings.SIENGE_USERNAME, settings.SIENGE_PASSWORD)

    def _fazer_requisicao(
        self,
        metodo: str,
        endpoint: str,
        params: Optional[Dict[str, Any]] = None,
    ) -> Optional[Dict[str, Any]]:
        try:
            url = f"{self.base_url}/{endpoint}"
            response = requests.request(
                method=metodo,
                url=url,
                auth=self.auth,
                params=params,
                timeout=30,
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"Erro ao chamar Sienge API: {e}")
            return None

    def listar_empreendimentos(self) -> List[Dict[str, Any]]:
        """Lista todos os empreendimentos cadastrados no Sienge"""
        resultado = self._fazer_requisicao("GET", "empreendimentos")
        if resultado and "data" in resultado:
            return resultado["data"]
        return []

    def obter_eap_empreendimento(self, id_empreendimento: str) -> List[Dict[str, Any]]:
        """Obtém a EAP (Estrutura Analítica de Projeto) de um empreendimento

        Retorna a hierarquia de serviços/fases do empreendimento
        """
        resultado = self._fazer_requisicao(
            "GET",
            f"empreendimentos/{id_empreendimento}/eap",
        )
        if resultado and "data" in resultado:
            return resultado["data"]
        return []


sienge_client = SiengeClient()
