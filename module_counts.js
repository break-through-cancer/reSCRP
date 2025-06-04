/*
 * Module must be declared in the MODULES environment variable or
 * in the .env. E.g. MODULES=tcm,tcm2
  * */
var module_counts = {
  default: {
    cells: 0,
    patients: 0,
    samples: 0,
    organs: 0,
    cancers: 0,
  },
  tcm: {
    cells: 3000,
    patients: 30,
    samples: 10,
    organs: 5,
    cancers: 1,
  },
  gastric_cancer: {
    cells: 0,
    patients: 0,
    samples: 0,
    organs: 0,
    cancers: 0,
  },
  gastric_tme: {
    cells: 0,
    patients: 0,
    samples: 0,
    organs: 0,
    cancers: 0,
  },
  bcell_lc: {
    cells: 0,
    patients: 0,
    samples: 0,
    organs: 0,
    cancers: 0,
  },
  tcm2: {
    cells: 5555,
    patients: 70,
    samples: 11,
    organs: 3,
    cancers: 1,
  }
};

module.exports = module_counts;
