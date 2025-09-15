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

# Subsetting
Treg_Obj <- subset(Treg_Obj, cells = Cells(Treg_Obj)[Cells(Treg_Obj) %in% Cells(CD4_Obj)])
TFH_Obj <- subset(TFH_Obj, cells = Cells(TFH_Obj)[Cells(TFH_Obj) %in% Cells(CD4_Obj)])

# Columns relevant for TCM 
for(tempColumn in c("CancerType", "TissueType", "OrganSite", "Disease", "Patient", "Sample")){
  Treg_Obj@meta.data[,tempColumn] <- CD4_Obj@meta.data[match(Cells(Treg_Obj), Cells(CD4_Obj)), tempColumn]
  TFH_Obj@meta.data[,tempColumn] <- CD4_Obj@meta.data[match(Cells(TFH_Obj), Cells(CD4_Obj)), tempColumn]
}

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

# Metadata Processing
# For each cell type:
# - Extracts UMAP coordinates and metadata
# - Assigns cell type labels based on cluster assignments
# - Exports metadata as TSV files with columns like Barcode, TissueType,
# CancerType, Patient, etc.
for(oi in 1:length(allObj)){
  tempObjName <- names(allObj[oi])
  tempObj <- allObj[[oi]]
  tempCellTypes <- allCellType[[tempObjName]]

  coord = Embeddings(object = tempObj, reduction = "umap")
  colnames(coord) = c('UMAP1','UMAP2')
  coord = data.frame(ID = rownames(coord), coord)
  meta = tempObj@meta.data;
  meta = data.frame(ID = rownames(meta), meta,stringsAsFactors = F)
  meta = left_join(meta, coord, by = 'ID')
  if(tempObjName %in% c("CD8")){
    meanUMAP1 <- mean(meta$UMAP1)
    meta$UMAP1 <- meanUMAP1 * 2 - meta$UMAP1
  }
  meta$Barcode <- Cells(tempObj)
  meta$CellClusterType <- ""
  meta$CellClusterType <- tempCellTypes[match(meta$seurat_clusters, 0:(length(tempCellTypes)-1))]

  if(tempObjName %in% c("TFH", "Treg")){
    outTable <- meta %>% select(Barcode, UMAP1, UMAP2, CellClusterType)
  }else{
    outTable <- meta %>% select(all_of(metaCols)) 
  }
  write_tsv(outTable, file.path(getwd(), paste0(tempObjName, '_meta', "_", Sys.Date(), '.tsv')))

  # Expression Data Processing
  tempObj <- FindVariableFeatures(tempObj, selection.method = "vst", nfeatures = 1500, verbose = FALSE)
  hvg = VariableFeatures(tempObj)

  tempDEGs <- read_tsv(allDEGPath[[tempObjName]]) %>% pull(gene)
  hvg <- union(tempDEGs, hvg)
  hvg <- hvg[!hvg %in% grep(paste0(gene.pattern, collapse = "|"), hvg, value = T)]
  hvg <- hvg[!hvg %in% lncT$lncipediaGeneID]
  hvg <- unique(hvg)

  print("length(hvg)")
  print(length(hvg))

  dataAssay = GetAssayData(tempObj, assay = "RNA", slot = "data")
  sub = dataAssay[hvg, ]
  markerID <- rownames(sub)
  cellID <- colnames(sub)

  outData <- as_tibble(t(as.matrix(sub)))
  outData$Barcode <- cellID
  outData <- outData %>% select(Barcode, all_of(markerID)) %>% gather(Marker, EXP, -Barcode)

  write_tsv(outData, file.path(getwd(), paste0(tempObjName, '_EXP', "_", Sys.Date(), '.tsv')))
}
