# Clear R environment
rm(list=ls())

library(tidyverse)
library(Seurat)
library(stringr)
library("data.table")

BASE_DIR <- '/rsrch3/scratch/genomic_med/ychu2/data/tmp/Tcellproject/data/ClinicInfoBk'
ANALYSIS_BASE_DIR <- '/rsrch3/scratch/genomic_med/ychu2/data/tmp/Tcellproject/analysis/validate'
OUTPUT_PATH <- file.path("/rsrch3/scratch/genomic_med/ychu2/data/tmp/Tcellproject/analysis/scripts/pipelines/step4_figs/FigsForPaper/fig1/export2tsvOuts")
if(!dir.exists(OUTPUT_PATH)){
  dir.create(OUTPUT_PATH)
}
setwd(OUTPUT_PATH)


CD8_path <- file.path(BASE_DIR, 'CD8_cluster_2021-07-22.rds')
CD4_path <- file.path(BASE_DIR, 'CD4_cluster_2021-07-22.rds')
NK_path <- file.path(BASE_DIR, 'NKT_cluster_2021-07-22.rds')
Proliferative_path <- file.path(BASE_DIR, 'Proliferative_cluster_2021-07-22.rds')
Treg_path <- file.path(ANALYSIS_BASE_DIR, 'Sub_Treg_CD4_V5/nPC_15/UMAP_dist_0.1_nneighbor_20/p1_sub_Treg_CD4_V5_UMAP_dist_0.1_nneighbor_20_CLUSTER_res_0.3/cluster.rds')
TFH_path <- file.path(ANALYSIS_BASE_DIR, 'Sub_TFH_CD4_V6/nPC_10/UMAP_dist_0.01_nneighbor_50/p1_sub_TFH_CD4_V6_UMAP_dist_0.01_nneighbor_50_CLUSTER_res_0.3/cluster.rds')


# DEGS Paths
CD8_DEG_path <- file.path(ANALYSIS_BASE_DIR, 
    'CD8_V6/nPC_50/UMAP_dist_0.1_nneighbor_50/p1CD8_V6_UMAP_dist_0.1_nneighbor_50_CLUSTER_res_0.3/snn-single-markers.tsv')
CD4_DEG_path <- file.path(ANALYSIS_BASE_DIR, 
    'CD4_V7/nPC_50/UMAP_dist_0.1_nneighbor_50/p1CD4_V7_UMAP_dist_0.1_nneighbor_50_CLUSTER_res_0.3/snn-single-markers.tsv')
Innate_DEG_path <- file.path(ANALYSIS_BASE_DIR, 
    'NKTMAIT_V6/nPC_5/UMAP_dist_0.1_nneighbor_35/p1_NKTMAIT_v6_UMAP_dist_0.1_nneighbor_35_CLUSTER_res_0.3/snn-single-markers.tsv')
Proliferative_DEG_path <- file.path(ANALYSIS_BASE_DIR, 
    'Proliferative_V4/nPC_15/UMAP_dist_0.1_nneighbor_35/p1_Proliferative_V4_UMAP_dist_0.1_nneighbor_35_CLUSTER_res_0.3/snn-single-markers.tsv')
Treg_DEG_path <- file.path(ANALYSIS_BASE_DIR, 
    'Sub_Treg_CD4_V5/nPC_15/UMAP_dist_0.1_nneighbor_20/p1_sub_Treg_CD4_V5_UMAP_dist_0.1_nneighbor_20_CLUSTER_res_0.3/snn-single-markers.tsv')
TFH_DEG_path <- file.path(ANALYSIS_BASE_DIR, 
    'Sub_TFH_CD4_V6/nPC_10/UMAP_dist_0.01_nneighbor_50/p1_sub_TFH_CD4_V6_UMAP_dist_0.01_nneighbor_50_CLUSTER_res_0.3/snn-single-markers.tsv')

# Data Loading
# Loads pre-clustered Seurat Objects for different T-cell subsets CD8+ T cells, 
# CD4+ T cells, NK/NKT cells, Proliferative cells, Regulatory T cells, 
# T follicular helper cells (TFH)
CD8_Obj <- readRDS(CD8_path)
CD4_Obj <- readRDS(CD4_path)
NK_Obj <- readRDS(NK_path)
Proliferative_Obj <- readRDS(Proliferative_path)
Treg_Obj <- readRDS(Treg_path)
TFH_Obj <- readRDS(TFH_path)

# Cell Subset Synchronization
# ===========================
# Treg and TFH are analyzed as subsets of CD4+ T cells, so we need to:
# 1. Keep only cells that are present in both the subset and main CD4+ dataset
# 2. Synchronize clinical metadata between the datasets for consistency

# Helper function to synchronize cell subset with parent dataset
synchronize_cell_subset <- function(subset_obj, parent_obj, subset_name) {
  cat("Synchronizing", subset_name, "subset with CD4+ parent dataset...\n")

  # Get cell identifiers
  subset_cells <- Cells(subset_obj)
  parent_cells <- Cells(parent_obj)

  # Find overlapping cells
  overlapping_cells <- subset_cells[subset_cells %in% parent_cells]
  cat("  Found", length(overlapping_cells), "overlapping cells out of",
      length(subset_cells), "total", subset_name, "cells\n")

  # Subset to only include overlapping cells
  synchronized_obj <- subset(subset_obj, cells = overlapping_cells)

  return(synchronized_obj)
}

# Helper function to copy clinical metadata from parent to subset
copy_clinical_metadata <- function(subset_obj, parent_obj, subset_name) {
  cat("Copying clinical metadata to", subset_name, "subset...\n")

  # Define clinical metadata columns to copy
  clinical_columns <- c("CancerType", "TissueType", "OrganSite", "Disease", "Patient", "Sample")

  subset_cells <- Cells(subset_obj)
  parent_cells <- Cells(parent_obj)

  # For each clinical column, copy values from parent to subset
  for (clinical_column in clinical_columns) {
    if (clinical_column %in% colnames(parent_obj@meta.data)) {
      # Find matching cells and copy metadata
      cell_matches <- match(subset_cells, parent_cells)
      subset_obj@meta.data[, clinical_column] <- parent_obj@meta.data[cell_matches, clinical_column]
      cat("  Copied", clinical_column, "metadata\n")
    } else {
      cat("  Warning:", clinical_column, "not found in parent metadata\n")
    }
  }

  return(subset_obj)
}

# Synchronize Treg subset (regulatory T cells are a subset of CD4+ T cells)
Treg_Obj <- synchronize_cell_subset(Treg_Obj, CD4_Obj, "Treg")
Treg_Obj <- copy_clinical_metadata(Treg_Obj, CD4_Obj, "Treg")

# Synchronize TFH subset (T follicular helper cells are a subset of CD4+ T cells)
TFH_Obj <- synchronize_cell_subset(TFH_Obj, CD4_Obj, "TFH")
TFH_Obj <- copy_clinical_metadata(TFH_Obj, CD4_Obj, "TFH")

# Cell Type Mapping
# Defines cell type annotations for each subset based on cluster numbers
# and functional states. 
# e.g., "CD8_c0_t-Teff" = CD8 effector T cells
CD8_CellType <- c("CD8_c0_t-Teff",
                  "CD8_c1_Tex",
                  "CD8_c2_Teff",
                  "CD8_c3_Tn",
                  "CD8_c4_Tstr",
                  "CD8_c5_Tisg",
                  "CD8_c6_Tcm",
                  "CD8_c7_p-Tex",
                  "CD8_c8_Teff_KLRG1",
                  "CD8_c9_Tsen",
                  "CD8_c10_Teff_CD244",
                  "CD8_c11_Teff_SEMA4A",
                  "CD8_c12_Trm",
                  "CD8_c13_Tn_TCF7")

CD4_CellType <- c("CD4_c0_Tcm",
                  "CD4_c1_Treg",
                  "CD4_c2_Tn",
                  "CD4_c3_Tfh",
                  "CD4_c4_Tstr",
                  "CD4_c5_Tctl",
                  "CD4_c6_Tn_FHIT",
                  "CD4_c7_Tn_TCEA3",
                  "CD4_c8_Th17",
                  "CD4_c9_Tn_TCF7_SLC40A1",
                  "CD4_c10_Tn_LEF1_ANKRD55",
                  "CD4_c11_Tisg")

Innate_CellType <- c("NKT_c0_FCGR3A_GZMB",
                     "MAIT-like_c1",
                     "MAIT_c2_KLRB1",
                     "MAIT-like_c3_CX3CR1",
                     "NKT_c4_KIR_TIGIT_CXCR6")

Proliferative_CellType <- c("P_c0_CD8_KLRD1_GZMB_CCL4/5",
                            "P_c1_CD4_CD40LG_IL7R",
                            "P_c2_DNT",
                            "P_c3_DNT_GZMK+",
                            "P_c4_CD8_C1QBP_MT1G/X/E",
                            "P_c5_CD8_CXCL13_CCL3/4/5_PD-1",
                            "P_c6_Treg",
                            "P_c7_CD8_GZMK_NKG7_LAG3_PRF1")

Treg_CellType <- c("Treg_c0",
                   "Treg_c1_Naive-like",
                   "Treg_c2_Activated",
                   "Treg_c3_Th2-like",
                   "Treg_c4_TNFRSF13B",
                   "Treg_c5_Stressed",
                   "Treg_c6_LRRC32")

TFH_CellType <- c("Tfh_c0_Naive-like",
                  "Tfh_c1_Mature",
                  "Tfh_c2_Transitional",
                  "Tfh_c3_Cytotoxic",
                  "Tfh_c4_IL2RA")

allCellType <- list(CD8 = CD8_CellType,
                    CD4 = CD4_CellType,
                    Innate = Innate_CellType,
                    Proliferative = Proliferative_CellType,
                    Treg = Treg_CellType,
                    TFH = TFH_CellType)

allDEGPath <- list(CD8 = CD8_DEG_path,
                   CD4 = CD4_DEG_path,
                   Innate = Innate_DEG_path,
                   Proliferative = Proliferative_DEG_path,
                   Treg = Treg_DEG_path,
                   TFH = TFH_DEG_path)

allObj <- list(CD8 = CD8_Obj,
               CD4 = CD4_Obj,
               Innate = NK_Obj,
               Proliferative = Proliferative_Obj,
               Treg = Treg_Obj,
               TFH = TFH_Obj)

# Columns for the META database table, relevant for TCM dataset
metaCols <- c(
  "Barcode",
  "TissueType",
  "CancerType",
  "Patient",
  "Sample",
  "CellClusterType",
  "UMAP1",
  "UMAP2")

lncT <- read_tsv("/rsrch3/home/genomic_med/ychu2/data/LncRNA/lncipedia_5_2_ensembl_92_genes.txt")
gene.pattern <- c("MALAT1", "^MT-", "^MT.",  "^RPL", "^RPS", "^RP[0-9]+-", "^LOC(0-9)", "^MTRNR", "hsa-*", "[.].*")

# Helper Functions for Data Processing
# =====================================

# Extract UMAP coordinates from Seurat object
extract_umap_coordinates <- function(seurat_obj) {
  umap_coords <- Embeddings(object = seurat_obj, reduction = "umap")
  colnames(umap_coords) <- c('UMAP1', 'UMAP2')
  return(data.frame(ID = rownames(umap_coords), umap_coords))
}

# Process metadata for a single cell type
process_cell_metadata <- function(seurat_obj, cell_type_name, cell_type_labels) {
  cat("  Processing metadata...\n")

  # Extract UMAP coordinates
  umap_coords <- extract_umap_coordinates(seurat_obj)

  # Extract and prepare metadata
  metadata <- seurat_obj@meta.data
  metadata <- data.frame(ID = rownames(metadata), metadata, stringsAsFactors = FALSE)
  metadata <- left_join(metadata, umap_coords, by = 'ID')

  # Apply CD8-specific coordinate transformation (flip UMAP1 for visualization)
  if (cell_type_name == "CD8") {
    cat("    Applying CD8 UMAP1 coordinate flip\n")
    mean_umap1 <- mean(metadata$UMAP1)
    metadata$UMAP1 <- mean_umap1 * 2 - metadata$UMAP1
  }

  # Add cell identifiers and cluster type annotations
  metadata$Barcode <- Cells(seurat_obj)
  metadata$CellClusterType <- cell_type_labels[match(metadata$seurat_clusters,
                                                    0:(length(cell_type_labels) - 1))]

  return(metadata)
}

# Select appropriate columns for metadata output
select_metadata_columns <- function(metadata, cell_type_name) {
  # TFH and Treg have different schema - only basic columns available
  if (cell_type_name %in% c("TFH", "Treg")) {
    return(metadata %>% select(Barcode, UMAP1, UMAP2, CellClusterType))
  } else {
    return(metadata %>% select(all_of(metaCols)))
  }
}

# Filter genes based on patterns and lncRNA database
filter_unwanted_genes <- function(gene_list) {
  cat("    Filtering unwanted gene patterns and lncRNAs...\n")

  # Remove genes matching unwanted patterns
  filtered_genes <- gene_list[!gene_list %in% grep(paste0(gene.pattern, collapse = "|"),
                                                   gene_list, value = TRUE)]

  # Remove long non-coding RNAs
  filtered_genes <- filtered_genes[!filtered_genes %in% lncT$lncipediaGeneID]

  return(unique(filtered_genes))
}

# Process expression data for a single cell type
process_expression_data <- function(seurat_obj, cell_type_name, deg_path) {
  cat("  Processing expression data...\n")

  # Find highly variable genes
  seurat_obj <- FindVariableFeatures(seurat_obj, selection.method = "vst",
                                    nfeatures = 1500, verbose = FALSE)
  highly_variable_genes <- VariableFeatures(seurat_obj)

  # Load differentially expressed genes for this cell type
  deg_genes <- read_tsv(deg_path, show_col_types = FALSE) %>% pull(gene)

  # Combine HVGs and DEGs
  selected_genes <- union(deg_genes, highly_variable_genes)

  # Filter out unwanted genes
  final_gene_list <- filter_unwanted_genes(selected_genes)

  cat("    Final gene count:", length(final_gene_list), "\n")

  # Extract expression matrix
  expression_matrix <- GetAssayData(seurat_obj, assay = "RNA", slot = "data")
  expression_subset <- expression_matrix[final_gene_list, ]

  # Convert to long format for database storage
  gene_ids <- rownames(expression_subset)
  cell_ids <- colnames(expression_subset)

  expression_data <- as_tibble(t(as.matrix(expression_subset)))
  expression_data$Barcode <- cell_ids
  expression_data <- expression_data %>%
    select(Barcode, all_of(gene_ids)) %>%
    gather(Marker, EXP, -Barcode)

  return(expression_data)
}

# Main Processing Loop
# ===================

# Process each cell type for metadata and expression data
for (cell_type_name in names(allObj)) {
  cat("\n=== Processing cell type:", cell_type_name, "===\n")

  # Get objects and parameters for this cell type
  seurat_obj <- allObj[[cell_type_name]]
  cell_type_labels <- allCellType[[cell_type_name]]
  deg_path <- allDEGPath[[cell_type_name]]

  # Process and export metadata
  cat("METADATA PROCESSING:\n")
  processed_metadata <- process_cell_metadata(seurat_obj, cell_type_name, cell_type_labels)
  output_metadata <- select_metadata_columns(processed_metadata, cell_type_name)

  metadata_filename <- paste0(cell_type_name, '_meta_', Sys.Date(), '.tsv')
  write_tsv(output_metadata, file.path(getwd(), metadata_filename))
  cat("  Saved:", metadata_filename, "\n")

  # Process and export expression data
  cat("EXPRESSION PROCESSING:\n")
  expression_data <- process_expression_data(seurat_obj, cell_type_name, deg_path)

  expression_filename <- paste0(cell_type_name, '_EXP_', Sys.Date(), '.tsv')
  write_tsv(expression_data, file.path(getwd(), expression_filename))
  cat("  Saved:", expression_filename, "\n")
}
