//--------------------------------------------------------------/y
// filename : pool.js
// Date : 2021-11-30
// contributor : Yanshuo Chu
// function: pool
//--------------------------------------------------------------//
var mysql = require("mysql2");
var $conf = require("../../conf/GastricTME/conf");
var $sql = require("./sqlMapping");
var R = require("r-script");
var pool = mysql.createPool($conf.mysql);

var createCsvWriter = require("csv-writer").createObjectCsvWriter;
var tmp = require("tmp");

String.prototype.format = function (arguments) {
    var this_string = "";
    for (var char_pos = 0; char_pos < this.length; char_pos++) {
        this_string = this_string + this[char_pos];
    }

    for (var key in arguments) {
        var string_key = "{" + key + "}";
        this_string = this_string.replace(
            new RegExp(string_key, "g"),
            arguments[key]
        );
    }
    return this_string;
};

var sendResultFuc = function (res, ret) {
    if (typeof ret === "undefined") {
        res.json({
            msg: "failed",
            SampleTypes: "",
        });
    } else {
        res.send(ret);
    }
};

const aColumns = [
    "p_val",
    "avg_logFC",
    "pct1",
    "pct2",
    "p_val_adj",
    "cluster",
    "gene",
];

module.exports = {
    querySample: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                throw err;
            }
            var resResult = [];
            if(req.query.dataset_id === ""){
                connection.release();
            }else{
                var sqlString1 = $sql.SampleType.format({ table: req.query.dataset_id });
                connection.query(sqlString1, function (err, result) {
                    if (err) {
                        connection.release();
                        throw err;
                    }
                    resResult.push(result);
                    sendResultFuc(res, resResult);
                    connection.release();
                });
            }
        });
    },

    queryDist: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                throw err;
            }

            // here 4 occasions  //////////////////////////////////////////////
            var sqlString = "";
            if (req.query.dataset_id === "") {
                connection.release();
            } else {
                if (req.query.sampletype_id === "") {
                    sqlString = $sql.DistD.format({ table: req.query.dataset_id });
                } else {
                    sqlString = $sql.DistDT.format({
                        table: req.query.dataset_id,
                        sample: req.query.sampletype_id,
                    });
                }
            }
            connection.query(sqlString, function (err, result) {
                if (err) {
                    connection.release();
                    throw err;
                }
                connection.release();
                var json_result = result.map((v) => Object.assign({}, v));

                tmp.file(function _tempFileCreated(err, path, fd, cleanupCallback) {
                    if (err) throw err;
                    const csvWriter = createCsvWriter({
                        path: path,
                        header: [
                            { id: "SampleType", title: "SampleType" },
                            { id: "CellClusterType", title: "CellClusterType" },
                            { id: "UMAP1", title: "UMAP1" },
                            { id: "UMAP2", title: "UMAP2" },
                        ],
                    });
                    csvWriter.writeRecords(json_result).then(() => {
                        R("utils/GastricTME/rscripts/embedding.R")
                            .data({ csvPathFile: path })
                            .call(function (errR, dR) {
                                cleanupCallback();
                                if (errR) throw errR;
                                res.send(JSON.parse(dR));
                            });
                    });
                });
            });
        });
    },

    queryDEGs: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();

                throw err;
            }
            var sqlString = $sql.queryDEGs.format({ table: req.query.dataset_id });
            connection.query(sqlString, function (err, result) {
                sendResultFuc(res, result);
                connection.release();
            });
        });
    },

    queryTable: function server(req, res, next) {
        //Paging
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();

                throw err;
            }
            var request = req.query;
            var sTable = req.query.dataset_id + "_DEG";
            var sLimit = "";

            if (request["start"] && request["length"] != -1) {
                sLimit = "LIMIT " + request["start"] + ", " + request["length"];
            }
            //Ordering
            var sOrder = "";
            if (request["order"]) {
                sOrder = "ORDER BY ";
                sOrder +=
                    aColumns[parseInt(request["order"][0].column)] +
                    " " +
                    request["order"][0].dir;
                if (sOrder == "ORDER BY") {
                    sOrder = "";
                }
            }

            //Filtering
            var sWhere = "";
            if (request["search"] && request["search"].value != "") {
                sWhere = "WHERE (";
                for (var i = 0; i < aColumns.length; i++) {
                    sWhere +=
                        aColumns[i] +
                        " LIKE " +
                        "'%" +
                        request["search"].value +
                        "%'" +
                        " OR ";
                }
                sWhere = sWhere.substring(0, sWhere.length - 4);
                sWhere += ")";
            }

            //Individual column filtering
            // for(var i=0 ; i<aColumns.length; i++) {
            //     if(request['bSearchable_'+i] && request['bSearchable_'+i] == "true" && request['sSearch_'+i] != '') {
            //         if(sWhere == "") {
            //             sWhere = "WHERE ";
            //         }
            //         else {
            //             sWhere += " AND ";
            //         }
            //         sWhere += " "+aColumns[i]+ " LIKE " +request['sSearch_'+i]+ " ";
            //     }
            // }

            //Queries
            var sQuery =
                "SELECT SQL_CALC_FOUND_ROWS " +
                aColumns.join(",") +
                " FROM " +
                sTable +
                " " +
                sWhere +
                " " +
                sOrder +
                " " +
                sLimit +
                "";

            var rResult = {};
            var rResultFilterTotal = {};
            var aResultFilterTotal = {};
            var iFilteredTotal = {};
            var iTotal = {};
            var rResultTotal = {};
            var aResultTotal = {};

            connection.query(sQuery, function selectCb(err, results, fields) {
                if (err) {
                    console.log(err);
                }
                rResult = results;

                //Data set length after filtering
                sQuery = "SELECT FOUND_ROWS()";

                connection.query(sQuery, function selectCb(err, results, fields) {
                    if (err) {
                        console.log(err);
                    }
                    rResultFilterTotal = results;
                    aResultFilterTotal = rResultFilterTotal;
                    iFilteredTotal = aResultFilterTotal[0]["FOUND_ROWS()"];

                    //Total data set length
                    sQuery = "SELECT COUNT(*) FROM " + sTable;

                    connection.query(sQuery, function selectCb(err, results, fields) {
                        if (err) {
                            console.log(err);
                        }
                        rResultTotal = results;
                        aResultTotal = rResultTotal;
                        iTotal = aResultTotal[0]["COUNT(*)"];

                        //Output
                        var output = {};

                        output.draw = parseInt(request["draw"]);
                        output.recordsTotal = iTotal;
                        output.recordsFiltered = iFilteredTotal;
                        output.data = [];

                        var aRow = rResult;
                        var row = [];

                        for (var i in aRow) {
                            output.data.push(aRow[i]);
                        }
                        res.status(200).send(output);
                        connection.release();
                    });
                });
            });
        });
    },

    queryDEGsIMG: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();

                throw err;
            }
            // here 4 occasions  //////////////////////////////////////////////
            var sqlString = "";
            if (req.query.dataset_id === "" || req.query.gene_id === "") {
                connection.release();
                console.log("connection failed!");
            } else {
                sqlString = $sql.DEGsIMG.format({
                    table: req.query.dataset_id,
                    gene: req.query.gene_id,
                });
            }

            connection.query(sqlString, function (err, result) {
                if (err) {
                    connection.release();
                    console.log("query failed!");

                    throw err;
                }
                connection.release();
                var json_result = result.map((v) => Object.assign({}, v));

                tmp.file(function _tempFileCreated(err, path, fd, cleanupCallback) {
                    if (err) throw err;

                    const csvWriter = createCsvWriter({
                        path: path,
                        // t2.UMAP1, t2.UMAP2, t2.CellClusterType, t1.EXP
                        header: [
                            { id: "UMAP1", title: "UMAP1" },
                            { id: "UMAP2", title: "UMAP2" },
                            { id: "CellClusterType", title: "CellClusterType" },
                            { id: "EXP", title: "EXP" },
                        ],
                    });
                    csvWriter.writeRecords(json_result).then(() => {
                        R("utils/GastricTME/rscripts/degs.R")
                            .data({ csvPathFile: path })
                            .call(function (errR, dR) {
                                cleanupCallback();
                                if (errR) throw errR;
                                res.send(JSON.parse(dR));
                            });
                    });
                });
            });
        });
    },

    queryMarkerDist: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                console.log("connection failed!");

                throw err;
            }
            console.log("req.query.dataset_id");
            console.log(req.query.dataset_id);
            if (req.query.dataset_id === "") {
                connection.release();
                console.log("connection failed!");
            } else {
                // check if marker in the EXP table
                var cQuery =
                    "SELECT distinct(Marker) FROM " +
                    req.query.dataset_id +
                    "_EXP WHERE Marker IN (";
                for (var i = 0; i < req.query.gene_id.length; i++) {
                    cQuery += '"' + req.query.gene_id[i] + '"' + ", ";
                }
                cQuery = cQuery.substring(0, cQuery.length - 2);
                cQuery += " )";

                connection.query(cQuery, function (err, result) {
                    if (err) {
                        connection.release();
                        console.log("query failed!");
                        throw err;
                    }
                    var inItems = result.map((v) => v["Marker"]);
                    var allItems = req.query.gene_id;
                    diff = allItems.filter(function (x) {
                        return inItems.indexOf(x) < 0;
                    });

                    var jsonStr = '{"missed": ' + JSON.stringify(diff) + "}";
                    var missedJSON = JSON.parse(jsonStr);
                    if (inItems.length == 0) {
                        res.send(missedJSON);
                    } else {
                        ///////////////////////////////////////////////////////////////
                        //          filter cell dynamically and generate sql         //
                        ///////////////////////////////////////////////////////////////

                        var sQuery =
                            "SELECT t1.Barcode, t1.Marker, t1.EXP, t2.CellClusterType FROM (SELECT Barcode, Marker, EXP FROM ";
                        sQuery += req.query.dataset_id + "_EXP ";

                        var sWhere = "";
                        if (req.query.gene_id != "") {
                            sWhere = "WHERE Marker IN ( ";
                            for (var i = 0; i < req.query.gene_id.length; i++) {
                                sWhere += '"' + req.query.gene_id[i] + '"' + ", ";
                            }
                            sWhere = sWhere.substring(0, sWhere.length - 2);
                            sWhere += " )";
                        }
                        sWhere +=
                            " and Barcode IN (SELECT Barcode FROM " +
                            req.query.dataset_id +
                            "_meta ";
                        sWhereIn = "";
                        if (req.query.sampletype_id !== "") {
                            sWhereIn += 'WHERE SampleType = "' + req.query.sampletype_id + '"';
                        }
                        sWhereIn += ")";
                        sWhere += sWhereIn;
                        sQuery += sWhere + ") t1 LEFT JOIN ";
                        // add operation for Treg and TFH /////////////////////////////
                        var t2 = "";
                        t2 += "( SELECT Barcode, CellClusterType FROM ";
                        t2 += req.query.dataset_id + "_meta ";
                        sWhere = "";
                        if (req.query.sampletype_id !== "") {
                            sWhere += 'WHERE SampleType = "' + req.query.sampletype_id + '"';
                        }
                        t2 += sWhere + ") t2 ";
                        sQuery += t2 + "ON t1.Barcode = t2.Barcode";

                        connection.query(sQuery, function (err, result) {
                            if (err) {
                                connection.release();
                                console.log("query failed!");

                                throw err;
                            }
                            connection.release();
                            var json_result = result.map((v) => Object.assign({}, v));

                            tmp.file(function _tempFileCreated(
                                err,
                                path,
                                fd,
                                cleanupCallback
                            ) {
                                if (err) throw err;

                                const csvWriter = createCsvWriter({
                                    path: path,
                                    // Marker, EXP, CellClusterType
                                    header: [
                                        { id: "Barcode", title: "Barcode" },
                                        { id: "Marker", title: "Marker" },
                                        { id: "EXP", title: "EXP" },
                                        { id: "CellClusterType", title: "CellClusterType" },
                                    ],
                                });
                                csvWriter.writeRecords(json_result).then(() => {
                                    R("utils/GastricTME/rscripts/expression.R")
                                        .data({ csvPathFile: path })
                                        .call(function (errR, dR) {
                                            cleanupCallback();
                                            if (errR) throw errR;
                                            res.send(Object.assign(JSON.parse(dR), missedJSON));
                                        });
                                });
                            });
                        });
                    }
                });
            }
        });
    },
};
