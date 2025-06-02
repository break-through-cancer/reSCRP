install:
	npm install
build:
	docker build -t re-scrp .
services:
	docker compose --env-file .env up
