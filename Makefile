up:
	docker-compose up --build --force-recreate
up-prod:
	docker-compose -f docker-compose.production.yml up --build --force-recreate