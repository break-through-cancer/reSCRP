# Clear R environment
rm(list=ls())

# Load required libraries
library(tidyverse)
library(Seurat)
library(stringr)
library(data.table)

# File Path Configuration
# =======================

# Base directories
BASE_DIR <- file.path(getwd(), "data", "raw", "GBM")
OUTPUT_PATH <- file.path(getwd(), "data", "processed", "ovarian")

# Create output directory if it doesn't exist
if(!dir.exists(OUTPUT_PATH)){
  dir.create(OUTPUT_PATH, recursive = TRUE)
}

# Input file paths
OVARIAN_MALIGNANT_PATH <- file.path(BASE_DIR, 'scRNA_rds_Ovarian_Malignant_cluster_object.RDS')
OVARIAN_NONMALIGNANT_PATH <- file.path(BASE_DIR, 'scRNA_rds_Ovarian_nonMalignant_cluster_object.RDS')

# Gene filtering patterns (similar to TCM pipeline)
gene.pattern <- c("MALAT1", "^MT-", "^MT.",  "^RPL", "^RPS", "^RP[0-9]+-", "^LOC[0-9]", "^MTRNR", "hsa-*", "[.].*")

# Date for file naming
current_date <- format(Sys.Date(), "%Y%m%d")

# Cell type definitions
cell_types <- list(
  Malignant = list(
    name = "Malignant",
    file_path = OVARIAN_MALIGNANT_PATH,
    description = "Ovarian Malignant cells"
  ),
  NonMalignant = list(
    name = "NonMalignant",
    file_path = OVARIAN_NONMALIGNANT_PATH,
    description = "Ovarian Non-malignant cells"
  )
)

# Helper Functions
# ================

# Validate file existence
validate_file_exists <- function(filepath, description = "") {
  if (!file.exists(filepath)) {
    stop(paste("File not found:", description, "\nPath:", filepath))
  }
  cat("Found:", description, "\n")
  return(filepath)
}

# Filter genes based on patterns
filter_genes <- function(seurat_obj, patterns) {
  all_genes <- rownames(seurat_obj)
  genes_to_remove <- c()

  for (pattern in patterns) {
    matching_genes <- grep(pattern, all_genes, value = TRUE, ignore.case = TRUE)
    genes_to_remove <- c(genes_to_remove, matching_genes)
  }

  genes_to_remove <- unique(genes_to_remove)
  genes_to_keep <- setdiff(all_genes, genes_to_remove)

  cat("  Filtered out", length(genes_to_remove), "genes matching patterns\n")
  cat("  Keeping", length(genes_to_keep), "genes for analysis\n")

  return(genes_to_keep)
}

# Process cell type data
process_cell_type <- function(cell_type_info) {
  cat("\n=== Processing", cell_type_info$description, "===\n")

  # Validate and load data
  validate_file_exists(cell_type_info$file_path, cell_type_info$description)
  seurat_obj <- readRDS(cell_type_info$file_path)

  cat("Loaded", ncol(seurat_obj), "cells and", nrow(seurat_obj), "genes\n")

  # Filter genes
  genes_to_keep <- filter_genes(seurat_obj, gene.pattern)
  seurat_obj <- seurat_obj[genes_to_keep, ]

  # Extract metadata
  metadata <- seurat_obj@meta.data
  metadata$Barcode <- rownames(metadata)
  metadata$CellType <- cell_type_info$name

  # Add UMAP coordinates if available
  if("umap" %in% names(seurat_obj@reductions)) {
    umap_coords <- Embeddings(object = seurat_obj, reduction = "umap")
    metadata$UMAP1 <- umap_coords[,1]
    metadata$UMAP2 <- umap_coords[,2]
  } else {
    metadata$UMAP1 <- NA
    metadata$UMAP2 <- NA
    cat("  Warning: No UMAP coordinates found\n")
  }

  # Reorder columns
  col_order <- c("Barcode", "CellType", setdiff(colnames(metadata), c("Barcode", "CellType")))
  metadata <- metadata[, col_order, drop = FALSE]

  # Extract expression data (normalized counts)
  if("data" %in% names(seurat_obj@assays$RNA@layers)) {
    exp_data <- seurat_obj@assays$RNA@layers$data
  } else if("data" %in% slotNames(seurat_obj@assays$RNA)) {
    exp_data <- GetAssayData(seurat_obj, slot = "data")
  } else {
    exp_data <- GetAssayData(seurat_obj, slot = "counts")
    cat("  Warning: Using raw counts instead of normalized data\n")
  }

  # Convert to data frame with gene names
  exp_df <- as.data.frame(as.matrix(exp_data))
  exp_df$Gene <- rownames(exp_df)
  exp_df <- exp_df[, c("Gene", colnames(exp_df)[-ncol(exp_df)])]

  # Generate output file names
  meta_file <- file.path(OUTPUT_PATH, paste0(cell_type_info$name, "_meta_", current_date, ".tsv"))
  exp_file <- file.path(OUTPUT_PATH, paste0(cell_type_info$name, "_EXP_", current_date, ".tsv"))

  # Save files
  write_tsv(metadata, meta_file)
  write_tsv(exp_df, exp_file)

  cat("  Saved metadata to:", meta_file, "\n")
  cat("  Saved expression data to:", exp_file, "\n")

  return(list(
    metadata = metadata,
    expression = exp_df,
    cell_count = ncol(seurat_obj),
    gene_count = nrow(seurat_obj)
  ))
}

# Main Processing Workflow
# ========================

cat("=== Ovarian Cancer scRNA-seq Preprocessing ===\n")
cat("Processing cell types for database import...\n")

# Initialize results
results <- list()
total_cells <- 0
total_genes_filtered <- 0

# Process each cell type
for(cell_type_name in names(cell_types)) {
  result <- process_cell_type(cell_types[[cell_type_name]])
  results[[cell_type_name]] <- result
  total_cells <- total_cells + result$cell_count
}

# Summary Report
# ==============

cat("\n=== Processing Summary ===\n")
cat("Cell type-specific files generated:\n")

for(cell_type_name in names(results)) {
  result <- results[[cell_type_name]]
  cat("  -", cell_type_name, ":", result$cell_count, "cells,", result$gene_count, "genes\n")
}

cat("\nTotal cells processed:", total_cells, "\n")
cat("Output directory:", OUTPUT_PATH, "\n")

# List generated files
cat("\nGenerated files:\n")
output_files <- list.files(OUTPUT_PATH, pattern = paste0(".*_", current_date, "\\.tsv$"), full.names = FALSE)
for(file in output_files) {
  cat("  -", file, "\n")
}

cat("\n=== Cell Type-Specific Preprocessing Complete ===\n")
cat("Files are ready for database import.\n")