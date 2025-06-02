1. Move from hardcoded self-signed SSL configuration to user-provided config
    We should default to running the application under HTTP. So we can have 
    the following SSL options:
    a. A self-signed SSL cert config via app.js code
    b. Plain http but able to run app behind a LB/proxy like NGINX/Traefik 
    which will handle SSL via LetsEncrypt or via self-signed SSL cert.
2. Move to app factory pattern to improve flexibility
    a. Production/Development/Testing modes
    b. Add support for dotenv
3. Add basic testing suite
    a. Jest
