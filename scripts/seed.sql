DROP TABLE IF EXISTS CD4_EXP;
DROP TABLE IF EXISTS CD8_EXP;
DROP TABLE IF EXISTS Innate_EXP;
DROP TABLE IF EXISTS Proliferative_EXP;
DROP TABLE IF EXISTS Treg_EXP;
DROP TABLE IF EXISTS TFH_EXP;
DROP TABLE IF EXISTS CD4_meta;
DROP TABLE IF EXISTS CD8_meta;
DROP TABLE IF EXISTS Innate_meta;
DROP TABLE IF EXISTS Proliferative_meta;
DROP TABLE IF EXISTS Treg_meta;
DROP TABLE IF EXISTS TFH_meta;
DROP TABLE IF EXISTS CD4_DEG;
DROP TABLE IF EXISTS CD8_DEG;
DROP TABLE IF EXISTS Innate_DEG;
DROP TABLE IF EXISTS Proliferative_DEG;
DROP TABLE IF EXISTS Treg_DEG;
DROP TABLE IF EXISTS TFH_DEG;

CREATE TABLE CD4_EXP(Barcode TEXT, Marker TEXT, EXP DOUBLE);
CREATE TABLE CD8_EXP(Barcode TEXT, Marker TEXT, EXP DOUBLE);
CREATE TABLE Innate_EXP(Barcode TEXT, Marker TEXT, EXP DOUBLE);
CREATE TABLE Proliferative_EXP(Barcode TEXT, Marker TEXT, EXP DOUBLE);
CREATE TABLE Treg_EXP(Barcode TEXT, Marker TEXT, EXP DOUBLE);
CREATE TABLE TFH_EXP(Barcode TEXT, Marker TEXT, EXP DOUBLE);

CREATE TABLE CD4_meta(Barcode TEXT, TissueType  TEXT, CancerType  TEXT, Patient TEXT, Sample  TEXT, CellClusterType TEXT, UMAP1 DOUBLE, UMAP2 DOUBLE);
CREATE TABLE CD8_meta(Barcode TEXT, TissueType  TEXT, CancerType  TEXT, Patient TEXT, Sample  TEXT, CellClusterType TEXT, UMAP1 DOUBLE, UMAP2 DOUBLE);
CREATE TABLE Innate_meta(Barcode TEXT, TissueType  TEXT, CancerType  TEXT, Patient TEXT, Sample  TEXT, CellClusterType TEXT, UMAP1 DOUBLE, UMAP2 DOUBLE);
CREATE TABLE Proliferative_meta(Barcode TEXT, TissueType  TEXT, CancerType  TEXT, Patient TEXT, Sample  TEXT, CellClusterType TEXT, UMAP1 DOUBLE, UMAP2 DOUBLE);
CREATE TABLE Treg_meta(Barcode TEXT, UMAP1 DOUBLE, UMAP2 DOUBLE, CellClusterType TEXT);
CREATE TABLE TFH_meta(Barcode TEXT, UMAP1 DOUBLE, UMAP2 DOUBLE, CellClusterType TEXT);

CREATE TABLE CD4_DEG(p_val DOUBLE, avg_logFC DOUBLE, pct1 DOUBLE, pct2 DOUBLE, p_val_adj DOUBLE, cluster TEXT, gene TEXT);
CREATE TABLE CD8_DEG(p_val DOUBLE, avg_logFC DOUBLE, pct1 DOUBLE, pct2 DOUBLE, p_val_adj DOUBLE, cluster TEXT, gene TEXT);
CREATE TABLE Innate_DEG(p_val DOUBLE, avg_logFC DOUBLE, pct1 DOUBLE, pct2 DOUBLE, p_val_adj DOUBLE, cluster TEXT, gene TEXT);
CREATE TABLE Proliferative_DEG(p_val DOUBLE, avg_logFC DOUBLE, pct1 DOUBLE, pct2 DOUBLE, p_val_adj DOUBLE, cluster TEXT, gene TEXT);
CREATE TABLE Treg_DEG(p_val DOUBLE, avg_logFC DOUBLE, pct1 DOUBLE, pct2 DOUBLE, p_val_adj DOUBLE, cluster TEXT, gene TEXT);
CREATE TABLE TFH_DEG(p_val DOUBLE, avg_logFC DOUBLE, pct1 DOUBLE, pct2 DOUBLE, p_val_adj DOUBLE, cluster TEXT, gene TEXT);

# CREATE TABLE B_EXP(Barcode TEXT, Marker TEXT, EXP DOUBLE);
# CREATE TABLE B_meta(Barcode TEXT, Field TEXT, Gender TEXT, Stage TEXT, Smoking TEXT, Age DOUBLE, Mut TEXT, CellClusterType TEXT, UMAP1 DOUBLE, UMAP2 DOUBLE);
# CREATE TABLE B_DEG(p_val DOUBLE, avg_logFC DOUBLE, pct1 DOUBLE, pct2 DOUBLE, p_val_adj DOUBLE, cluster TEXT, gene TEXT);
# CREATE TABLE B_BCR(sequence_id TEXT, v_call TEXT, d_call TEXT, j_call TEXT, cell_id TEXT, c_call TEXT, clone_id TEXT, germline_v_call TEXT, germline_d_call TEXT, germline_j_call TEXT, patient TEXT, orig_ident TEXT, mu_count_seq_r DOUBLE, mu_count_seq_s DOUBLE, mu_freq_seq_r DOUBLE, mu_freq_seq_s DOUBLE, mu_freq_cdr_r DOUBLE, mu_freq_cdr_s DOUBLE, mu_freq_fwr_r DOUBLE, mu_freq_fwr_s DOUBLE, Field TEXT, Smoking2 TEXT, Gender TEXT, Stage TEXT, clone_size DOUBLE, MutGenes TEXT, MF_group TEXT)

# Create indices on metadata tables
CREATE INDEX idx ON CD4_meta (Barcode);
CREATE INDEX idx ON CD8_meta (Barcode);
CREATE INDEX idx ON Innate_meta (Barcode);
CREATE INDEX idx ON Proliferative_meta (Barcode);
CREATE INDEX idx ON Treg_meta (Barcode);
CREATE INDEX idx ON TFH_meta (Barcode);
 
# Create indices on expression tables
CREATE INDEX idx ON CD4_EXP (Marker, Barcode);
CREATE INDEX idx ON CD8_EXP (Marker, Barcode);
CREATE INDEX idx ON Innate_EXP (Marker, Barcode);
CREATE INDEX idx ON Proliferative_EXP (Marker, Barcode);
CREATE INDEX idx ON Treg_EXP (Marker, Barcode);
CREATE INDEX idx ON TFH_EXP (Marker, Barcode);
CREATE INDEX idx2 ON CD4_EXP (Barcode, Marker);
CREATE INDEX idx2 ON CD8_EXP (Barcode, Marker);
CREATE INDEX idx2 ON Innate_EXP (Barcode, Marker);
CREATE INDEX idx2 ON Proliferative_EXP (Barcode, Marker);
CREATE INDEX idx2 ON Treg_EXP (Barcode, Marker);
CREATE INDEX idx2 ON TFH_EXP (Barcode, Marker);
# 
# CREATE INDEX idx ON B_meta (Barcode);
# CREATE INDEX idx ON B_EXP (Marker, Barcode);
# CREATE INDEX idx2 ON B_EXP (Barcode, Marker);
 
ALTER TABLE CD4_meta ADD PRIMARY KEY(Barcode);
ALTER TABLE CD8_meta ADD PRIMARY KEY(Barcode);
ALTER TABLE Innate_meta ADD PRIMARY KEY(Barcode);
ALTER TABLE Proliferative_meta ADD PRIMARY KEY(Barcode);
ALTER TABLE Treg_meta ADD PRIMARY KEY(Barcode);
ALTER TABLE TFH_meta ADD PRIMARY KEY(Barcode);

# ALTER TABLE B_meta ADD PRIMARY KEY(Barcode);
