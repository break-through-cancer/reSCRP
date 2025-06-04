var express = require("express");
var router = express.Router();
var counts = require("../module_counts");

// Move to utils
function sumObjectsByKey(objs) {
  return objs.reduce((a, b) => {
    for (let k in b) {
      if (b.hasOwnProperty(k))
        a[k] = (a[k] || 0) + b[k];
    }
    return a;
  }, {});
};

// Using the declared modules, filter out module counts
var objs = [];
process.env.MODULES.split(',').forEach((arg) => {
  if (arg in counts) {
    objs.push(counts[arg]);
  };
});

let total_count = sumObjectsByKey(objs);
total_count["studies"] = objs.length;


/* GET home page. */
router.get("/", function (req, res, next) {
  // const counts = {
  //   cells: 656742,
  //   patients: 670,
  //   samples: 401,
  //   organs: 21,
  //   cancers: 16,
  //   studies: 5
  // };
  res.render("index", { title: "SCRP", counts: total_count });
});

module.exports = router;
