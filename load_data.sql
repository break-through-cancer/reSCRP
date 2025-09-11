LOAD DATA LOCAL INFILE "/data/TCM_custom_export/CD4_meta_2025-06-09.tsv" INTO TABLE CD4_meta;
LOAD DATA LOCAL INFILE "/data/TCM_custom_export/CD8_meta_2025-06-09.tsv" INTO TABLE CD8_meta;

LOAD DATA LOCAL INFILE "/data/TCM_custom_export/CD4_EXP_2025-06-09.tsv" into table CD4_EXP;
LOAD DATA LOCAL INFILE "/data/TCM_custom_export/CD8_EXP_2025-06-09.tsv" into table CD8_EXP;
