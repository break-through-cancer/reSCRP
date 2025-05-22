#'--------------------------------------------------------------
#' filename : bcr.R
#' Date : 2022-08-10
#' contributor : Yanshuo Chu
#' function: bcr
#'--------------------------------------------------------------

needs(dplyr)
needs(readr)
needs(tidyr)
needs(jsonlite)

attach(input[[1]])

df <- read_csv(csvPathFile, show_col_types = FALSE)

rl10nS <- c("1", "2~5", "5~20", "20~50", ">=50")

clone_count <- df %>%
    filter(!is.na(clone_id)) %>%
    select(clone_id) %>%
    group_by(clone_id) %>%
    count() %>%
    arrange(desc(n))

clone_count$rl10n <- ""
clone_count$rl10n[clone_count$n == 1] <- rl10nS[1]
clone_count$rl10n[clone_count$n >= 2] <- rl10nS[2]
clone_count$rl10n[clone_count$n >= 5] <- rl10nS[3]
clone_count$rl10n[clone_count$n >= 20] <- rl10nS[4]
clone_count$rl10n[clone_count$n >= 50] <- rl10nS[5]

df$rl10n <- clone_count$rl10n[match(df$clone_id, clone_count$clone_id)]

clone_count_top10 <- clone_count %>%
    ungroup() %>%
    arrange(desc(n)) %>%
    top_n(10, n) %>%
    filter(n > 1)

df$isTop10 <- df$clone_id %in% clone_count_top10$clone_id

# jaccard index ###############################################################

cellTypes <- unique(df$CellClusterType)

jiM <- matrix(NA, nrow = length(cellTypes), ncol = length(cellTypes))
rownames(jiM) <- cellTypes
colnames(jiM) <- cellTypes

for(i in 1:(length(cellTypes)-1)){
    for(j in (i+1):length(cellTypes)){
        clone_id_i <- df %>% filter(!is.na(clone_id)) %>% filter(CellClusterType == cellTypes[i]) %>% pull(clone_id) %>% unique()
        clone_id_j <- df %>% filter(!is.na(clone_id)) %>% filter(CellClusterType == cellTypes[j]) %>% pull(clone_id) %>% unique()
        muCloneSet <- intersect(clone_id_i, clone_id_j)
        ni <- df %>% filter(CellClusterType == cellTypes[i]) %>% filter(!is.na(clone_id)) %>% count() %>% pull(n)
        nj <- df %>% filter(CellClusterType == cellTypes[j]) %>% filter(!is.na(clone_id)) %>% count() %>% pull(n)
        mi <- df %>% filter(CellClusterType == cellTypes[i]) %>% filter(clone_id %in% muCloneSet) %>% count() %>% pull(n)
        mj <- df %>% filter(CellClusterType == cellTypes[j]) %>% filter(clone_id %in% muCloneSet) %>% count() %>% pull(n)
        if((ni + nj) == 0){
        }else{
            jiM[cellTypes[i], cellTypes[j]] <- (mi+mj)/(ni+nj)
            jiM[cellTypes[j], cellTypes[i]] <- (mi+mj)/(ni+nj)
        }
    }
}

dfJSON <- toJSON(df)
jiMJSON <- toJSON(jiM)
cjiMJSON <- toJSON(colnames(jiM))
paste0('[', dfJSON, ',', jiMJSON, ',', cjiMJSON, ']')
