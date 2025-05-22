needs(ggplot2)
needs(base64)
needs(dplyr)
needs(readr)
needs(jsonlite)

attach(input[[1]])

colorsForDataType <- c("#6DCCDD", "#EDCAE0", "#F494BE", "#F9B26C", "#A6ADCC", "#C4DA5D")
umapColor <- c("#6DCCDD","#9ACBDE","#C8CADF","#EDC6DD","#F092B1","#F27FA5","#F47892", "#F6A395","#F8AD77","#E7B080","#C9AFA2","#ABADC5","#AEB9AC","#B9C984", "#C4DA5D")

df <- read_csv(csvPathFile,show_col_types = FALSE)

g_celltype <- ggplot(df) +
    geom_point(mapping = aes(x = UMAP1, y = UMAP2, color = CellClusterType),
               size = 0.1) +
    scale_color_manual(values = colorRampPalette(umapColor)(length(unique(df$CellClusterType)))) +
    xlab("UMAP_1") + ylab("UMAP_2") +
    coord_fixed() +
    theme_classic() +
    theme(legend.key.size = unit(0.5, "cm")) +
    guides(color = guide_legend(title = "Cell Type",
                                override.aes = list(size=5)))

g_field <- ggplot(df) +
    geom_point(mapping = aes(x = UMAP1, y = UMAP2, color = Field),
               size = 0.1) +
    scale_color_manual(values = colorRampPalette(umapColor)(length(unique(df$Field)))) +
    xlab("UMAP_1") + ylab("UMAP_2") +
    coord_fixed() +
    theme_classic() +
    theme(legend.key.size = unit(0.5, "cm")) +
    guides(color = guide_legend(title = "Field",
                                override.aes = list(size=5)))

g_gender <- ggplot(df) +
    geom_point(mapping = aes(x = UMAP1, y = UMAP2, color = Gender),
               size = 0.1) +
    scale_color_manual(values = colorRampPalette(umapColor)(length(unique(df$Gender)))) +
    xlab("UMAP_1") + ylab("UMAP_2") +
    coord_fixed() +
    theme_classic() +
    theme(legend.key.size = unit(0.5, "cm")) +
    guides(color = guide_legend(title = "Gender",
                                override.aes = list(size=5)))

g_stage <- ggplot(df) +
    geom_point(mapping = aes(x = UMAP1, y = UMAP2, color = Stage),
               size = 0.1) +
    scale_color_manual(values = colorRampPalette(umapColor)(length(unique(df$Stage)))) +
    xlab("UMAP_1") + ylab("UMAP_2") +
    coord_fixed() +
    theme_classic() +
    theme(legend.key.size = unit(0.5, "cm")) +
    guides(color = guide_legend(title = "Stage",
                                override.aes = list(size=5)))

g_smoking <- ggplot(df) +
    geom_point(mapping = aes(x = UMAP1, y = UMAP2, color = Smoking),
               size = 0.1) +
    scale_color_manual(values = colorRampPalette(umapColor)(length(unique(df$Smoking)))) +
    xlab("UMAP_1") + ylab("UMAP_2") +
    coord_fixed() +
    theme_classic() +
    theme(legend.key.size = unit(0.5, "cm")) +
    guides(color = guide_legend(title = "Smoking",
                                override.aes = list(size=5)))

g_mut <- ggplot(df) +
    geom_point(mapping = aes(x = UMAP1, y = UMAP2, color = Mut),
               size = 0.1) +
    scale_color_manual(values = colorRampPalette(umapColor)(length(unique(df$Mut)))) +
    xlab("UMAP_1") + ylab("UMAP_2") +
    coord_fixed() +
    theme_classic() +
    theme(legend.key.size = unit(0.5, "cm")) +
    guides(color = guide_legend(title = "Driver mutation",
                                override.aes = list(size=5)))

gL <- list(
    CellClusterType = g_celltype,
    Field = g_field,
    Gender = g_gender,
    Stage = g_stage,
    Smoking = g_smoking,
    Mut = g_mut)

gS <- list(
    CellClusterType = "",
    Field = "",
    Gender = "",
    Stage = "",
    Smoking = "",
    Mut = "")

for(gli in 1:length(gL)){
    tempName <- names(gL[gli])
    tempG <- gL[[gli]]

    pngfile <- tempfile()
    png(pngfile, width = 700, height = 500, pointsize = 1, res = 150)
    print(tempG)
    dev.off()

    gS[[tempName]] <- img(pngfile, Rd = F)
}

toJSON(gS)
