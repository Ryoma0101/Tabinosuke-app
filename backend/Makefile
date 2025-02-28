.PHONY: dev-env
dev-env:
	cp .env.dev .env

.PHONY: dev-build
dev-build:
	docker compose -f docker-compose-dev.yml build

.PHONY: dev-build--no-cache
dev-build--no-cache:
	docker compose -f docker-compose-dev.yml build --no-cache

.PHONY: up
up:
	docker compose -f docker-compose-dev.yml up

.PHONY: dev-up-d
dev-up-d:
	docker compose -f docker-compose-dev.yml up -d

.PHONY: dev
dev:
	@make dev-build
	@make dev-up-d

.PHONY: down
down:
	docker compose -f docker-compose-dev.yml down

#.PHONY: prod-build
#prod-build:
#	docker compose -f docker-compose-prod.yml build
#
#.PHONY: prod-up-d
#prod-up-d:
#	docker compose -f docker-compose-prod.yml up -d
#
#.PHONY: prod
#prod:
#	@make prod-build
#	@make prod-up-d
#
#.PHONY: prod-down
#prod-down:
#	docker compose -f docker-compose-prod.yml down

.PHONY: logs
logs:
	docker compose -f docker-compose-dev.yml logs -f

.PHONY: stop
stop:
	docker compose -f docker-compose-dev.yml stop

.PHONY: prod-logs
prod-logs:
	docker compose -f docker-compose-prod.yml logs -f

.PHONY: test
test:
	docker compose -f docker-compose-dev.yml exec django python manage.py test

.PHONY: black
black:
	docker compose -f docker-compose-dev.yml exec django black .

.PHONY: isort
isort:
	docker compose -f docker-compose-dev.yml exec django isort .

.PHONY: flake8
flake8:
	docker compose -f docker-compose-dev.yml exec django flake8 .

.PHONY: lint
lint:
	@make black
	@make isort
	@make flake8
# テストデータの追加
.PHONY: fixtures
fixtures:
	docker compose -f docker-compose-dev.yml exec django python manage.py loaddata --format yaml \
	accounts/fixtures/users.yaml \
	campuses/fixtures/campuses.yaml \
	campuses/fixtures/universities.yaml \
	items/fixtures/items.yaml \
	notifications/fixtures/notifications.yaml 
# djangoのコンテナのターミナルに入るコマンド
.PHONY: exec
exec:
	docker compose -f docker-compose-dev.yml exec django bash