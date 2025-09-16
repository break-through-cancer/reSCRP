# Data Processing Overview

This section covers how reSCRP processes single-cell RNA sequencing data from raw files to scrp-module format.

## Processing Pipeline

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Raw Data      │    │  Preprocessing  │    │   Database      │
│                 │    │                 │    │                 │
│ • Seurat RDS    │───▶│ • R Scripts     │───▶│ • MariaDB       │
│ • Metadata      │    │ • Filtering     │    │                 │
│ • Annotations   │    │ • Normalization │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                  │                       │
                                  │                       │
                                  ▼                       ▼
                         ┌─────────────────┐    ┌─────────────────┐
                         │   TSV Export    │    │  Web Interface  │
                         │                 │    │                 │
                         │ • Expression    │    │ • Interactive   │
                         │ • Metadata      │    │                 │
                         │ • Gene Lists    │    │                 │
                         └─────────────────┘    └─────────────────┘
```

## Data Sources

### Input Data Types

#### 1. Seurat Objects (RDS files)
```r
# Example clustered Seurat object structure
seurat_obj
├── @assays
│   └── RNA
│       ├── counts      # Raw count matrix
│       ├── data        # Normalized expression
│       └── scale.data  # Scaled expression
├── @meta.data
│   ├── seurat_clusters # Cluster assignments
│   ├── Patient         # Clinical metadata
│   ├── TissueType      # Sample information
│   └── CancerType      # Disease classification
└── @reductions
    └── umap            # Dimensionality reduction
        └── embeddings  # 2D coordinates
```

#### 2. Differential Expression Results
```r
# DEG analysis output format
deg_results
├── p_val          # Statistical significance
├── avg_logFC      # Log fold change
├── pct.1          # Expression percentage in cluster
├── pct.2          # Expression percentage in others
├── p_val_adj      # Multiple testing correction
├── cluster        # Cluster identifier
└── gene           # Gene symbol
```

#### 3. Clinical Metadata
```r
# Required metadata columns
metadata
├── Patient        # Patient identifier
├── Sample         # Sample identifier
├── TissueType     # Tumor/Normal/etc
├── CancerType     # Disease type
├── OrganSite      # Anatomical location
└── Disease        # Specific diagnosis
```

## Preprocessing Workflow

### 1. Data Loading and Validation

The preprocessing script performs several steps:

*** Work in progress ***



## Database Schema

### Expression Tables
```sql
CREATE TABLE {CellType}_EXP (
    Barcode TEXT NOT NULL,     -- Cell identifier
    Marker TEXT NOT NULL,      -- Gene symbol
    EXP DOUBLE NOT NULL,       -- Normalized expression
    INDEX idx_marker_barcode (Marker, Barcode),
    INDEX idx_barcode_marker (Barcode, Marker)
);
```

### Metadata Tables
```sql
-- Full metadata schema
CREATE TABLE {CellType}_meta (
    Barcode TEXT PRIMARY KEY,
    TissueType TEXT,
    CancerType TEXT,
    Patient TEXT,
    Sample TEXT,
    CellClusterType TEXT,
    UMAP1 DOUBLE,
    UMAP2 DOUBLE
);

-- Simplified schema (for subsets)
CREATE TABLE {Subset}_meta (
    Barcode TEXT PRIMARY KEY,
    UMAP1 DOUBLE,
    UMAP2 DOUBLE,
    CellClusterType TEXT
);
```

### DEG Tables
```sql
CREATE TABLE {CellType}_DEG (
    p_val DOUBLE,
    avg_logFC DOUBLE,
    pct1 DOUBLE,
    pct2 DOUBLE,
    p_val_adj DOUBLE,
    cluster TEXT,
    gene TEXT
);
```


## Output Formats

### TSV Files
- **Expression**: `{CellType}_EXP_{Date}.tsv`
- **Metadata**: `{CellType}_meta_{Date}.tsv`
