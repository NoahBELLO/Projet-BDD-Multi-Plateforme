# Commandes Makefile pour le projet BDD Multi-Plateforme

up:
	cd ./environnement && docker compose up --build -d

down:
	cd ./environnement && docker compose down

logs:
	cd ./environnement && docker compose logs -f

ps:
	cd ./environnement && docker compose ps

restart:
	cd ./environnement && docker compose restart

frontend-test:
	cd frontend && ng test

clean:
	cd ./environnement && docker compose down -v
	docker system prune -f