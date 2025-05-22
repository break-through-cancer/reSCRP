#'--------------------------------------------------------------
#' filename : expression.R
#' Date : 2021-12-04
#' contributor : Yanshuo Chu
#' function: expression
#'--------------------------------------------------------------

needs(ggplot2)
needs(base64)
needs(dplyr)
needs(readr)
needs(tidyr)
needs(pheatmap)
needs(jsonlite)

attach(input[[1]])

# Barcode Marker EXP CellClusterType ####################################################

df <- read_csv(csvPathFile, show_col_types = FALSE)

colorsForDataType <- c("#6DCCDD", "#EDCAE0", "#F494BE", "#F9B26C", "#A6ADCC", "#C4DA5D")

## remove zero exp
zeroEXP <- df %>%
  group_by(Marker) %>%
  summarise(sumEXP = sum(EXP)) %>%
  filter(sumEXP == 0)
df <- df %>%
  filter(! Marker %in% zeroEXP$Marker)

df_ap <- df %>%
    select(Marker, EXP, CellClusterType) %>%
    group_by(Marker, CellClusterType) %>%
    mutate(avg.exp = mean(expm1(EXP))) %>%
    ungroup() %>%
    group_by(CellClusterType) %>%
    mutate(groupSize = n()) %>%
    group_by(Marker, CellClusterType) %>%
    mutate(pct.exp = sum(EXP > 0) / groupSize * 100) %>%
    select(Marker, CellClusterType, avg.exp, pct.exp) %>%
    distinct(Marker, CellClusterType, avg.exp, pct.exp, .keep_all = TRUE) %>%
    ungroup() %>%
    group_by(Marker) %>%
    mutate(scaled.avg.exp = scale(avg.exp))

g_bubbleplot <- df_ap %>%
    ggplot() +
    geom_point(aes(x = CellClusterType,
                   y = Marker,
                   size = pct.exp,
                   color = scaled.avg.exp)) +
    scale_color_gradient(high = colorsForDataType[3],
                         low = colorsForDataType[1])+
    xlab("Cell State") +
    theme_classic() +
    theme(legend.key.size = unit(0.2, "cm"),
          axis.text.x = element_text(angle = 60, vjust = 1, hjust=1))

###############################################################################
#                           Calculate cor of markers                          #
###############################################################################

EXPMatrix <- df %>%
    select(Barcode, Marker, EXP) %>%
    spread(Marker, EXP) %>%
    select(-Barcode)

CorMatrix <- cor(EXPMatrix, method = "spearman")
if(dim(CorMatrix)[1] > 1){
    g_heatmapplot <- pheatmap(CorMatrix,
                              show_colnames = T,
                              show_rownames = T,
                              cluster_cols = T,
                              cluster_rows = T)

    gL <- list(BubblePlot = g_bubbleplot, HeatmapPlot = g_heatmapplot)
    gS <- list(BubblePlot = "", HeatmapPlot = "")
}else{
    gL <- list(BubblePlot = g_bubbleplot)
    gS <- list(BubblePlot = "")
}

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
