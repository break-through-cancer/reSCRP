install:
	npm install
build:
	docker build -t reSCRP .
build-and-push:
	docker buildx build --push --platform linux/amd64,linux/arm64 -t edit01/rescrp  .
docker-compose-up:
	docker compose -f ./docker-compose-dev.yml --env-file .env up --build
docker-compose-up-watch:
	docker compose -f ./docker-compose-dev.yml --env-file .env up --watch
connect:
	docker run -it --network rescrp_default --rm -v $(PWD)/data:/data mariadb mariadb --host scrp-mariadb --port 3306 --user root --password  --database tcm
load-data:
	# docker compose exec db bash
	docker compose exec -T db mariadb -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASS $DB_NAME < load_data.sql
	# Then Run
	# mariadb -ptest --database tcm < load_data.sql
connect-mariadb:
	docker compose -f ./docker-compose-dev.yml exec db mariadb -ptest --database tcm
