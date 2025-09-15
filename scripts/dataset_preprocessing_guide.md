# Data Preprocessing and Loading Guide

## Overview
This document describes the preprocessing steps performed by the `preprocessing.R` script for T-cell analysis data in the TCM (T-Cell Map) project.

## Prerequisites
The script requires the following R packages:
- `tidyverse` - Data manipulation and visualization
- `Seurat` - Single-cell RNA analysis
- `stringr` - String manipulation
- `data.table` - Fast data manipulation

## Directory Structure
```
BASE_DIR: /rsrch3/scratch/genomic_med/ychu2/data/tmp/Tcellproject/data/ClinicInfoBk
ANALYSIS_BASE_DIR: /rsrch3/scratch/genomic_med/ychu2/data/tmp/Tcellproject/analysis/validate
OUTPUT_PATH: /rsrch3/.../step4_figs/FigsForPaper/fig1/export2tsvOuts
```

## Data Loading
The script loads pre-clustered Seurat objects for six T-cell subsets:

### Cell Type Data Files
- **CD8+ T cells**: `CD8_cluster_2021-07-22.rds`
- **CD4+ T cells**: `CD4_cluster_2021-07-22.rds`
- **NK/NKT cells**: `NKT_cluster_2021-07-22.rds`
- **Proliferative cells**: `Proliferative_cluster_2021-07-22.rds`
- **Regulatory T cells (Treg)**: `p1_sub_Treg_CD4_V5_UMAP_dist_0.1_nneighbor_20_CLUSTER_res_0.3/cluster.rds`
- **T follicular helper cells (TFH)**: `p1_sub_TFH_CD4_V6_UMAP_dist_0.01_nneighbor_50_CLUSTER_res_0.3/cluster.rds`

### Differential Expression Gene (DEG) Files
Each cell type has corresponding DEG analysis results stored as TSV files with marker genes for each cluster.

## Cell Type Annotations
The script defines detailed cell type annotations for each subset:

### CD8+ T Cell Types (14 clusters)
- `CD8_c0_t-Teff` - Effector T cells
- `CD8_c1_Tex` - Exhausted T cells
- `CD8_c3_Tn` - Naive T cells
- `CD8_c6_Tcm` - Central memory T cells
- `CD8_c12_Trm` - Tissue-resident memory T cells
- And 9 other specialized subtypes

### CD4+ T Cell Types (12 clusters)
- `CD4_c0_Tcm` - Central memory T cells
- `CD4_c1_Treg` - Regulatory T cells
- `CD4_c2_Tn` - Naive T cells
- `CD4_c3_Tfh` - T follicular helper cells
- And 8 other specialized subtypes

### Additional Cell Types
- **Innate cells**: 5 NK/MAIT cell subtypes
- **Proliferative cells**: 8 proliferating cell subtypes
- **Treg cells**: 7 regulatory T cell subtypes
- **TFH cells**: 5 follicular helper subtypes

## Data Processing Steps

### 1. Cell Subsetting
- Treg and TFH objects are subset to include only cells present in the main CD4+ dataset
- Metadata columns are synchronized between objects

### 2. Metadata Processing
For each cell type, the script:
- Extracts UMAP coordinates for visualization
- Assigns cell type labels based on cluster assignments
- Applies coordinate transformations (e.g., CD8+ cells get flipped UMAP1 coordinates)
- Exports metadata as TSV files with columns:
  - `Barcode` - Cell identifier
  - `TissueType` - Tissue origin
  - `CancerType` - Cancer classification
  - `Patient` - Patient identifier
  - `Sample` - Sample identifier
  - `CellClusterType` - Assigned cell type
  - `UMAP1`, `UMAP2` - Visualization coordinates

### 3. Expression Data Processing
For each cell type:
- Identifies highly variable genes (1,500 features)
- Combines with differentially expressed genes from cluster analysis
- Filters out unwanted gene patterns:
  - Mitochondrial genes (`^MT-`, `^MT.`)
  - Ribosomal genes (`^RPL`, `^RPS`, `^RP[0-9]+-`)
  - Long non-coding RNAs (using lncipedia database)
  - Other pattern-based exclusions
- Exports normalized expression data in long format with columns:
  - `Barcode` - Cell identifier
  - `Marker` - Gene name
  - `EXP` - Normalized expression value

## Output Files
All output files are timestamped and saved to the OUTPUT_PATH:
- `{CellType}_meta_{Date}.tsv` - Metadata tables
- `{CellType}_EXP_{Date}.tsv` - Expression data tables

## Key Seurat Functions Used
- `Cells()` - Extract cell identifiers
- `subset()` - Filter Seurat objects
- `Embeddings()` - Get dimensionality reduction coordinates
- `FindVariableFeatures()` - Identify highly variable genes
- `VariableFeatures()` - Retrieve variable features
- `GetAssayData()` - Extract expression matrices

## Quality Control
- Gene filtering removes common contaminants and non-informative features
- Cell subsetting ensures consistency across related cell types
- Coordinate transformations standardize visualization layouts
