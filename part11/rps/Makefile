# =========== Prod specific commands ===========

prod:
	docker compose -f docker-compose.prod.yml up -d --build

# =========== Build commands ===========

build:
	docker compose -f docker-compose.dev.yml up -d --build

start:
	docker compose -f docker-compose.dev.yml up -d

down:
	docker compose down

restart: down start

install:
	cd backend && yarn install
	cd frontend && yarn install

ci:
	cd backend && yarn install --frozen-lockfile
	cd frontend && yarn install --frozen-lockfile

compile-ts:
	cd backend && yarn build
	cd frontend && yarn build

# =========== Utility commands ===========

lint:
	cd backend && yarn lint
	cd frontend && yarn lint

logs:
	docker compose logs -f
