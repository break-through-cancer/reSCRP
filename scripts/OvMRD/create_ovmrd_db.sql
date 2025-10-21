-- =============================================
-- OvMRD (Ovarian MRD) Database Schema
-- =============================================
-- This script creates the database schema for storing ovarian cancer minimal
-- residual disease analysis data including expression data, metadata, and
-- differential expression genes for different cell types.

-- Clean up existing tables
-- ======================
DROP TABLE IF EXISTS BPlasma_EXP;
DROP TABLE IF EXISTS CD4T_EXP;
DROP TABLE IF EXISTS CD8T_EXP;
DROP TABLE IF EXISTS Myeloid_EXP;
DROP TABLE IF EXISTS NK_EXP;
DROP TABLE IF EXISTS TNK_EXP;

DROP TABLE IF EXISTS BPlasma_meta;
DROP TABLE IF EXISTS CD4T_meta;
DROP TABLE IF EXISTS CD8T_meta;
DROP TABLE IF EXISTS Myeloid_meta;
DROP TABLE IF EXISTS NK_meta;
DROP TABLE IF EXISTS TNK_meta;
DROP TABLE IF EXISTS ALL_meta;

DROP TABLE IF EXISTS BPlasma_DEG;
DROP TABLE IF EXISTS CD4T_DEG;
DROP TABLE IF EXISTS CD8T_DEG;
DROP TABLE IF EXISTS Myeloid_DEG;
DROP TABLE IF EXISTS NK_DEG;
DROP TABLE IF EXISTS TNK_DEG;

-- Expression Data Tables
-- ======================
-- Store normalized gene expression values for each cell type
-- Format: Long format with one row per cell-gene combination

CREATE TABLE BPlasma_EXP (
    Barcode TEXT NOT NULL,          -- Cell identifier
    Marker TEXT NOT NULL,           -- Gene name
    EXP DOUBLE NOT NULL,           -- Normalized expression value
    INDEX idx_marker_barcode (Marker(255), Barcode(255)),
    INDEX idx_barcode_marker (Barcode(255), Marker(255))
);

CREATE TABLE CD4T_EXP (
    Barcode TEXT NOT NULL,
    Marker TEXT NOT NULL,
    EXP DOUBLE NOT NULL,
    INDEX idx_marker_barcode (Marker(255), Barcode(255)),
    INDEX idx_barcode_marker (Barcode(255), Marker(255))
);

CREATE TABLE CD8T_EXP (
    Barcode TEXT NOT NULL,
    Marker TEXT NOT NULL,
    EXP DOUBLE NOT NULL,
    INDEX idx_marker_barcode (Marker(255), Barcode(255)),
    INDEX idx_barcode_marker (Barcode(255), Marker(255))
);

CREATE TABLE Myeloid_EXP (
    Barcode TEXT NOT NULL,
    Marker TEXT NOT NULL,
    EXP DOUBLE NOT NULL,
    INDEX idx_marker_barcode (Marker(255), Barcode(255)),
    INDEX idx_barcode_marker (Barcode(255), Marker(255))
);

CREATE TABLE NK_EXP (
    Barcode TEXT NOT NULL,
    Marker TEXT NOT NULL,
    EXP DOUBLE NOT NULL,
    INDEX idx_marker_barcode (Marker(255), Barcode(255)),
    INDEX idx_barcode_marker (Barcode(255), Marker(255))
);

CREATE TABLE TNK_EXP (
    Barcode TEXT NOT NULL,
    Marker TEXT NOT NULL,
    EXP DOUBLE NOT NULL,
    INDEX idx_marker_barcode (Marker(255), Barcode(255)),
    INDEX idx_barcode_marker (Barcode(255), Marker(255))
);

-- Metadata Tables
-- ===============
-- Store cell-level metadata including sample and cell type information

CREATE TABLE BPlasma_meta (
    Barcode VARCHAR(255) PRIMARY KEY,  -- Cell identifier (unique)
    UMAP_1 DOUBLE,                     -- UMAP coordinate 1
    UMAP_2 DOUBLE,                     -- UMAP coordinate 2
    SampleID TEXT,                     -- Sample identifier
    CellType TEXT,                     -- Cell type annotation
    CellStatus TEXT                    -- Cell status classification
);

CREATE TABLE CD4T_meta (
    Barcode VARCHAR(255) PRIMARY KEY,
    UMAP_1 DOUBLE,
    UMAP_2 DOUBLE,
    SampleID TEXT,
    CellType TEXT,
    CellStatus TEXT
);

CREATE TABLE CD8T_meta (
    Barcode VARCHAR(255) PRIMARY KEY,
    UMAP_1 DOUBLE,
    UMAP_2 DOUBLE,
    SampleID TEXT,
    CellType TEXT,
    CellStatus TEXT
);

CREATE TABLE Myeloid_meta (
    Barcode VARCHAR(255) PRIMARY KEY,
    UMAP_1 DOUBLE,
    UMAP_2 DOUBLE,
    SampleID TEXT,
    CellType TEXT,
    CellStatus TEXT
);

CREATE TABLE NK_meta (
    Barcode VARCHAR(255) PRIMARY KEY,
    UMAP_1 DOUBLE,
    UMAP_2 DOUBLE,
    SampleID TEXT,
    CellType TEXT,
    CellStatus TEXT
);

CREATE TABLE TNK_meta (
    Barcode VARCHAR(255) PRIMARY KEY,
    UMAP_1 DOUBLE,
    UMAP_2 DOUBLE,
    SampleID TEXT,
    CellType TEXT,
    CellStatus TEXT
);

-- Comprehensive metadata table for all cells
CREATE TABLE ALL_meta (
    Barcode VARCHAR(255) PRIMARY KEY,
    UMAP_1 DOUBLE,
    UMAP_2 DOUBLE,
    SampleID TEXT,
    CellType TEXT,
    CellStatus TEXT
);

-- Differential Expression Gene (DEG) Tables
-- =========================================
-- Store cluster-specific marker genes and their statistics

CREATE TABLE BPlasma_DEG (
    p_val DOUBLE,                  -- Statistical p-value
    avg_log2FC DOUBLE,             -- Average log2 fold change
    pct1 DOUBLE,                   -- Percentage of cells expressing in cluster
    pct2 DOUBLE,                   -- Percentage of cells expressing in other clusters
    p_val_adj DOUBLE,              -- Adjusted p-value (multiple testing correction)
    cluster TEXT,                  -- Cluster identifier
    gene TEXT                      -- Gene name
);

CREATE TABLE CD4T_DEG (
    p_val DOUBLE,
    avg_log2FC DOUBLE,
    pct1 DOUBLE,
    pct2 DOUBLE,
    p_val_adj DOUBLE,
    cluster TEXT,
    gene TEXT
);

CREATE TABLE CD8T_DEG (
    p_val DOUBLE,
    avg_log2FC DOUBLE,
    pct1 DOUBLE,
    pct2 DOUBLE,
    p_val_adj DOUBLE,
    cluster TEXT,
    gene TEXT
);

CREATE TABLE Myeloid_DEG (
    p_val DOUBLE,
    avg_log2FC DOUBLE,
    pct1 DOUBLE,
    pct2 DOUBLE,
    p_val_adj DOUBLE,
    cluster TEXT,
    gene TEXT
);

CREATE TABLE NK_DEG (
    p_val DOUBLE,
    avg_log2FC DOUBLE,
    pct1 DOUBLE,
    pct2 DOUBLE,
    p_val_adj DOUBLE,
    cluster TEXT,
    gene TEXT
);

CREATE TABLE TNK_DEG (
    p_val DOUBLE,
    avg_log2FC DOUBLE,
    pct1 DOUBLE,
    pct2 DOUBLE,
    p_val_adj DOUBLE,
    cluster TEXT,
    gene TEXT
);
