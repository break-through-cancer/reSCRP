install:
	npm install
build:
	docker build -t re-scrp .
docker-compose-up:
	docker compose --env-file .env up
docker-compose-up-watch:
	docker compose --env-file .env up --watch
connect:
	docker run -it --network rescrp_default --rm mariadb mariadb --host scrp-mariadb --port 3306 --user root --password  --database tcm
