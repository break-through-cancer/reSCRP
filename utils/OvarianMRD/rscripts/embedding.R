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
    geom_point(mapping = aes(x = UMAP_1, y = UMAP_2, color = CellType),
               size = 0.1) +
    scale_color_manual(values = colorRampPalette(umapColor)(length(unique(df$CellType)))) +
    xlab("UMAP_1") + ylab("UMAP_2") +
    coord_fixed() +
    theme_classic() +
    theme(legend.key.size = unit(0.5, "cm")) +
    guides(color = guide_legend(title = "Cell Type",
                                override.aes = list(size=5)))

g_sampleid <- ggplot(df) +
    geom_point(mapping = aes(x = UMAP_1, y = UMAP_2, color = SampleID),
               size = 0.1) +
    scale_color_manual(values = colorRampPalette(umapColor)(length(unique(df$SampleID)))) +
    xlab("UMAP_1") + ylab("UMAP_2") +
    coord_fixed() +
    theme_classic() +
    theme(legend.key.size = unit(0.5, "cm")) +
    guides(color = guide_legend(title = "Sample ID",
                                override.aes = list(size=5)))

g_cellstatus <- ggplot(df) +
    geom_point(mapping = aes(x = UMAP_1, y = UMAP_2, color = CellStatus),
               size = 0.1) +
    scale_color_manual(values = colorRampPalette(umapColor)(length(unique(df$CellStatus)))) +
    xlab("UMAP_1") + ylab("UMAP_2") +
    coord_fixed() +
    theme_classic() +
    theme(legend.key.size = unit(0.5, "cm")) +
    guides(color = guide_legend(title = "Cell Status",
                                override.aes = list(size=5)))

gL <- list(CellType = g_celltype, SampleID = g_sampleid, CellStatus = g_cellstatus)
gS <- list(CellType = "", SampleID = "", CellStatus = "")

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
