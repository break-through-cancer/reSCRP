require('dotenv').config();

var createError = require("http-errors");
var express = require("express");
const helmet = require("helmet");
var path = require("path");
const hsts = require("hsts");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var TCMRouter = require("./routes/TCM/index");
var TCMCustomRouter = require("./routes/TCM_Custom/index");
var GastricCancerRouter = require("./routes/GastricCancer/index");
var GastricTMERouter = require("./routes/GastricTME/index");
var BcellLCRouter = require("./routes/BcellLC/index");

require("events").EventEmitter.defaultMaxListeners = 200;

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.locals.basedir = app.get("views");

app.use(helmet.frameguard({ action: 'deny' }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// READ IN FROM CMD AND LOAD MODULE
const enabled_modules = process.env.MODULES.split(',');
const _routers = {
  'tcm': TCMRouter,
  'tcm_custom': TCMCustomRouter,
  'gastric_cancer': GastricCancerRouter,
  'gastric_tme': GastricTMERouter,
  'bcell_lc': BcellLCRouter,
};

// Register main index router
app.use("/", indexRouter);

// Register routers for enabled modules
enabled_modules.forEach(module => {
  if (module in _routers) {
    console.log('Registering module: ' + module);
    app.use("/", _routers[module]);
  } else {
    console.log('Module Router Not Found: ' + module);
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.use(hsts({
    maxAge: 31536000,        // Must be at least 1 year to be approved
    includeSubDomains: true, // Must be enabled to be approved
    preload: true
}));

module.exports = app;
