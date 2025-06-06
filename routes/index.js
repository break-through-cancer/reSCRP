var express = require("express");
var router = express.Router();
const study_modules = require("../study_modules");
const enabled_modules = process.env.MODULES.split(',');

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
  const counts = study_modules
    .filter(k => enabled_modules.includes(k.module))
    .map(k => k.counts);

  let total_count = sumObjectsByKey(counts);
  total_count["studies"] = counts.length;

  const links = study_modules
    .filter(k => enabled_modules.includes(k.module))
    .map(k => k.link);
  res.render("index", { title: "SCRP", counts: total_count, links: links});
});

module.exports = router;
