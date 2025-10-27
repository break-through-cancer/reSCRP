//--------------------------------------------------------------//
// filename : routes/OvarianMRD/index.js
// date     : 2025-10-21
// desc     : Express router for Ovarian MRD module
//--------------------------------------------------------------//

const express = require("express");
const router = express.Router();
const pool = require("../../SQL/OvarianMRD/pool");

// Utility to ensure dataset_id is always defined
function ensureDataset(req) {
  // For all OvarianMRD queries, your main table prefix is ALL
  req.query.dataset_id = "ALL";
}

// -------------------------------------------------------------
// Overview page
// -------------------------------------------------------------
router.get("/OvarianMRD", (req, res) => {
  console.log("router OvarianMRD");
  res.render("OvarianMRD/index.pug", { title: "Ovarian MRD Overview" });
});

// -------------------------------------------------------------
// Embedding
// -------------------------------------------------------------
router.get("/OvarianMRD/embedding", (req, res, next) => {
  console.log("router OvarianMRD embedding");

  ensureDataset(req); // ✅ ensure dataset_id = ALL

  if (req.query.name === "dataset_id") {
    pool.querySampleAndCellType(req, res, next);
  } else if (req.query.name === "tissuetype_id") {
    pool.queryCellType(req, res, next);
  } else if (req.query.name === "submit") {
    pool.queryDist(req, res, next);
  } else {
    res.render("OvarianMRD/embedding.pug", { title: "Embedding" });
  }
});

// -------------------------------------------------------------
// DEGs
// -------------------------------------------------------------
router.get("/OvarianMRD/degs", (req, res, next) => {
  console.log("router OvarianMRD degs");

  ensureDataset(req); // ✅ ensure dataset_id = ALL

  if (req.query.name === "dataset_id") {
    pool.queryTable(req, res, next); // handles DataTables source
  } else if (req.query.name === "submit") {
    pool.queryDEGsIMG(req, res, next); // returns gene plot via R
  } else {
    res.render("OvarianMRD/degs.pug", { title: "DEGs" });
  }
});

// -------------------------------------------------------------
// Expression
// -------------------------------------------------------------
router.get("/OvarianMRD/expression", (req, res, next) => {
  console.log("router OvarianMRD expression");

  ensureDataset(req); // ✅ ensure dataset_id = ALL

  if (req.query.name === "dataset_id") {
    pool.querySampleAndCellType(req, res, next);
  } else if (req.query.name === "tissuetype_id") {
    pool.queryCellType(req, res, next);
  } else if (req.query.name === "submit") {
    pool.queryMarkerDist(req, res, next);
  } else {
    res.render("OvarianMRD/expression.pug", { title: "Expression" });
  }
});

// -------------------------------------------------------------
// (Optional) Downloads
// -------------------------------------------------------------
router.get("/OvarianMRD/download/meta", (req, res) => {
  res.download("public/DataDownload/OvarianMRD_meta.rds", "OvarianMRD_meta.rds");
});

router.get("/OvarianMRD/download/md5", (req, res) => {
  res.download("public/DataDownload/md5sum.txt", "md5sum.txt");
});

module.exports = router;
