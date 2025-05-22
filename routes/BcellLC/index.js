var express = require("express");
var router = express.Router();
var pool = require("../../SQL/BcellLC/pool");


/* GET home page. */
router.get("/BcellLC", function (req, res, next) {
    console.log("router BcellLC");
    res.render("BcellLC/index.jade", { title: "Overview" });
});

router.get("/BcellLC/embedding", function (req, res, next) {
    console.log("router.get embedding");
    console.log(req.query.name);
    if (req.query.name === "options") {
        console.log("router.get options");
        pool.queryOptions(req, res, next);
    } else if (req.query.name === "submit") {
        console.log("router.queryDist");
        pool.queryDist(req, res, next);
    } else {
        res.render("BcellLC/embedding.jade", { title: "Embedding" });
    }
});

router.get("/BcellLC/degs", function (req, res, next) {
    console.log("router.get degs");
    console.log(req.query.name);
    if (req.query.name === "DEG") {
        console.log("DEG");
        pool.queryTable(req, res, next);
    } else if (req.query.name === "submit") {
        pool.queryDEGsIMG(req, res, next);
    } else {
        res.render("BcellLC/degs.jade", { title: "DEGs" });
    }
});

router.get("/BcellLC/expression", function (req, res, next) {
    console.log("router.get expression");
    if (req.query.name === "options") {
        console.log("router.get options");
        pool.queryOptions(req, res, next);
    } else if (req.query.name === "submit") {
        pool.queryMarkerDist(req, res, next);
    } else {
        res.render("BcellLC/expression.jade", { title: "Expression" });
    }
});

router.get("/BcellLC/bcr", function (req, res, next) {
    console.log("router.get bcr");
    if (req.query.name === "options") {
        console.log("router.get options");
        pool.queryOptions(req, res, next);
    } else if (req.query.name === "submit") {
        pool.queryBCRDist(req, res, next);
    } else {
        res.render("BcellLC/bcr.jade", { title: "BCR" });
    }
});

module.exports = router;
