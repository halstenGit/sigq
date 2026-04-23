"""Prevision Cronograma API integration

API: GraphQL
Autenticação: Token Bearer (PREVISION_TOKEN)

Este módulo fornece acesso ao cronograma e atividades do Prevision
"""

import httpx
from typing import Any, Dict, List, Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class PrevisionClient:
    def __init__(self):
        self.base_url = settings.PREVISION_API_URL
        self.token = settings.PREVISION_TOKEN

    def _fazer_query(
        self,
        query: str,
        variables: Optional[Dict[str, Any]] = None,
    ) -> Optional[Dict[str, Any]]:
        try:
            headers = {
                "Authorization": f"Bearer {self.token}",
                "Content-Type": "application/json",
            }
            payload = {
                "query": query,
                "variables": variables or {},
            }
            with httpx.Client(timeout=30) as client:
                response = client.post(self.base_url, json=payload, headers=headers)
                response.raise_for_status()
                resultado = response.json()
                if "errors" in resultado:
                    logger.error(f"GraphQL error: {resultado['errors']}")
                    return None
                return resultado.get("data")
        except Exception as e:
            logger.error(f"Erro ao chamar Prevision API: {e}")
            return None

    def listar_projetos(self) -> List[Dict[str, Any]]:
        """Lista todos os projetos cadastrados no Prevision"""
        query = """
            query {
                projetos {
                    id
                    nome
                    descricao
                    dataInicio
                    dataFim
                }
            }
        """
        resultado = self._fazer_query(query)
        if resultado and "projetos" in resultado:
            return resultado["projetos"]
        return []

    def listar_atividades(self, id_projeto: str) -> List[Dict[str, Any]]:
        """Lista as atividades de um projeto específico"""
        query = """
            query($idProjeto: String!) {
                projeto(id: $idProjeto) {
                    atividades {
                        id
                        nome
                        descricao
                        dataInicio
                        dataFim
                        status
                    }
                }
            }
        """
        resultado = self._fazer_query(query, {"idProjeto": id_projeto})
        if resultado and "projeto" in resultado and "atividades" in resultado["projeto"]:
            return resultado["projeto"]["atividades"]
        return []


prevision_client = PrevisionClient()
