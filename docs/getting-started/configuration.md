# Configuration

This page covers all configuration options available in reSCRP.

## Environment Variables

All configuration is managed through environment variables in the `.env` file.

### Application Settings

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `PORT` | integer | `3000` | Port for the web server |
| `MODULES` | string | `tcm` | Comma-separated list of enabled study modules |

### Database Configuration

#### TCM Module Database
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `DB_HOST_TCM` | string | Yes | Database hostname |
| `DB_USER_TCM` | string | Yes | Database username |
| `DB_PASSWORD_TCM` | string | Yes | Database password |
| `DB_DATABASE_TCM` | string | Yes | Database name |
| `DB_CONN_LIMIT` | integer | No | Connection pool limit (default: 100) |

#### General Database (Future Use)
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `DB_HOST` | string | No | General database hostname |
| `DB_USER` | string | No | General database username |
| `DB_PASSWORD` | string | No | General database password |

### SSL Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `SSL_ENABLED` | boolean | `false` | Enable HTTPS |
| `SSL_KEY` | string | - | Path to SSL private key file |
| `SSL_CERT` | string | - | Path to SSL certificate file |
| `SSL_CA` | string | - | Path to SSL CA file (optional) |
| `SSL_PASSPHRASE` | string | - | SSL key passphrase (optional) |

## Study Modules

### Enabling Modules

Modules are enabled through the `MODULES` environment variable:

```env
# Single module
MODULES=tcm

# Multiple modules (future)
MODULES=tcm,bcr,other
```

### TCM Module Configuration

The T-Cell Map (TCM) module requires:

1. **Database with TCM schema**
2. **Preprocessed single-cell data**
3. **Proper file permissions for data access**

## SSL/TLS Setup

### Development (HTTP)
For local development, disable SSL:

```env
SSL_ENABLED=false
```

### Production (HTTPS)

```env
SSL_ENABLED=true
SSL_KEY=/path/to/private.key
SSL_CERT=/path/to/certificate.crt
SSL_CA=/path/to/ca-bundle.crt
```

## Database Configuration

### Connection Settings

```env
# For Docker Compose setup
DB_HOST_TCM=scrp-mariadb
DB_USER_TCM=root
DB_PASSWORD_TCM=secure_password
DB_DATABASE_TCM=tcm

# For external database
DB_HOST_TCM=your-db-server.com
DB_USER_TCM=scrp_user
DB_PASSWORD_TCM=secure_password
DB_DATABASE_TCM=tcm_production
DB_CONN_LIMIT=50
```
