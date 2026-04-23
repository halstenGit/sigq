from fastapi import HTTPException, status
from typing import Optional, Any, Dict


class APIException(HTTPException):
    """Base exception for API errors"""

    def __init__(
        self,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail: str = "Internal Server Error",
        headers: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(status_code=status_code, detail=detail, headers=headers)


class NotFoundException(APIException):
    """Resource not found"""

    def __init__(self, detail: str = "Recurso não encontrado"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class BadRequestException(APIException):
    """Invalid request"""

    def __init__(self, detail: str = "Requisição inválida"):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)


class UnauthorizedException(APIException):
    """Authentication required"""

    def __init__(self, detail: str = "Autenticação necessária"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )


class ForbiddenException(APIException):
    """Access denied"""

    def __init__(self, detail: str = "Acesso negado"):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


class ConflictException(APIException):
    """Resource conflict"""

    def __init__(self, detail: str = "Conflito de recurso"):
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=detail)


class InternalServerError(APIException):
    """Internal server error"""

    def __init__(self, detail: str = "Erro interno do servidor"):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=detail
        )
