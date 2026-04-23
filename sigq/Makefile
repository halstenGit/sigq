.PHONY: help setup setup-backend setup-frontend db-up db-down migrate dev test lint

help:
	@echo "SIGQ - Comandos disponíveis:"
	@echo ""
	@echo "Setup:"
	@echo "  make setup              - Setup completo (backend + frontend)"
	@echo "  make setup-backend      - Setup do backend"
	@echo "  make setup-frontend     - Setup do frontend"
	@echo ""
	@echo "Desenvolvimento:"
	@echo "  make dev                - Inicia backend + frontend (em paralelo)"
	@echo "  make dev-backend        - Inicia backend apenas"
	@echo "  make dev-frontend       - Inicia frontend apenas"
	@echo ""
	@echo "Database:"
	@echo "  make db-up              - Inicia PostgreSQL (Docker)"
	@echo "  make db-down            - Para PostgreSQL"
	@echo "  make migrate            - Roda migrations do Alembic"
	@echo "  make migrate-new        - Cria nova migration"
	@echo ""
	@echo "Testes e qualidade:"
	@echo "  make test               - Roda testes (backend)"
	@echo "  make lint               - Lint e format check"
	@echo "  make format             - Auto-format código"
	@echo ""

setup: setup-backend setup-frontend

setup-backend:
	@echo "🔧 Setup Backend..."
	cd backend && \
	python -m venv venv && \
	. venv/bin/activate && \
	pip install -e ".[dev]" && \
	cp .env.example .env && \
	echo "✅ Backend setup concluído!"

setup-frontend:
	@echo "🔧 Setup Frontend..."
	cd frontend && \
	npm install && \
	cp .env.example .env && \
	echo "✅ Frontend setup concluído!"

db-up:
	@echo "🐘 Iniciando PostgreSQL..."
	docker-compose up -d postgres
	@echo "✅ PostgreSQL rodando em localhost:5432"
	@echo "Credenciais: sigq / sigq-dev-password"

db-down:
	@echo "🛑 Parando PostgreSQL..."
	docker-compose down

migrate:
	@echo "📦 Rodando migrations..."
	cd backend && . venv/bin/activate && alembic upgrade head

migrate-new:
	@echo "📝 Criando nova migration..."
	@read -p "Descrição da migration: " desc; \
	cd backend && . venv/bin/activate && alembic revision --autogenerate -m "$$desc"

dev:
	@echo "🚀 Iniciando SIGQ (backend + frontend)..."
	@echo "Backend: http://localhost:8000"
	@echo "Frontend: http://localhost:5173"
	@echo "Docs: http://localhost:8000/docs"
	@echo ""
	@(cd backend && . venv/bin/activate && uvicorn app.main:app --reload) & \
	(cd frontend && npm run dev) & \
	wait

dev-backend:
	@echo "🐍 Backend em http://localhost:8000"
	cd backend && . venv/bin/activate && uvicorn app.main:app --reload

dev-frontend:
	@echo "⚛️  Frontend em http://localhost:5173"
	cd frontend && npm run dev

test:
	@echo "🧪 Rodando testes..."
	cd backend && . venv/bin/activate && pytest

test-cov:
	@echo "📊 Testes com coverage..."
	cd backend && . venv/bin/activate && pytest --cov=app

lint:
	@echo "🔍 Lint..."
	cd backend && . venv/bin/activate && ruff check . && black --check .

format:
	@echo "✨ Formatando código..."
	cd backend && . venv/bin/activate && black . && ruff check --fix .
