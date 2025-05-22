//--------------------------------------------------------------//
// filename : sqlMapping.js
// Date : 2021-11-29
// contributor : Yanshuo Chu
// function: SQL mapping for query languages
//--------------------------------------------------------------//

var queryType = {
    DEGsIMG: 'SELECT t2.UMAP1, t2.UMAP2, t2.CellClusterType, t1.EXP FROM B_EXP t1 LEFT JOIN B_meta t2 ON t1.Barcode = t2.Barcode where t1.Marker = "{gene}";',
};

module.exports = queryType;
