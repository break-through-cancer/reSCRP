#'--------------------------------------------------------------
#' filename : degs.R
#' Date : 2021-12-04
#' contributor : Yanshuo Chu
#' function: degs
#'--------------------------------------------------------------

needs(ggplot2)
needs(RColorBrewer)
needs(base64)
needs(dplyr)
needs(readr)
needs(jsonlite)

attach(input[[1]])

df <- read_csv(csvPathFile, show_col_types = FALSE)

g_featureplot <- df %>%
    arrange(EXP) %>%
    rename(Expression = EXP) %>%
    ggplot() +
    geom_point(mapping = aes(x = UMAP1, y = UMAP2, color = Expression),
               size = 0.1) +
    xlab("UMAP_1") + ylab("UMAP_2") +
    scale_colour_gradientn(colours = rev(brewer.pal(n = 11, name = "RdBu")))+
    coord_fixed() +
    theme_classic() +
    theme(legend.position = "right",
          legend.key.size = unit(0.5, "cm"))

g_violinplot <- df %>%
    rename(Expression = EXP) %>%
    ggplot() +
    geom_violin(mapping = aes(x = CellClusterType, y = Expression)) +
    xlab("Cell Type") +
    theme_classic() +
    theme(legend.position = "none",
          axis.text.x = element_text(angle = 60, vjust = 1, hjust=1))

gL <- list(FeaturePlot = g_featureplot, ViolinPlot = g_violinplot)
gS <- list(FeaturePlot = "", ViolinPlot = "")

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
