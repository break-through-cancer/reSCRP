//--------------------------------------------------------------//
// filename : pool.js
// Date : 2021-11-30
// contributor : Yanshuo Chu
// function: pool
//--------------------------------------------------------------//
var mysql = require("mysql2");
var $conf = require("../../conf/BcellLC/conf");
var $sql = require("./sqlMapping");
var R = require("r-script");
var pool = mysql.createPool($conf.mysql);

const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const tmp = require("tmp");

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
            TissueTypes: "",
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
    queryOptions: function (req, res, next) {
        console.log("query options in embedding page");
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                console.log("connection failed!");
                callback(null, err);
                throw err;
            }
            var resResult = [];
            // dynamic sql string, based on all value position ////////////////
            // step1 : dynamic generate the sql query /////////////////////////
            // step2 : generate return data based on the query result /////////
            var sqlString = "SELECT DISTINCT Field, Gender, Stage, Smoking, Mut from B_meta";
            var sWhere = "";
            if ((req.query.field_id !== "ALL" && req.query.field_id !== "") ||
                (req.query.gender_id !== "ALL" && req.query.gender_id !== "") ||
                (req.query.stage_id !== "ALL" && req.query.stage_id !== "") ||
                (req.query.smoking_id !== "ALL" && req.query.smoking_id !== "") ||
                (req.query.mut_id !== "ALL" && req.query.mut_id !== "")){
                sWhere = " WHERE (";
                if(req.query.field_id !== "" && req.query.field_id !== "ALL"){
                    sWhere += 'Field = "' + req.query.field_id + '" and ';
                }
                if(req.query.gender_id !== "" && req.query.gender_id !== "ALL"){
                    sWhere += 'Gender = "' + req.query.gender_id + '" and ';
                }
                if(req.query.stage_id !== "" && req.query.stage_id !== "ALL"){
                    sWhere += 'Stage = "' + req.query.stage_id + '" and ';
                }
                if(req.query.smoking_id !== "" && req.query.smoking_id !== "ALL"){
                    sWhere += 'Smoking = "' + req.query.smoking_id + '" and ';
                }
                if(req.query.mut_id !== "" && req.query.mut_id !== "ALL"){
                    sWhere += 'Mut = "' + req.query.mut_id + '" and ';
                }
                sWhere = sWhere.substring(0, sWhere.length - 5);
                sWhere += ")";
            }
            sqlString += sWhere;

            console.log("sqlString");
            console.log(sqlString);
            connection.query(sqlString, function (err, result) {
                // here genereate unique items of each column in result ///////
                // console.log(result);
                // console.log(new Set(result.map(({Field}) => Field)));
                // console.log(new Set(result.map(({Gender}) => Gender)));
                // console.log(new Set(result.map(({Stage}) => Stage)));
                // console.log(new Set(result.map(({Smoking}) => Smoking)));
                // console.log(new Set(result.map(({Mut}) => Mut)));
                connection.release();
                resResult = {
                    "Field": Array.from(new Set(result.map(({Field}) => Field))),
                    "Gender": Array.from(new Set(result.map(({Gender}) => Gender))),
                    "Stage": Array.from(new Set(result.map(({Stage}) => Stage))),
                    "Smoking": Array.from(new Set(result.map(({Smoking}) => Smoking))),
                    "Mut": Array.from(new Set(result.map(({Mut}) => Mut)))};
                // console.log(resResult);
                sendResultFuc(res, resResult);
            });
        });
    },

    queryDist: function (req, res, next) {
        console.log("queryDist");
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                callback(null, err);
                throw err;
            }

            var sqlString = "SELECT Field, Gender, Stage, Smoking, Mut, CellClusterType, UMAP1, UMAP2 from B_meta";
            var sWhere = "";

            if ((req.query.field_id !== "ALL" && req.query.field_id !== "") ||
                (req.query.gender_id !== "ALL" && req.query.gender_id !== "") ||
                (req.query.stage_id !== "ALL" && req.query.stage_id !== "") ||
                (req.query.smoking_id !== "ALL" && req.query.smoking_id !== "") ||
                (req.query.mut_id !== "ALL" && req.query.mut_id !== "")){
                sWhere = " WHERE (";
                if(req.query.field_id !== "" && req.query.field_id !== "ALL"){
                    sWhere += 'Field = "' + req.query.field_id + '" and ';
                }
                if(req.query.gender_id !== "" && req.query.gender_id !== "ALL"){
                    sWhere += 'Gender = "' + req.query.gender_id + '" and ';
                }
                if(req.query.stage_id !== "" && req.query.stage_id !== "ALL"){
                    sWhere += 'Stage = "' + req.query.stage_id + '" and ';
                }
                if(req.query.smoking_id !== "" && req.query.smoking_id !== "ALL"){
                    sWhere += 'Smoking = "' + req.query.smoking_id + '" and ';
                }
                if(req.query.mut_id !== "" && req.query.mut_id !== "ALL"){
                    sWhere += 'Mut = "' + req.query.mut_id + '" and ';
                }
                sWhere = sWhere.substring(0, sWhere.length - 5);
                sWhere += ")";
            }


            sqlString += sWhere;

            console.log("sqlString");
            console.log(sqlString);
            connection.query(sqlString, function (err, result) {
                if (err) {
                    connection.release();
                    callback(null, err);
                    throw err;
                }
                connection.release();

                var json_result = result.map((v) => Object.assign({}, v));

                tmp.file(function _tempFileCreated(err, path, fd, cleanupCallback) {
                    if (err) throw err;
                    const csvWriter = createCsvWriter({
                        path: path,
                        header: [
                            // var sqlString = "SELECT Field, Gender, Stage, Smoking, CellClusterType, UMAP1, UMAP2 from B_meta";
                            { id: "Field", title: "Field" },
                            { id: "Gender", title: "Gender" },
                            { id: "Stage", title: "Stage" },
                            { id: "Smoking", title: "Smoking" },
                            { id: "Mut", title: "Mut" },
                            { id: "CellClusterType", title: "CellClusterType" },
                            { id: "UMAP1", title: "UMAP1" },
                            { id: "UMAP2", title: "UMAP2" },
                        ],
                    });
                    csvWriter.writeRecords(json_result).then(() => {
                        // console.log(path + "write successfully!");
                        R("utils/BcellLC/rscripts/embedding.R")
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

    queryTable: function server(req, res, next) {
        //Paging
        console.log("queryTable");
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                callback(null, err);
                throw err;
            }
            var request = req.query;
            var sTable = "B_DEG";
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
                    // console.log("sOrder == ORDER BY");
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

            console.log("sQuery");
            console.log(sQuery);

            connection.query(sQuery, function selectCb(err, results, fields) {
                // console.log("squery return!!");
                if (err) {
                    console.log(err);
                }
                // console.log("squery result");
                // console.log(results);
                rResult = results;

                //Data set length after filtering
                sQuery = "SELECT FOUND_ROWS()";

                connection.query(sQuery, function selectCb(err, results, fields) {
                    if (err) {
                        console.log(err);
                    }
                    // console.log("squery found rows result");
                    // console.log(results);
                    rResultFilterTotal = results;
                    aResultFilterTotal = rResultFilterTotal;
                    iFilteredTotal = aResultFilterTotal[0]["FOUND_ROWS()"];

                    //Total data set length
                    sQuery = "SELECT COUNT(*) FROM " + sTable;

                    connection.query(sQuery, function selectCb(err, results, fields) {
                        if (err) {
                            console.log(err);
                        }
                        // console.log("total rows");
                        // console.log(results);
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
                        // console.log(output);
                        res.status(200).send(output);
                        connection.release();
                    });
                });
            });
        });
    },

    queryDEGsIMG: function (req, res, next) {
        // console.log("queryDEGsIMG");
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                callback(null, err);
                throw err;
            }
            // here 4 occasions  //////////////////////////////////////////////
            var sqlString = "";
            if (req.query.gene_id === "") {
                connection.release();
                // console.log("connection failed!");
            } else {
                sqlString = $sql.DEGsIMG.format({gene: req.query.gene_id});
            }

            connection.query(sqlString, function (err, result) {
                // console.log("query");
                if (err) {
                    connection.release();
                    // console.log("query failed!");
                    callback(null, err);
                    throw err;
                }
                connection.release();
                // console.log(result);
                var json_result = result.map((v) => Object.assign({}, v));

                tmp.file(function _tempFileCreated(err, path, fd, cleanupCallback) {
                    if (err) throw err;

                    // console.log("File:", path);
                    // console.log("File descripter:", fd);

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
                        // console.log(path + "write successfully!");

                        R("utils/BcellLC/rscripts/degs.R")
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
        // console.log("queryMarkerDist");
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                console.log("connection failed!");
                callback(null, err);
                throw err;
            }
            if (req.query.dataset_id === "") {
                connection.release();
                console.log("connection failed!");
            } else {
                // check if marker in the EXP table
                var cQuery =
                    "SELECT distinct Marker FROM B_EXP WHERE Marker IN (";
                for (var i = 0; i < req.query.gene_id.length; i++) {
                    cQuery += '"' + req.query.gene_id[i] + '"' + ", ";
                }
                cQuery = cQuery.substring(0, cQuery.length - 2);
                cQuery += " )";

                connection.query(cQuery, function (err, result) {
                    if (err) {
                        connection.release();
                        console.log("query failed!");
                        callback(null, err);
                        throw err;
                    }
                    var inItems = result.map((v) => v["Marker"]);
                    var allItems = req.query.gene_id;
                    console.log(allItems);
                    diff = allItems.filter(function (x) {
                        return inItems.indexOf(x) < 0;
                    });

                    var jsonStr = '{"missed": ' + JSON.stringify(diff) + "}";
                    var missedJSON = JSON.parse(jsonStr);
                    console.log(jsonStr);
                    if (inItems.length == 0) {
                        res.send(missedJSON);
                    } else {
                        // console.log("req.query.tissuetype_id");
                        // console.log(req.query.tissuetype_id);
                        // console.log(req.query.cancertype_id);
                        ///////////////////////////////////////////////////////////////
                        //          filter cell dynamically and generate sql         //
                        ///////////////////////////////////////////////////////////////
                        var sQuery =
                            "SELECT t1.Barcode, t1.Marker, t1.EXP, t2.CellClusterType FROM (SELECT Barcode, Marker, EXP FROM B_EXP ";
                        var sWhere = "";
                        if (req.query.gene_id != "") {
                            sWhere = "WHERE Marker IN ( ";
                            for (var i = 0; i < req.query.gene_id.length; i++) {
                                sWhere += '"' + req.query.gene_id[i] + '"' + ", ";
                            }
                            sWhere = sWhere.substring(0, sWhere.length - 2);
                            sWhere += " )";
                        }

                        sQuery += sWhere + ") t1 LEFT JOIN ";
                        // add operation for Treg and TFH /////////////////////////////
                        var t2 = "";
                        t2 += "( SELECT Barcode, CellClusterType FROM B_meta ";
                        sWhere = "";

                        if ((req.query.field_id !== "ALL" && req.query.field_id !== "") ||
                            (req.query.gender_id !== "ALL" && req.query.gender_id !== "") ||
                            (req.query.stage_id !== "ALL" && req.query.stage_id !== "") ||
                            (req.query.smoking_id !== "ALL" && req.query.smoking_id !== "") ||
                            (req.query.mut_id !== "ALL" && req.query.mut_id !== "")){
                            sWhere = " WHERE (";
                            if(req.query.field_id !== "" && req.query.field_id !== "ALL"){
                                sWhere += 'Field = "' + req.query.field_id + '" and ';
                            }
                            if(req.query.gender_id !== "" && req.query.gender_id !== "ALL"){
                                sWhere += 'Gender = "' + req.query.gender_id + '" and ';
                            }
                            if(req.query.stage_id !== "" && req.query.stage_id !== "ALL"){
                                sWhere += 'Stage = "' + req.query.stage_id + '" and ';
                            }
                            if(req.query.smoking_id !== "" && req.query.smoking_id !== "ALL"){
                                sWhere += 'Smoking = "' + req.query.smoking_id + '" and ';
                            }
                            if(req.query.mut_id !== "" && req.query.mut_id !== "ALL"){
                                sWhere += 'Mut = "' + req.query.mut_id + '" and ';
                            }
                            sWhere = sWhere.substring(0, sWhere.length - 5);
                            sWhere += ")";
                        }

                        t2 += sWhere + ") t2 ";
                        sQuery += t2 + "ON t1.Barcode = t2.Barcode";

                        console.log("sQuery");
                        console.log(sQuery);
                        // console.log("begin query");
                        connection.query(sQuery, function (err, result) {
                            if (err) {
                                connection.release();
                                console.log("query failed!");
                                callback(null, err);
                                throw err;
                            }
                            connection.release();
                            // console.log(result);
                            var json_result = result.map((v) => Object.assign({}, v));

                            tmp.file(function _tempFileCreated(
                                err,
                                path,
                                fd,
                                cleanupCallback
                            ) {
                                if (err) throw err;

                                // console.log("File:", path);
                                // console.log("File descripter:", fd);

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
                                    // console.log(path + "write successfully!");

                                    R("utils/BcellLC/rscripts/expression.R")
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

    queryBCRDist: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                throw err;
            }

            var sqlString = "SELECT a.CellClusterType, a.Field, a.Gender, a.Stage, a.Smoking, a.Mut, b.clone_id, a.UMAP1, a.UMAP2 from B_meta a LEFT JOIN B_BCR b ON a.Barcode = b.cell_id";
            var sWhere = "";
            if ((req.query.field_id !== "ALL" && req.query.field_id !== "") ||
                (req.query.gender_id !== "ALL" && req.query.gender_id !== "") ||
                (req.query.stage_id !== "ALL" && req.query.stage_id !== "") ||
                (req.query.smoking_id !== "ALL" && req.query.smoking_id !== "") ||
                (req.query.mut_id !== "ALL" && req.query.mut_id !== "")){
                sWhere = " WHERE (";
                if(req.query.field_id !== "" && req.query.field_id !== "ALL"){
                    sWhere += 'a.Field = "' + req.query.field_id + '" and ';
                }
                if(req.query.gender_id !== "" && req.query.gender_id !== "ALL"){
                    sWhere += 'a.Gender = "' + req.query.gender_id + '" and ';
                }
                if(req.query.stage_id !== "" && req.query.stage_id !== "ALL"){
                    sWhere += 'a.Stage = "' + req.query.stage_id + '" and ';
                }
                if(req.query.smoking_id !== "" && req.query.smoking_id !== "ALL"){
                    sWhere += 'a.Smoking = "' + req.query.smoking_id + '" and ';
                }
                if(req.query.mut_id !== "" && req.query.mut_id !== "ALL"){
                    sWhere += 'a.Mut = "' + req.query.mut_id + '" and ';
                }
                sWhere = sWhere.substring(0, sWhere.length - 5);
                sWhere += ") ";
            }

            sqlString += sWhere;
            console.log("sqlString");
            console.log(sqlString);

            connection.query(sqlString, function (err, result1) {
                connection.release();
                if (err) {
                    throw err;
                }

                var json_result = result1.map((v) => Object.assign({}, v));
                tmp.file(function _tempFileCreated(err, path, fd, cleanupCallback) {
                    if (err) throw err;
                    const csvWriter = createCsvWriter({
                        path: path,
                        // t2.UMAP1, t2.UMAP2, t2.CellClusterType, t1.EXP
                        header: [
                            { id: "CellClusterType", title: "CellClusterType"},
                            { id: "Field", title: "Field"},
                            { id: "Gender", title: "Gender"},
                            { id: "Stage", title: "Stage"},
                            { id: "Smoking", title: "Smoking"},
                            { id: "Mut", title: "Mut"},
                            { id: "clone_id", title: "clone_id"},
                            { id: "UMAP1", title: "UMAP1"},
                            { id: "UMAP2", title: "UMAP2"},
                        ],
                    });
                    csvWriter.writeRecords(json_result).then(() => {
                        console.log(path);
                        R("utils/BcellLC/rscripts/bcr.R")
                            .data({ csvPathFile: path })
                            .call(function (errR, dR) {
                                cleanupCallback();
                                // console.log(dR);
                                if (errR) throw errR;
                                res.send(JSON.parse(dR));
                            });
                    });
                });
            });
        });
    },
};
