//--------------------------------------------------------------//
// filename : sqlMapping.js
// Date : 2021-11-29
// contributor : Yanshuo Chu
// function: SQL mapping for query languages
//--------------------------------------------------------------//

var queryType = {
  TissueType: "SELECT DISTINCT TissueType FROM {table}_META",
  CancerType: "SELECT DISTINCT CancerType FROM {table}_META",

  TissueType12:
    "SELECT DISTINCT TissueType FROM {table1}_META WHERE Barcode IN (SELECT Barcode FROM {table2}_META)",
  CancerType12:
    "SELECT DISTINCT CancerType FROM {table1}_META WHERE Barcode IN (SELECT Barcode FROM {table2}_META)",

  CancerType_Tissue:
    'SELECT DISTINCT CancerType FROM {table}_META WHERE TissueType = "{tissue}"',
  CancerType12_Tissue:
    'SELECT DISTINCT CancerType FROM {table1}_META WHERE Barcode IN (SELECT Barcode FROM {table2}_META) AND TissueType = "{tissue}"',

  DistD:
    "SELECT TissueType, CancerType, CellClusterType, UMAP1, UMAP2 FROM {table}_META",
  DistDT:
    'SELECT TissueType, CancerType, CellClusterType, UMAP1, UMAP2 FROM {table}_META where TissueType = "{tissue}"',
  DistDC:
    'SELECT TissueType, CancerType, CellClusterType, UMAP1, UMAP2 FROM {table}_META where CancerType = "{cancer}"',
  DistDTC:
    'SELECT TissueType, CancerType, CellClusterType, UMAP1, UMAP2 FROM {table}_META where CancerType = "{cancer}" and TissueType = "{tissue}"',

  DistD12:
    "SELECT t1.TissueType, t1.CancerType, t2.UMAP1, t2.UMAP2, t2.CellClusterType FROM {table2}_META t2 JOIN {table1}_META t1 ON t1.Barcode = t2.Barcode",
  DistDT12:
    'SELECT t1.TissueType, t1.CancerType, t2.UMAP1, t2.UMAP2, t2.CellClusterType FROM {table2}_META t2 JOIN {table1}_META t1 ON t1.Barcode = t2.Barcode AND t1.TissueType = "{tissue}"',
  DistDC12:
    'SELECT t1.TissueType, t1.CancerType, t2.UMAP1, t2.UMAP2, t2.CellClusterType FROM {table2}_META t2 JOIN {table1}_META t1 ON t1.Barcode = t2.Barcode AND t1.CancerType = "{cancer}"',
  DistDTC12:
    ' SELECT t1.TissueType, t1.CancerType, t2.UMAP1, t2.UMAP2, t2.CellClusterType FROM {table2}_META t2 JOIN {table1}_META t1 ON t1.Barcode = t2.Barcode AND t1.TissueType = "{tissue}" AND t1.CancerType = "{cancer}"',

  DEGsIMG:
    'SELECT t2.UMAP1, t2.UMAP2, t2.CellClusterType, t1.EXP FROM {table}_EXP t1 LEFT JOIN {table}_META t2 ON t1.Barcode = t2.Barcode where t1.Marker = "{gene}";',
};

module.exports = queryType;
