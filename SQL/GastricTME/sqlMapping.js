//--------------------------------------------------------------//
// filename : sqlMapping.js
// Date : 2021-11-29
// contributor : Yanshuo Chu
// function: SQL mapping for query languages
//--------------------------------------------------------------//

var queryType = {
  SampleType: "SELECT DISTINCT SampleType FROM {table}_meta",

  TissueType12:
    "SELECT DISTINCT TissueType FROM {table1}_meta WHERE Barcode IN (SELECT Barcode FROM {table2}_meta)",
  CancerType12:
    "SELECT DISTINCT CancerType FROM {table1}_meta WHERE Barcode IN (SELECT Barcode FROM {table2}_meta)",

  CancerType_Tissue:
    'SELECT DISTINCT CancerType FROM {table}_meta WHERE TissueType = "{tissue}"',
  CancerType12_Tissue:
    'SELECT DISTINCT CancerType FROM {table1}_meta WHERE Barcode IN (SELECT Barcode FROM {table2}_meta) AND TissueType = "{tissue}"',

  DistD:
    "SELECT SampleType, CellClusterType, UMAP1, UMAP2 FROM {table}_meta",
  DistDT:
    'SELECT SampleType, CellClusterType, UMAP1, UMAP2 FROM {table}_meta where SampleType = "{sample}"',

  DistD12:
    "SELECT t1.TissueType, t1.CancerType, t2.UMAP1, t2.UMAP2, t2.CellClusterType FROM {table2}_meta t2 JOIN {table1}_meta t1 ON t1.Barcode = t2.Barcode",
  DistDT12:
    'SELECT t1.TissueType, t1.CancerType, t2.UMAP1, t2.UMAP2, t2.CellClusterType FROM {table2}_meta t2 JOIN {table1}_meta t1 ON t1.Barcode = t2.Barcode AND t1.TissueType = "{tissue}"',
  DistDC12:
    'SELECT t1.TissueType, t1.CancerType, t2.UMAP1, t2.UMAP2, t2.CellClusterType FROM {table2}_meta t2 JOIN {table1}_meta t1 ON t1.Barcode = t2.Barcode AND t1.CancerType = "{cancer}"',
  DistDTC12:
    ' SELECT t1.TissueType, t1.CancerType, t2.UMAP1, t2.UMAP2, t2.CellClusterType FROM {table2}_meta t2 JOIN {table1}_meta t1 ON t1.Barcode = t2.Barcode AND t1.TissueType = "{tissue}" AND t1.CancerType = "{cancer}"',

  DEGsIMG:
    'SELECT t2.UMAP1, t2.UMAP2, t2.CellClusterType, t1.EXP FROM {table}_EXP t1 LEFT JOIN {table}_meta t2 ON t1.Barcode = t2.Barcode where t1.Marker = "{gene}";',
};

module.exports = queryType;
