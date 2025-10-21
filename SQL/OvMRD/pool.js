var mysql = require("mysql2");
var $conf = require("../../conf/OvMRD/conf");
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
      SampleIDs: "",
    });
  } else {
    res.send(ret);
  }
};

const aColumns = [
  "p_val",
  "avg_log2FC",
  "pct1",
  "pct2",
  "p_val_adj",
  "cluster",
  "gene",
];

module.exports = {
  querySampleAndCellType: function (req, res, next) {
    pool.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        connection.release();
        callback(null, err);
        throw err;
      }
      var resResult = [];
      var sqlString1 = $sql.SampleID.format({ table: req.query.dataset_id });
      connection.query(sqlString1, function (err, result) {
        resResult.push(result);
        var sqlString2 = $sql.CellType.format({
          table: req.query.dataset_id,
        });
        connection.query(sqlString2, function (err, result) {
          resResult.push(result);
          var sqlString3 = $sql.CellStatus.format({
            table: req.query.dataset_id,
          });
          connection.query(sqlString3, function (err, result) {
            resResult.push(result);
            sendResultFuc(res, resResult);
            connection.release();
          });
        });
      });
    });
  },

  queryCellType: function (req, res, next) {
    pool.getConnection(function (err, connection) {
      if (err) {
        connection.release();
        callback(null, err);
        throw err;
      }
      var sqlString =
        "SELECT DISTINCT CellType FROM " + req.query.dataset_id + "_meta";
      if (req.query.sample_id !== "") {
        sqlString += ' WHERE SampleID = "' + req.query.sample_id + '"';
      }

      connection.query(sqlString, function (err, result) {
        connection.release();
        sendResultFuc(res, result);
      });
    });
  },

  queryDist: function (req, res, next) {
    pool.getConnection(function (err, connection) {
      if (err) {
        connection.release();
        callback(null, err);
        throw err;
      }
      var sqlString = "";
      if (req.query.dataset_id === "") {
        connection.release();
      } else {
        if (req.query.sample_id === "" && req.query.celltype_id === "") {
          sqlString = $sql.DistD.format({ table: req.query.dataset_id });
        }
        if (req.query.sample_id === "" && req.query.celltype_id !== "") {
          sqlString = $sql.DistDC.format({
            table: req.query.dataset_id,
            celltype: req.query.celltype_id,
          });
        }
        if (req.query.sample_id !== "" && req.query.celltype_id === "") {
          sqlString = $sql.DistDS.format({
            table: req.query.dataset_id,
            sample: req.query.sample_id,
          });
        }
        if (req.query.sample_id !== "" && req.query.celltype_id !== "") {
          sqlString = $sql.DistDSC.format({
            table: req.query.dataset_id,
            sample: req.query.sample_id,
            celltype: req.query.celltype_id,
          });
        }
      }

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

          console.log("File:", path);
          console.log("File descripter:", fd);

          const csvWriter = createCsvWriter({
            path: path,
            header: [
              { id: "SampleID", title: "SampleID" },
              { id: "CellType", title: "CellType" },
              { id: "CellStatus", title: "CellStatus" },
              { id: "UMAP_1", title: "UMAP_1" },
              { id: "UMAP_2", title: "UMAP_2" },
            ],
          });
          csvWriter.writeRecords(json_result).then(() => {
            console.log(path + " write successfully!");

            R("utils/OvMRD/rscripts/embedding.R")
              .data({ csvPathFile: path })
              .call(function (errR, dR) {
                console.log("Logging errR: " + errR);
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
        callback(null, err);
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
    pool.getConnection(function (err, connection) {
      if (err) {
        connection.release();
        callback(null, err);
        throw err;
      }
      var request = req.query;
      var sTable = req.query.dataset_id + "_DEG";
      var sLimit = "";

      if (request["start"] && request["length"] != -1) {
        sLimit = "LIMIT " + request["start"] + ", " + request["length"];
      }

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

        sQuery = "SELECT FOUND_ROWS()";

        connection.query(sQuery, function selectCb(err, results, fields) {
          if (err) {
            console.log(err);
          }
          rResultFilterTotal = results;
          aResultFilterTotal = rResultFilterTotal;
          iFilteredTotal = aResultFilterTotal[0]["FOUND_ROWS()"];

          sQuery = "SELECT COUNT(*) FROM " + sTable;

          connection.query(sQuery, function selectCb(err, results, fields) {
            if (err) {
              console.log(err);
            }
            rResultTotal = results;
            aResultTotal = rResultTotal;
            iTotal = aResultTotal[0]["COUNT(*)"];

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
        callback(null, err);
        throw err;
      }
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
              { id: "UMAP_1", title: "UMAP_1" },
              { id: "UMAP_2", title: "UMAP_2" },
              { id: "CellType", title: "CellType" },
              { id: "EXP", title: "EXP" },
            ],
          });
          csvWriter.writeRecords(json_result).then(() => {
            R("utils/OvMRD/rscripts/degs.R")
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
        callback(null, err);
        throw err;
      }
      if (req.query.dataset_id === "") {
        connection.release();
        console.log("connection failed!");
      } else {
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
            callback(null, err);
            throw err;
          }
          var inItems = result.map((v) => v["Marker"]);
          var allItems = req.query.gene_id;
          diff = allItems.filter(function (x) {
            return inItems.indexOf(x) < 0;
          });

          var jsonStr = '{"missed": ' + JSON.stringify(diff) + "}";
          var missedJSON = JSON.parse(jsonStr);
          console.log(jsonStr);
          if (inItems.length == 0) {
            res.send(missedJSON);
          } else {
            var sQuery =
              "SELECT t1.Barcode, t1.Marker, t1.EXP, t2.CellType FROM (SELECT Barcode, Marker, EXP FROM ";
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

            sQuery += sWhere + ") t1 LEFT JOIN ";
            var t2 = "";
            t2 += "( SELECT Barcode, CellType FROM ";
            t2 += req.query.dataset_id + "_meta ";
            sWhere = "";

            if (req.query.sample_id !== "" && req.query.celltype_id !== "") {
              sWhere +=
                'WHERE ( SampleID = "' + req.query.sample_id + '"';
              sWhere +=
                ' AND CellType = "' + req.query.celltype_id + '" )';
            }
            if (req.query.sample_id === "" && req.query.celltype_id !== "") {
              sWhere += 'WHERE CellType = "' + req.query.celltype_id + '"';
            }
            if (req.query.sample_id !== "" && req.query.celltype_id === "") {
              sWhere += 'WHERE SampleID = "' + req.query.sample_id + '"';
            }

            t2 += sWhere + ") t2 ";
            sQuery += t2 + "ON t1.Barcode = t2.Barcode";

            connection.query(sQuery, function (err, result) {
              if (err) {
                connection.release();
                console.log("query failed!");
                callback(null, err);
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

                console.log("File:", path);

                const csvWriter = createCsvWriter({
                  path: path,
                  header: [
                    { id: "Barcode", title: "Barcode" },
                    { id: "Marker", title: "Marker" },
                    { id: "EXP", title: "EXP" },
                    { id: "CellType", title: "CellType" },
                  ],
                });
                csvWriter.writeRecords(json_result).then(() => {
                  console.log(path + " write successfully!");

                  R("utils/OvMRD/rscripts/expression.R")
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
