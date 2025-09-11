# Load required libraries
library(Seurat)
library(tidyverse)
library(data.table)

# Set output path
output_dir <- "data/TCM_custom_export"
if (!dir.exists(output_dir)) {
  dir.create(output_dir, recursive = TRUE)
}

# Set RDS file paths
CD4_path <- "data/raw/TCM_custom/CD4.rds"
CD8_path <- "data/raw/TCM_custom/CD8.rds"

# Load Seurat objects
CD4_Obj <- readRDS(CD4_path)
CD8_Obj <- readRDS(CD8_path)

# Generate timestamped output
date_tag <- Sys.Date()

export_seurat_data <- function(obj, label) {
  coord <- Embeddings(obj, "umap")
  colnames(coord) <- c("UMAP1", "UMAP2")
  coord <- data.frame(Barcode = rownames(coord), coord)

  meta <- obj@meta.data
  meta <- data.frame(Barcode = rownames(meta), meta, stringsAsFactors = FALSE)
  meta <- left_join(meta, coord, by = "Barcode")

  # Select metadata columns
# check which columns are available
existing_cols <- intersect(c("Barcode", "seurat_clusters", "UMAP1", "UMAP2"), colnames(meta))

meta_selected <- meta %>%
  select(all_of(existing_cols))

# rename if 'seurat_clusters' is present
if ("seurat_clusters" %in% colnames(meta_selected)) {
  meta_selected <- meta_selected %>%
    rename(CellClusterType = seurat_clusters)
}

  # Write metadata file
  write_tsv(meta_selected, file.path(output_dir, paste0(label, "_meta_", date_tag, ".tsv")))

  # Expression export
  obj <- FindVariableFeatures(obj, selection.method = "vst", nfeatures = 1500, verbose = FALSE)
  hvg <- VariableFeatures(obj)
  expr <- GetAssayData(obj, assay = "RNA", slot = "data")[hvg, ]
  expr_long <- as_tibble(t(as.matrix(expr)))
  expr_long$Barcode <- colnames(expr)
  expr_long <- expr_long %>%
    select(Barcode, everything()) %>%
    pivot_longer(-Barcode, names_to = "Marker", values_to = "EXP")

  # Write expression file
  write_tsv(expr_long, file.path(output_dir, paste0(label, "_EXP_", date_tag, ".tsv")))
}

# Export CD4 and CD8 datasets
export_seurat_data(CD4_Obj, "CD4")
export_seurat_data(CD8_Obj, "CD8")

