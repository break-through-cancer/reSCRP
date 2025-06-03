var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  // const module_counts = {
  //   tcm: {
  //     cells: '3000',
  //     patients: '30',
  //     samples: '10',
  //     organs: '5',
  //     cancers: '1',
  //   }
  // };
  // process.env.MODULES.split(',').forEach((arg) => {
  //   // Sum modules
  //   console.log("Module: " + arg);
  // });
  const counts = {
    cells: 656742,
    patients: 670,
    samples: 401,
    organs: 21,
    cancers: 16,
    studies: 5
  };
  res.render("index", { title: "SCRP", counts: counts });
});

module.exports = router;
