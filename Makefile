install:
	npm install
build:
	docker build -t re-scrp .
docker-compose-up:
	docker compose --env-file .env up --build
docker-compose-up-watch:
	docker compose --env-file .env up --watch
connect:
	docker run -it --network rescrp_default --rm -v $(PWD)/data:/data mariadb mariadb --host scrp-mariadb --port 3306 --user root --password  --database tcm
load-data:
	docker compose exec db bash
	# Then Run
	# mariadb -ptest --database tcm < load_data.sql
connect-mariadb:
	docker compose exec db mariadb -ptest --database tcm
