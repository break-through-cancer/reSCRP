-- =============================================
-- TCM (T-Cell Map) Database Schema
-- =============================================
-- This script creates the database schema for storing T-cell analysis data
-- including expression data, metadata, and differential expression genes
-- for different T-cell subsets.

-- Clean up existing tables
-- ======================
DROP TABLE IF EXISTS CD4_EXP;
DROP TABLE IF EXISTS CD8_EXP;
DROP TABLE IF EXISTS Innate_EXP;
DROP TABLE IF EXISTS Proliferative_EXP;
DROP TABLE IF EXISTS Treg_EXP;
DROP TABLE IF EXISTS TFH_EXP;

DROP TABLE IF EXISTS CD4_meta;
DROP TABLE IF EXISTS CD8_meta;
DROP TABLE IF EXISTS Innate_meta;
DROP TABLE IF EXISTS Proliferative_meta;
DROP TABLE IF EXISTS Treg_meta;
DROP TABLE IF EXISTS TFH_meta;

DROP TABLE IF EXISTS CD4_DEG;
DROP TABLE IF EXISTS CD8_DEG;
DROP TABLE IF EXISTS Innate_DEG;
DROP TABLE IF EXISTS Proliferative_DEG;
DROP TABLE IF EXISTS Treg_DEG;
DROP TABLE IF EXISTS TFH_DEG;

-- Expression Data Tables
-- ======================
-- Store normalized gene expression values for each cell type
-- Format: Long format with one row per cell-gene combination

CREATE TABLE CD4_EXP (
    Barcode TEXT NOT NULL,          -- Cell identifier
    Marker TEXT NOT NULL,           -- Gene name
    EXP DOUBLE NOT NULL,           -- Normalized expression value
    INDEX idx_marker_barcode (Marker, Barcode),
    INDEX idx_barcode_marker (Barcode, Marker)
);

CREATE TABLE CD8_EXP (
    Barcode TEXT NOT NULL,
    Marker TEXT NOT NULL,
    EXP DOUBLE NOT NULL,
    INDEX idx_marker_barcode (Marker, Barcode),
    INDEX idx_barcode_marker (Barcode, Marker)
);

CREATE TABLE Innate_EXP (
    Barcode TEXT NOT NULL,
    Marker TEXT NOT NULL,
    EXP DOUBLE NOT NULL,
    INDEX idx_marker_barcode (Marker, Barcode),
    INDEX idx_barcode_marker (Barcode, Marker)
);

CREATE TABLE Proliferative_EXP (
    Barcode TEXT NOT NULL,
    Marker TEXT NOT NULL,
    EXP DOUBLE NOT NULL,
    INDEX idx_marker_barcode (Marker, Barcode),
    INDEX idx_barcode_marker (Barcode, Marker)
);

CREATE TABLE Treg_EXP (
    Barcode TEXT NOT NULL,
    Marker TEXT NOT NULL,
    EXP DOUBLE NOT NULL,
    INDEX idx_marker_barcode (Marker, Barcode),
    INDEX idx_barcode_marker (Barcode, Marker)
);

CREATE TABLE TFH_EXP (
    Barcode TEXT NOT NULL,
    Marker TEXT NOT NULL,
    EXP DOUBLE NOT NULL,
    INDEX idx_marker_barcode (Marker, Barcode),
    INDEX idx_barcode_marker (Barcode, Marker)
);

-- Metadata Tables
-- ===============
-- Store cell-level metadata including clinical information and coordinates

-- Standard metadata schema (CD4, CD8, Innate, Proliferative)
CREATE TABLE CD4_meta (
    Barcode TEXT PRIMARY KEY,       -- Cell identifier (unique)
    TissueType TEXT,               -- Tissue of origin
    CancerType TEXT,               -- Cancer classification
    Patient TEXT,                  -- Patient identifier
    Sample TEXT,                   -- Sample identifier
    CellClusterType TEXT,          -- Assigned cell type/cluster
    UMAP1 DOUBLE,                  -- UMAP coordinate 1
    UMAP2 DOUBLE                   -- UMAP coordinate 2
);

CREATE TABLE CD8_meta (
    Barcode TEXT PRIMARY KEY,
    TissueType TEXT,
    CancerType TEXT,
    Patient TEXT,
    Sample TEXT,
    CellClusterType TEXT,
    UMAP1 DOUBLE,
    UMAP2 DOUBLE
);

CREATE TABLE Innate_meta (
    Barcode TEXT PRIMARY KEY,
    TissueType TEXT,
    CancerType TEXT,
    Patient TEXT,
    Sample TEXT,
    CellClusterType TEXT,
    UMAP1 DOUBLE,
    UMAP2 DOUBLE
);

CREATE TABLE Proliferative_meta (
    Barcode TEXT PRIMARY KEY,
    TissueType TEXT,
    CancerType TEXT,
    Patient TEXT,
    Sample TEXT,
    CellClusterType TEXT,
    UMAP1 DOUBLE,
    UMAP2 DOUBLE
);

-- Simplified metadata schema (Treg, TFH - subset analyses)
-- Note: Clinical metadata inherited from parent CD4+ dataset
CREATE TABLE Treg_meta (
    Barcode TEXT PRIMARY KEY,
    UMAP1 DOUBLE,
    UMAP2 DOUBLE,
    CellClusterType TEXT
);

CREATE TABLE TFH_meta (
    Barcode TEXT PRIMARY KEY,
    UMAP1 DOUBLE,
    UMAP2 DOUBLE,
    CellClusterType TEXT
);

-- Differential Expression Gene (DEG) Tables
-- =========================================
-- Store cluster-specific marker genes and their statistics

CREATE TABLE CD4_DEG (
    p_val DOUBLE,                  -- Statistical p-value
    avg_logFC DOUBLE,              -- Average log fold change
    pct1 DOUBLE,                   -- Percentage of cells expressing in cluster
    pct2 DOUBLE,                   -- Percentage of cells expressing in other clusters
    p_val_adj DOUBLE,              -- Adjusted p-value (multiple testing correction)
    cluster TEXT,                  -- Cluster identifier
    gene TEXT                      -- Gene name
);

CREATE TABLE CD8_DEG (
    p_val DOUBLE,
    avg_logFC DOUBLE,
    pct1 DOUBLE,
    pct2 DOUBLE,
    p_val_adj DOUBLE,
    cluster TEXT,
    gene TEXT
);

CREATE TABLE Innate_DEG (
    p_val DOUBLE,
    avg_logFC DOUBLE,
    pct1 DOUBLE,
    pct2 DOUBLE,
    p_val_adj DOUBLE,
    cluster TEXT,
    gene TEXT
);

CREATE TABLE Proliferative_DEG (
    p_val DOUBLE,
    avg_logFC DOUBLE,
    pct1 DOUBLE,
    pct2 DOUBLE,
    p_val_adj DOUBLE,
    cluster TEXT,
    gene TEXT
);

CREATE TABLE Treg_DEG (
    p_val DOUBLE,
    avg_logFC DOUBLE,
    pct1 DOUBLE,
    pct2 DOUBLE,
    p_val_adj DOUBLE,
    cluster TEXT,
    gene TEXT
);

CREATE TABLE TFH_DEG (
    p_val DOUBLE,
    avg_logFC DOUBLE,
    pct1 DOUBLE,
    pct2 DOUBLE,
    p_val_adj DOUBLE,
    cluster TEXT,
    gene TEXT
);

-- Future Extensions (B-cell data - currently disabled)
-- ===================================================
/*
CREATE TABLE B_EXP (
    Barcode TEXT NOT NULL,
    Marker TEXT NOT NULL,
    EXP DOUBLE NOT NULL
);

CREATE TABLE B_meta (
    Barcode TEXT PRIMARY KEY,
    Field TEXT,
    Gender TEXT,
    Stage TEXT,
    Smoking TEXT,
    Age DOUBLE,
    Mut TEXT,
    CellClusterType TEXT,
    UMAP1 DOUBLE,
    UMAP2 DOUBLE
);

CREATE TABLE B_DEG (
    p_val DOUBLE,
    avg_logFC DOUBLE,
    pct1 DOUBLE,
    pct2 DOUBLE,
    p_val_adj DOUBLE,
    cluster TEXT,
    gene TEXT
);

CREATE TABLE B_BCR (
    sequence_id TEXT,
    v_call TEXT,
    d_call TEXT,
    j_call TEXT,
    cell_id TEXT,
    c_call TEXT,
    clone_id TEXT,
    germline_v_call TEXT,
    germline_d_call TEXT,
    germline_j_call TEXT,
    patient TEXT,
    orig_ident TEXT,
    mu_count_seq_r DOUBLE,
    mu_count_seq_s DOUBLE,
    mu_freq_seq_r DOUBLE,
    mu_freq_seq_s DOUBLE,
    mu_freq_cdr_r DOUBLE,
    mu_freq_cdr_s DOUBLE,
    mu_freq_fwr_r DOUBLE,
    mu_freq_fwr_s DOUBLE,
    Field TEXT,
    Smoking2 TEXT,
    Gender TEXT,
    Stage TEXT,
    clone_size DOUBLE,
    MutGenes TEXT,
    MF_group TEXT
);
*/