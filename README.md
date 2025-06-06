### reSCRP changes
1. Moved from hardcoded self-signed SSL configuration to user-provided config We should default to running the application under HTTP. So we can have the following SSL options: 
    - A self-signed SSL cert config via app.js code
    - Plain http but able to run app behind a LB/proxy like NGINX/Traefik which will handle SSL via LetsEncrypt or via self-signed SSL cert.
2. Added support for dotenv
    - All secrets read from ENVIRONMENT variables via .env
        - SSL certs
        - DB credentials
    - Production/Development/Testing modes
3. Add basic testing suite
    a. Jest


Clone this repo
```sh
npm install
- OR - 
make install 
```

Setup .env.example file, rename to .env
```sh
# See ENVIRONMENT VARIABLES SECTION BELOW
cp .env.example ./.env
```

```sh
docker compose --env-file .env up --build
- OR -
make docker-compose-up
press w to watch for changes
```

Connect to the database via mariadb CLI client
```sh
make connect
- OR -
docker run -it --network rescrp_default --rm mariadb mariadb --host scrp-mariadb --port 3306 --user root --password  --database tcm
```

## Environment Variables
See .env.example file

| Var | Type | Default | Example | Notes
| -------- | ------- | ------- | ------- | ------- | 
| PORT | int | 3000 |
| MODULES | string || 'tcm' |
| DB_HOST | string || 127.0.0.1 | NotImplemented |
| DB_USER | string ||| NotImplemented |
| DB_PASSWORD | string ||| NotImplemented |
| DB_CONN_LIMIT | int || 100 | NotImplemented |
| DB_HOST_TCM | string ||
| DB_USER_TCM | string ||
| DB_PASSWORD_TCM | string ||
| DB_DATABASE_TCM | string ||tcm|
| SSL_ENABLED | bool | false ||
| SSL_KEY | string | | Path to keyfile |
| SSL_CERT | string | | Path to certfile |
| SSL_CA | string | | Path to CAfile |
| SSL_PASSPHRASE | string || password|


### To add a new study module: STEPS

#### Data Checklist:
- Data Prep Script
    - Run R Script to wrangle RDS files
- Database creation
    - Run SQL against the mariadb
- Data loading
    - Run SQL against the mariadb

#### SCRP Checklist:
- Create conf/<STUDY_MODULE>conf.js
- Create SQL/<STUDY_MODULE>pool.js & SQLMapping
- Create Routes/<STUDY_MODULE>
- Create views/<STUDY_MODULE>
- Create optional public/<STUDY_MODULE> assets
- Create optional utils/<STUDY_MODULE>
- Add routes object to app.js
- Add study metadata to study_module.js
- Enable the study module in .env under the MODULES= property

