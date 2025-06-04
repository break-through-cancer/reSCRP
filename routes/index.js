var express = require("express");
var router = express.Router();
const counts = require("../module_counts");
const module_links = require("../module_links");
const modules = process.env.MODULES.split(',');

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

// Only sum the counts for modules which are declared in .env
let objs = [];
modules.forEach((arg) => {
  if (arg in counts) {
    objs.push(counts[arg]);
  };
});

let total_count = sumObjectsByKey(objs);
total_count["studies"] = objs.length;

// Only show links to modules which are declared in .env
const filtered_links = module_links.filter(item => modules.includes(item.module));

/* GET home page. */
router.get("/", function (req, res, next) {
  // const original_counts = {
  //   cells: 656742,
  //   patients: 670,
  //   samples: 401,
  //   organs: 21,
  //   cancers: 16,
  //   studies: 5
  // };
  res.render("index", { title: "SCRP", counts: total_count, links: filtered_links
  });
});

module.exports = router;
