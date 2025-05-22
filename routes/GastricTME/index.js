var express = require("express");
var router = express.Router();
var pool = require("../../SQL/GastricTME/pool");

/* GET home page. */

router.get("/GastricTME", function (req, res, next) {
  console.log("router GastricTME");
  res.render("GastricTME/index.jade", { title: "Overview" });
});

router.get("/GastricTME/embedding", function (req, res, next) {
  // console.log("Embedding:!!!!!");
  if (req.query.name === "dataset_id") {
    // console.log("dataset_id:!!!!!");
    pool.querySample(req, res, next);
  } else if (req.query.name === "submit") {
    pool.queryDist(req, res, next);
  } else {
    res.render("GastricTME/embedding.jade", { title: "Embedding" });
  }
});


router.get("/GastricTME/degs", function (req, res, next) {
  console.log("router.get degs");
  if (req.query.name === "dataset_id") {
    pool.queryTable(req, res, next);
  } else if (req.query.name === "submit") {
    pool.queryDEGsIMG(req, res, next);
  } else {
    res.render("GastricTME/degs.jade", { title: "DEGs" });
  }
});

router.get("/GastricTME/expression", function (req, res, next) {
  console.log("router.get expression");
  if (req.query.name === "dataset_id") {
    pool.querySample(req, res, next);
  } else if (req.query.name === "submit") {
    pool.queryMarkerDist(req, res, next);
  } else {
    res.render("GastricTME/expression.jade", { title: "Expression" });
  }
});

module.exports = router;
