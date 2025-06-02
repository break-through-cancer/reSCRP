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
var GastricCancerRouter = require("./routes/GastricCancer/index");
var GastricTMERouter = require("./routes/GastricTME/index");
var BcellLCRouter = require("./routes/BcellLC/index");

require("events").EventEmitter.defaultMaxListeners = 200;

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.locals.basedir = app.get("views");

app.use(helmet.frameguard({ action: 'deny' }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// READ IN FROM CMD AND LOAD MODULE
const _modules = {
  'tcm': TCMRouter,
  'gastric_cancer': GastricCancerRouter,
  'gastric_tme': GastricTMERouter,
  'bcell_lc': BcellLCRouter,
};

// Register main index router
app.use("/", indexRouter);

// Register declared modules
process.env.MODULES.split(',').forEach((arg) => {
  if (arg in _modules) {
    console.log('Registering module: ' + arg);
    app.use("/", _modules[arg]);
  } else {
    console.log('Module not found: ' + arg);
  }
});

// TO REMOVE
// app.use("/", TCMRouter);
// app.use("/", GastricCancerRouter);
// app.use("/", GastricTMERouter);
// app.use("/", BcellLCRouter);

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
