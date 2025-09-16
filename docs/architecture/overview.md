# Architecture Overview

reSCRP follows a modular, web-based architecture designed for scalability and extensibility.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Browser   │    │   Load Balancer │    │   File Storage  │
│                 │    │   (Optional)    │    │   (Data Files)  │
└─────────┬───────┘    └─────────┬───────┘    └─────────────────┘
          │                      │
          │ HTTP/HTTPS           │
          │                      │
┌─────────▼───────────────────────▼─────────┐
│              reSCRP Application           │
│  ┌─────────────────────────────────────┐  │
│  │           Web Server                │  │
│  │        (Express.js)                 │  │
│  └─────────────────────────────────────┘  │
│  ┌─────────────────────────────────────┐  │
│  │         Route Handlers              │  │
│  │    ┌───────┐ ┌───────┐ ┌───────┐   │  │
│  │    │  TCM  │ │ Module│ │ Module│   │  │
│  │    │Module │ │   2   │ │   N   │   │  │
│  │    └───────┘ └───────┘ └───────┘   │  │
│  └─────────────────────────────────────┘  │
│  ┌─────────────────────────────────────┐  │
│  │         Data Layer                  │  │
│  │  ┌─────────────────────────────────┐│  │
│  │  │      SQL Connection Pool       ││  │
│  │  └─────────────────────────────────┘│  │
│  └─────────────────────────────────────┘  │
└───────────────────┬───────────────────────┘
                    │
                    │ SQL Queries
                    │
┌───────────────────▼───────────────────┐
│           MariaDB Database            │
│  ┌─────────────────────────────────┐  │
│  │        TCM Schema               │  │
│  │  ┌─────────┐ ┌─────────┐       │  │
│  │  │   EXP   │ │  Meta   │       │  │
│  │  │ Tables  │ │ Tables  │       │  │
│  │  └─────────┘ └─────────┘       │  │
│  │  ┌─────────┐                   │  │
│  │  │   DEG   │                   │  │
│  │  │ Tables  │                   │  │
│  │  └─────────┘                   │  │
│  └─────────────────────────────────┘  │
└───────────────────────────────────────┘
```

## Core Components

### 1. Web Server (Express.js)
- **Purpose**: HTTP request handling and response generation
- **Features**:
  - Static file serving
  - Template rendering (Jade)
  - Security middleware (Helmet, HSTS)
  - Request logging (Morgan)

### 2. Modular Route System
- **Study Modules**: Self-contained analysis modules (e.g., TCM)
- **Dynamic Loading**: Modules enabled via configuration
- **Extensible**: Easy to add new study types

### 3. Database Layer
- **Connection Pooling**: Efficient database connections
- **Multiple Databases**: Support for module-specific databases
- **Transaction Support**: Data consistency

### 4. Data Processing Pipeline
- **R Scripts**: Single-cell analysis preprocessing
- **File I/O**: TSV/CSV data import/export
- **Batch Processing**: Large dataset handling

## Technology Stack

### Backend
| Component | Technology | Purpose |
|-----------|------------|---------|
| **Runtime** | Node.js | JavaScript server environment |
| **Framework** | Express.js | Web application framework |
| **Database** | MariaDB | Relational data storage |
| **Templates** | Jade | Server-side rendering |
| **Security** | Helmet + HSTS | Security headers and HTTPS |

### Frontend
| Component | Technology | Purpose |
|-----------|------------|---------|
| **Visualization** | D3.js | Interactive charts and plots |
| **UI Framework** | Custom CSS/JS | User interface |
| **AJAX** | Native Fetch | Asynchronous data loading |

### Data Processing
| Component | Technology | Purpose |
|-----------|------------|---------|
| **Analysis** | R + Seurat | Single-cell RNA analysis |
| **File Format** | TSV/CSV | Data interchange |
| **Scripts** | R Scripts | Preprocessing pipelines |

### Infrastructure
| Component | Technology | Purpose |
|-----------|------------|---------|
| **Containerization** | Docker | Application packaging |
| **Orchestration** | Docker Compose | Multi-container deployment |
| **Environment** | dotenv | Configuration management |

## Module Architecture

### Study Module Structure
```
study_module/
├── conf/
│   └── {module}conf.js          # Configuration
├── SQL/
│   └── {module}/
│       ├── pool.js              # Database connection
│       └── queries.js           # SQL queries
├── routes/
│   └── {module}/
│       ├── index.js             # Route definitions
│       └── handlers.js          # Request handlers
├── views/
│   └── {module}/
│       ├── layout.jade          # Page templates
│       └── components/          # UI components
├── public/
│   └── {module}/
│       ├── css/                 # Stylesheets
│       ├── js/                  # Client-side scripts
│       └── images/              # Static assets
└── utils/
    └── {module}/
        └── helpers.js           # Utility functions
```

### Module Registration
```javascript
// study_modules.js
module.exports = {
  tcm: {
    name: "T-Cell Map",
    description: "Single-cell T-cell analysis",
    version: "1.0.0",
    enabled: true
  }
};
```

## Data Flow

### 1. Request Processing
```
Browser Request
    ↓
Express Router
    ↓
Module Route Handler
    ↓
Database Query
    ↓
Data Processing
    ↓
Response Generation
    ↓
Browser Response
```

### 2. Data Pipeline
```
Raw scRNA-seq Data (RDS)
    ↓
R Preprocessing Script
    ↓
TSV Files (Expression + Metadata)
    ↓
Database Loading (SQL)
    ↓
Web Application Access
```

## Security Architecture

### 1. Application Security
- **Helmet.js**: Security headers
- **HSTS**: HTTPS enforcement
- **Input Validation**: SQL injection prevention
- **Environment Variables**: Secrets management

### 2. Database Security
- **Connection Pooling**: Resource management
- **Prepared Statements**: SQL injection prevention
- **User Permissions**: Least privilege access

### 3. Network Security
- **SSL/TLS**: Encrypted communication
- **Reverse Proxy**: Optional SSL termination
- **Container Isolation**: Docker security

## Scalability Considerations

### Horizontal Scaling
- **Load Balancers**: Multiple application instances
- **Database Clustering**: MariaDB Galera
- **Stateless Design**: Session-free architecture

### Vertical Scaling
- **Connection Pools**: Database optimization
- **Caching**: In-memory data caching
- **Index Optimization**: Database performance

### Performance Optimization
- **Database Indexes**: Query performance
- **Compressed Responses**: Bandwidth optimization
- **Static Asset CDN**: Content delivery

## Extension Points

### Adding New Modules
1. Create module directory structure
2. Implement route handlers
3. Define database schema
4. Add configuration
5. Register in `study_modules.js`

### Custom Visualizations
1. Add D3.js components
2. Create API endpoints
3. Implement data formatters
4. Add UI controls

### External Integrations
1. REST API development
2. Data export functionality
3. Third-party tool connectors
4. Webhook support