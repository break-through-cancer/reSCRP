# Troubleshooting

Common issues and solutions for reSCRP deployment and usage.

## Installation Issues

### Docker Issues

#### Docker Compose Fails to Start
```bash
# Check Docker status
docker --version
docker compose --version

# Common fixes
sudo systemctl start docker    # Linux
sudo service docker start     # Linux (older)

# Check for port conflicts
lsof -i :3000
lsof -i :3306
```

#### Permission Denied Errors
```bash
# Fix Docker permissions (Linux)
sudo usermod -aG docker $USER
newgrp docker

# Fix file permissions
sudo chown -R $USER:$USER .
chmod -R 755 .
```

#### Container Build Failures
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker compose build --no-cache

# Check disk space
df -h
docker system df
```

### Database Connection Issues

#### Cannot Connect to MariaDB
```bash
# Check if MariaDB container is running
docker ps | grep mariadb

# Check container logs
docker logs scrp-mariadb

# Test connection manually
docker run -it --network rescrp_default --rm mariadb \
  mariadb --host scrp-mariadb --port 3306 --user root --password

# Common solutions:
# 1. Verify .env database credentials
# 2. Wait for database initialization (can take 1-2 minutes)
# 3. Check network connectivity
```

#### Database Connection Timeouts
```bash
# Increase connection timeout in .env
DB_CONN_LIMIT=200

# Check database server status
docker exec scrp-mariadb mysqladmin status -u root -p

# Monitor connections
docker exec scrp-mariadb mysqladmin processlist -u root -p
```

#### Tables Not Found
```sql
-- Check if tables exist
SHOW TABLES;

-- Recreate tables if missing
SOURCE scripts/create_tcm_tables.sql;

-- Load sample data
SOURCE scripts/load_data.sql;
```

### Application Startup Issues

#### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change port in .env
PORT=3001
```

#### Environment Variable Issues
```bash
# Verify .env file exists
ls -la .env

# Check environment loading
docker compose config

# Common issues:
# 1. Missing .env file
# 2. Syntax errors in .env
# 3. Missing required variables
```

#### Module Loading Failures
```bash
# Check module configuration
cat study_modules.js

# Verify module files exist
ls -la routes/tcm/
ls -la SQL/TCM/

# Check enabled modules in .env
grep MODULES .env
```

## Runtime Issues

### Web Interface Problems

#### Page Not Loading
1. **Check application status**
   ```bash
   docker compose ps
   curl http://localhost:3000
   ```

2. **Check browser console** for JavaScript errors

3. **Verify module is enabled**
   ```bash
   grep MODULES .env
   ```

#### Slow Page Loading
1. **Check database performance**
   ```sql
   SHOW PROCESSLIST;
   SHOW ENGINE INNODB STATUS;
   ```

2. **Monitor container resources**
   ```bash
   docker stats
   ```

3. **Check for missing indexes**
   ```sql
   SHOW INDEX FROM CD4_EXP;
   SHOW INDEX FROM CD4_meta;
   ```

#### Visualization Not Rendering
1. **Check browser console** for JavaScript errors
2. **Verify data exists**
   ```sql
   SELECT COUNT(*) FROM CD4_meta;
   SELECT COUNT(*) FROM CD4_EXP;
   ```
3. **Check D3.js library loading**

### Data Issues

#### No Data Visible
1. **Verify data was loaded**
   ```sql
   -- Check record counts
   SELECT 'CD4_meta' as table_name, COUNT(*) as count FROM CD4_meta
   UNION ALL
   SELECT 'CD4_EXP', COUNT(*) FROM CD4_EXP
   UNION ALL
   SELECT 'CD8_meta', COUNT(*) FROM CD8_meta
   UNION ALL
   SELECT 'CD8_EXP', COUNT(*) FROM CD8_EXP;
   ```

2. **Check data format**
   ```sql
   -- Sample data inspection
   SELECT * FROM CD4_meta LIMIT 5;
   SELECT * FROM CD4_EXP LIMIT 5;
   ```

3. **Verify cell type mappings**
   ```sql
   SELECT CellClusterType, COUNT(*) as count
   FROM CD4_meta
   GROUP BY CellClusterType;
   ```

#### Gene Search Not Working
1. **Check gene names in database**
   ```sql
   SELECT DISTINCT Marker FROM CD4_EXP WHERE Marker LIKE 'CD4%';
   ```

2. **Verify expression data exists**
   ```sql
   SELECT COUNT(*) FROM CD4_EXP WHERE Marker = 'CD4' AND EXP > 0;
   ```

3. **Check for case sensitivity**
   ```sql
   SELECT DISTINCT Marker FROM CD4_EXP WHERE UPPER(Marker) = 'CD4';
   ```

#### Missing Cell Types
1. **Check cell type annotations**
   ```sql
   SELECT DISTINCT CellClusterType FROM CD4_meta;
   ```

2. **Verify preprocessing completed**
   ```bash
   ls -la *_meta_*.tsv
   ls -la *_EXP_*.tsv
   ```

3. **Check R script logs** for preprocessing errors

## Performance Issues

### Slow Queries

#### Identify Slow Queries
```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- Check current queries
SHOW PROCESSLIST;
```

#### Common Query Optimizations
```sql
-- Add missing indexes
CREATE INDEX idx_exp_marker ON CD4_EXP(Marker);
CREATE INDEX idx_exp_barcode ON CD4_EXP(Barcode);

-- Analyze tables
ANALYZE TABLE CD4_EXP;
ANALYZE TABLE CD4_meta;

-- Check index usage
EXPLAIN SELECT * FROM CD4_EXP WHERE Marker = 'CD4';
```

### Memory Issues

#### Container Out of Memory
```bash
# Check memory usage
docker stats --no-stream

# Increase Docker memory limits
# Edit docker-compose.yml:
services:
  app:
    mem_limit: 2g
  mariadb:
    mem_limit: 4g
```

#### Database Memory Tuning
```bash
# Add to docker-compose.yml mariadb service
command: >
  --innodb-buffer-pool-size=2G
  --max-connections=500
  --query-cache-size=256M
```

### Disk Space Issues

#### Check Disk Usage
```bash
# System disk space
df -h

# Docker disk usage
docker system df

# Database size
docker exec scrp-mariadb du -sh /var/lib/mysql
```

#### Clean Up Space
```bash
# Remove unused Docker objects
docker system prune -a

# Remove old logs
docker compose logs --tail=0 app > /dev/null

# Archive old data files
tar -czf backup_$(date +%Y%m%d).tar.gz *.tsv
```

## Data Processing Issues

### R Script Failures

#### Missing R Packages
```bash
# Check R installation
docker run --rm -it r-base:latest R --version

# Install required packages
R -e "install.packages(c('Seurat', 'tidyverse', 'data.table'))"
```

#### Memory Issues in R
```r
# Check memory usage
gc()
memory.limit()

# Optimize memory usage
options(future.globals.maxSize = 8000 * 1024^2)  # 8GB
```

#### File Path Issues
```r
# Check file existence
file.exists("/path/to/data.rds")

# Check permissions
file.access("/path/to/data.rds", mode = 4)

# Use absolute paths
BASE_DIR <- normalizePath("/full/path/to/data")
```

### Data Loading Issues

#### TSV Import Failures
```bash
# Check file format
head -5 CD4_meta_2024-01-01.tsv
file CD4_meta_2024-01-01.tsv

# Check for encoding issues
file -bi CD4_meta_2024-01-01.tsv

# Manual import with error checking
mysql -u root -p tcm -e "
LOAD DATA LOCAL INFILE 'CD4_meta_2024-01-01.tsv'
INTO TABLE CD4_meta
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;"
```

#### Character Encoding Issues
```bash
# Convert encoding if needed
iconv -f UTF-8 -t UTF-8//IGNORE input.tsv > output.tsv

# Check for special characters
grep -P '[^\x00-\x7F]' input.tsv
```

## Network Issues

### SSL/TLS Problems

#### Certificate Errors
```bash
# Check certificate validity
openssl x509 -in cert.pem -text -noout

# Verify certificate chain
openssl verify -CAfile ca.pem cert.pem

# Test SSL connection
openssl s_client -connect localhost:443 -servername localhost
```

#### Mixed Content Warnings
```javascript
// Ensure HTTPS resources in templates
// Change:
src="http://d3js.org/d3.v3.min.js"
// To:
src="https://d3js.org/d3.v3.min.js"
```

### Proxy Configuration

#### Reverse Proxy Issues
```nginx
# NGINX configuration
server {
    listen 443 ssl;
    server_name your-domain.com;

    # SSL configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Proxy settings
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket support (if needed)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## Getting Help

### Collecting Debug Information

1. **System Information**
   ```bash
   # OS and versions
   uname -a
   docker --version
   docker compose --version
   node --version
   ```

2. **Application Logs**
   ```bash
   # All service logs
   docker compose logs > debug_logs.txt

   # Specific service logs
   docker compose logs app > app_logs.txt
   docker compose logs mariadb > db_logs.txt
   ```

3. **Configuration**
   ```bash
   # Environment (remove sensitive data)
   docker compose config > config_dump.yml

   # Database schema
   docker exec scrp-mariadb mysqldump --no-data -u root -p tcm > schema.sql
   ```

### Reporting Issues

When reporting issues, include:

1. **Environment details** (OS, Docker version, etc.)
2. **Steps to reproduce** the problem
3. **Expected vs actual behavior**
4. **Relevant log files** (sanitized)
5. **Configuration files** (without secrets)

### Community Resources

- **GitHub Issues**: [https://github.com/break-through-cancer/reSCRP/issues](https://github.com/break-through-cancer/reSCRP/issues)
- **Documentation**: This documentation site
- **Docker Hub**: For container-related issues