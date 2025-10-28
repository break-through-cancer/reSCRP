var mysql = require("mysql2");
var $conf = require("../../conf/OvarianMRD/conf");
var $sql = require("./sqlMapping");
var R = require("r-script");

// Log database configuration (without password) - Debug only
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  console.log("🔗 OvarianMRD Database Configuration:");
  console.log("   Host:", $conf.mysql.host);
  console.log("   User:", $conf.mysql.user);
  console.log("   Database:", $conf.mysql.database);
  console.log("   Port:", $conf.mysql.port);
  console.log("   Connection Limit:", $conf.mysql.connectionLimit);
}

// Create connection pool
var pool = mysql.createPool($conf.mysql);

// Test database connection on startup
pool.getConnection(function (err, connection) {
  if (err) {
    // Always log errors
    console.error("❌ OvarianMRD Database connection FAILED:", err.message);
    console.error("   Error code:", err.code);
    console.error("   SQL State:", err.sqlState);
  } else {
    // Success message - production friendly
    console.log("✅ OvarianMRD Database connected");

    // Detailed info - debug only
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      connection.query("SELECT DATABASE() as db", function (err, result) {
        if (err) {
          console.error("❌ Database query test failed:", err.message);
        } else {
          console.log("   Database name:", result[0].db);
        }
        connection.release();
      });
    } else {
      connection.release();
    }
  }
});

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
  // -------------------------------------------------------------
  // Query distinct SampleID, CellType, and CellStatus
  // -------------------------------------------------------------
  querySampleAndCellType: function (req, res, next) {
    pool.getConnection(function (err, connection) {
      if (err) {
        console.error("❌ DB connection failed!", err.message);
        if (connection) connection.release(); // ✅ only release if exists
        return; // ✅ stop execution cleanly
      }
      var resResult = [];

      // 1️⃣ Get SampleIDs
      var sqlString1 = $sql.SampleID.format({ table: req.query.dataset_id });
      connection.query(sqlString1, function (err, result1) {
        if (err) console.log("Error fetching SampleID:", err);
        resResult.push(result1);

        // 2️⃣ Get CellTypes
        var sqlString2 = $sql.CellType.format({ table: req.query.dataset_id });
        connection.query(sqlString2, function (err, result2) {
          if (err) console.log("Error fetching CellType:", err);
          resResult.push(result2);

          // 3️⃣ Get CellStatuses
          var sqlString3 = $sql.CellStatus.format({ table: req.query.dataset_id });
          connection.query(sqlString3, function (err, result3) {
            if (err) console.log("Error fetching CellStatus:", err);

            // 🧩 Normalize result (case-insensitive key support)
            const normalized = result3.map(r => {
              const val = r.CellStatus || r.cellstatus || r["CellStatus"] || r["cellstatus"];
              return { value: val, label: val };
            });

            resResult.push(normalized);

            console.log("=== DEBUG: resResult ===");
            console.log(JSON.stringify(resResult, null, 2));

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
        console.error("❌ DB connection failed!", err.message);
        if (connection) connection.release();  // ✅ only release if it exists
        return;                                // ✅ safely exit without throwing
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
        if (connection) connection.release();
        console.error("❌ Connection failed!", err);
        return res.status(500).send("Database connection failed.");
      }
  
      // Ensure dataset_id is provided
      if (!req.query.dataset_id || req.query.dataset_id === "") {
        console.log("⚠️ No dataset_id specified!");
        connection.release();
        return res.status(400).send("Missing dataset_id parameter.");
      }
  
      // Build the dynamic table name (e.g. CD8T_meta, CD4T_meta)
      const tableName = `${req.query.dataset_id}_meta`;
      let sqlString = `SELECT SampleID, CellType, CellStatus, UMAP_1, UMAP_2 FROM ${tableName}`;
      let conditions = [];
  
      // Optional filters based on dropdowns
      if (req.query.sample_id && req.query.sample_id !== "") {
        conditions.push(`SampleID = "${req.query.sample_id}"`);
      }
      if (req.query.celltype_id && req.query.celltype_id !== "") {
        conditions.push(`CellType = "${req.query.celltype_id}"`);
      }
      if (req.query.cellstatus_id && req.query.cellstatus_id !== "") {
        conditions.push(`CellStatus = "${req.query.cellstatus_id}"`);
      }
  
      if (conditions.length > 0) {
        sqlString += " WHERE " + conditions.join(" AND ");
      }
  
      console.log("🧠 Final SQL Query:\n" + sqlString);
  
      // Run the query
      connection.query(sqlString, function (err, result) {
        connection.release();
        if (err) {
          console.error("❌ Query failed!", err);
          return res.status(500).send("Query execution failed.");
        }
  
        // If no data, return a warning instead of blank plot
        if (!result || result.length === 0) {
          console.warn("⚠️ Query returned no results.");
          return res.status(200).send({
            msg: "No data found for selected filters.",
            data: [],
          });
        }
  
        // Convert to JSON
        const json_result = result.map((v) => Object.assign({}, v));
  
        // Write temporary CSV
        tmp.file(function _tempFileCreated(err, path, fd, cleanupCallback) {
          if (err) throw err;
  
          console.log("📁 File created:", path);
          console.log("📄 File descriptor:", fd);
  
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
            console.log("✅ Data written to:", path);
  
            // Run R script to generate plots
            R("utils/OvarianMRD/rscripts/embedding.R")
              .data({ csvPathFile: path })
              .call(function (errR, dR) {
                cleanupCallback();
                console.log("🧾 Rscript log errR:", errR);
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
        console.error("❌ DB connection failed!", err.message);
        if (connection) connection.release();  // ✅ only release if it exists
        return;                                // ✅ safely exit without throwing
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
        console.error("❌ DB connection failed!", err.message);
        if (connection) connection.release();  // ✅ only release if it exists
        return;                                // ✅ safely exit without throwing
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
        console.error("❌ DB connection failed!", err.message);
        if (connection) connection.release();  // ✅ only release if it exists
        return;                                // ✅ safely exit without throwing
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
          console.log("❌ query failed!", err);
          if (connection) connection.release();
          res.status(500).json({ error: "Query failed", details: err.message });
          return;
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
            R("utils/OvarianMRD/rscripts/degs.R")
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
        console.error("❌ DB connection failed!", err.message);
        if (connection) connection.release();  // ✅ only release if it exists
        return;                                // ✅ safely exit without throwing
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
            console.log("❌ query failed!", err);
            if (connection) connection.release();
            res.status(500).json({ error: "Query failed", details: err.message });
            return;
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
                console.log("❌ query failed!", err);
                if (connection) connection.release();
                res.status(500).json({ error: "Query failed", details: err.message });
                return;
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

                  R("utils/OvarianMRD/rscripts/expression.R")
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
