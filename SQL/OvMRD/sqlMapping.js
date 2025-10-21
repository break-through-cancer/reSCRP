var queryType = {
    SampleID: 'SELECT DISTINCT SampleID FROM {table}_meta',
    CellType: 'SELECT DISTINCT CellType FROM {table}_meta',
    CellStatus: 'SELECT DISTINCT CellStatus FROM {table}_meta',

    CellType_Sample: 'SELECT DISTINCT CellType FROM {table}_meta WHERE SampleID = "{sample}"',

    DistD: 'SELECT SampleID, CellType, CellStatus, UMAP_1, UMAP_2 FROM {table}_meta',
    DistDS: 'SELECT SampleID, CellType, CellStatus, UMAP_1, UMAP_2 FROM {table}_meta WHERE SampleID = "{sample}"',
    DistDC: 'SELECT SampleID, CellType, CellStatus, UMAP_1, UMAP_2 FROM {table}_meta WHERE CellType = "{celltype}"',
    DistDSC: 'SELECT SampleID, CellType, CellStatus, UMAP_1, UMAP_2 FROM {table}_meta WHERE SampleID = "{sample}" AND CellType = "{celltype}"',

    DEGsIMG: 'SELECT t2.UMAP_1, t2.UMAP_2, t2.CellType, t1.EXP FROM {table}_EXP t1 LEFT JOIN {table}_meta t2 ON t1.Barcode = t2.Barcode WHERE t1.Marker = "{gene}";',

    queryDEGs: 'SELECT DISTINCT cluster FROM {table}_DEG',
};

module.exports = queryType;
