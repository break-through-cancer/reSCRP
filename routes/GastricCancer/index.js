var express = require("express");
var router = express.Router();
var pool = require("../../SQL/GastricCancer/pool");

/* GET home page. */

router.get("/GastricCancer", function (req, res, next) {
  console.log("router GastricCancer");
  res.render("GastricCancer/index.pug", { title: "Overview" });
});

router.get("/GastricCancer/embedding", function (req, res, next) {
  // console.log("router.get embedding lymphoma index js");
  if (req.query.name === "dataset_id") {
    pool.queryTissueAndCancer(req, res, next);
  } else if (req.query.name === "tissuetype_id") {
    // console.log("queryCancer index.js");
    pool.queryCancer(req, res, next);
  } else if (req.query.name === "submit") {
    pool.queryDist(req, res, next);
  } else {
    // console.log(req.query.name);
    res.render("GastricCancer/embedding.pug", { title: "Embedding" });
  }
});

router.get("/GastricCancer/degs", function (req, res, next) {
  console.log("router.get degs");
  if (req.query.name === "dataset_id") {
    pool.queryTable(req, res, next);
  } else if (req.query.name === "submit") {
    pool.queryDEGsIMG(req, res, next);
  } else {
    res.render("GastricCancer/degs.pug", { title: "DEGs" });
  }
});

router.get("/GastricCancer/expression", function (req, res, next) {
  console.log("router.get expression");
  if (req.query.name === "dataset_id") {
    pool.queryTissueAndCancer(req, res, next);
  } else if (req.query.name === "tissuetype_id") {
    pool.queryCancer(req, res, next);
  } else if (req.query.name === "submit") {
    pool.queryMarkerDist(req, res, next);
  } else {
    res.render("GastricCancer/expression.pug", { title: "Expression" });
  }
});

module.exports = router;
