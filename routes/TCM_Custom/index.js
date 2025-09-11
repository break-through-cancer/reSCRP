var express = require("express");
var router = express.Router();
var pool = require("../../SQL/TCM_Custom/pool");

/*
 * This module requires the pool db connection
 *
 * This module implements an:
 * 1 index route
 * 3 download routes
 * 1 embedding route
 * 1 deg route
 * 1 expression route
 *
 * For the download routes, it requires the rds file in the public directory
*/

// router.get("/TCM", function (req, res, next) {
// router.get("/TCM/download/CD8", function (req, res, next) {
// router.get("/TCM/download/CD4", function (req, res, next) {
// router.get("/TCM/download/MD5", function (req, res, next) {
// router.get("/TCM/embedding", function (req, res, next) {
// router.get("/TCM/degs", function (req, res, next) {
//router.get("/TCM/expression", function (req, res, next) {

/* GET home page. */

router.get("/TCM_Custom", function (req, res, next) {
  console.log("router TCM");
  res.render("TCM_Custom/index.jade", { title: "Overview" });
});

router.get("/TCM_Custom/download/CD8", function (req, res, next) {
    console.log("router TCM download CD8");
    return res.download("public/DataDownload/CD8_Obj_for_mapping.rds", 'CD8.rds', (err) => {
        if (err) {
        // Handle error if the file cannot be downloaded
            if(res.headersSent) {
                console.log("header has been sent!");
            }else{
                res.status(500).send('Error downloading the file.');
            }
        }
        });
    }
);

router.get("/TCM_Custom/download/CD4", function (req, res, next) {
    console.log("router TCM download CD4");
    return res.download("public/DataDownload/CD4_Obj_for_mapping.rds", 'CD4.rds', (err) => {
        if (err) {
        // Handle error if the file cannot be downloaded
            if(res.headersSent) {
                console.log("header has been sent!");
            }else{
                res.status(500).send('Error downloading the file.');
            }
        }
        });
    }
);

router.get("/TCM_Custom/download/MD5", function (req, res, next) {
    console.log("router TCM download MD5");
    return res.download("public/DataDownload/md5sum.txt", 'md5sum.txt', (err) => {
        if (err) {
        // Handle error if the file cannot be downloaded
            if(res.headersSent) {
                console.log("header has been sent!");
            }else{
                res.status(500).send('Error downloading the file.');
            }
        }
        });
    }
);

router.get("/TCM_Custom/embedding", function (req, res, next) {
  console.log("router.get embedding");
  if (req.query.name === "dataset_id") {
    switch (req.query.dataset_id.toLowerCase()) {
      case "cd4":
      case "cd8":
      case "innate":
      case "proliferative":
        pool.queryTissueAndCancer(req, res, next);
        break;

      case "treg":
      case "tfh":
        pool.queryTissueAndCancer12(req, res, next);
        break;
    }
  } else if (req.query.name === "tissuetype_id") {
    switch (req.query.dataset_id.toLowerCase()) {
      case "cd4":
      case "cd8":
      case "innate":
      case "proliferative":
        pool.queryCancer(req, res, next);
        break;

      case "treg":
      case "tfh":
        pool.queryCancer12(req, res, next);
        break;
    }
  } else if (req.query.name === "submit") {
    switch (req.query.dataset_id.toLowerCase()) {
      case "cd4":
      case "cd8":
      case "innate":
      case "proliferative":
        console.log("querydist");
        pool.queryDist(req, res, next);
        break;

      case "treg":
      case "tfh":
        pool.queryDist12(req, res, next);
        break;
    }
  } else {
    console.log(req.query.name);
    res.render("TCM_Custom/embedding.jade", { title: "Embedding" });
  }
});

router.get("/TCM_Custom/degs", function (req, res, next) {
  console.log("router.get degs");
  if (req.query.name === "dataset_id") {
    pool.queryTable(req, res, next);
  } else if (req.query.name === "submit") {
    pool.queryDEGsIMG(req, res, next);
  } else {
    res.render("TCM_Custom/degs.jade", { title: "DEGs" });
  }
});

router.get("/TCM_Custom/expression", function (req, res, next) {
  console.log("router.get expression");
  if (req.query.name === "dataset_id") {
    switch (req.query.dataset_id.toLowerCase()) {
      case "cd4":
      case "cd8":
      case "innate":
      case "proliferative":
        pool.queryTissueAndCancer(req, res, next);
        break;

      case "treg":
      case "tfh":
        pool.queryTissueAndCancer12(req, res, next);
        break;
    }
  } else if (req.query.name === "tissuetype_id") {
    switch (req.query.dataset_id.toLowerCase()) {
      case "cd4":
      case "cd8":
      case "innate":
      case "proliferative":
        pool.queryCancer(req, res, next);
        break;

      case "treg":
      case "tfh":
        pool.queryCancer12(req, res, next);
        break;
    }
  } else if (req.query.name === "submit") {
    pool.queryMarkerDist(req, res, next);
  } else {
    res.render("TCM_Custom/expression.jade", { title: "Expression" });
  }
});

module.exports = router;
