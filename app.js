require('dotenv').config();

var createError = require("http-errors");
var express = require("express");
const helmet = require("helmet");
var path = require("path");
const hsts = require("hsts");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");

// Import authentication configuration (if enabled)
let authConfig = null;
if (process.env.AUTH_METHOD === 'oauth2') {
  console.log('=== Authentication Configuration ===');
  console.log('AUTH_METHOD: oauth2 (authentication ENABLED)');
  authConfig = require("./config/auth");

  if (authConfig.msalInstance) {
    console.log('✓ MSAL initialized successfully');
    console.log('✓ Azure AD OAuth2 with MSAL configured');
    console.log('  - Tenant ID:', process.env.AZURE_TENANT_ID ? '***' + process.env.AZURE_TENANT_ID.slice(-4) : 'NOT SET');
    console.log('  - Client ID:', process.env.AZURE_CLIENT_ID ? '***' + process.env.AZURE_CLIENT_ID.slice(-4) : 'NOT SET');
    console.log('  - Client Secret:', process.env.AZURE_CLIENT_SECRET ? 'SET' : 'NOT SET');
    console.log('  - Redirect URL:', process.env.AZURE_REDIRECT_URL || 'http://localhost:3000/auth/callback (default)');
  } else {
    console.error('✗ Failed to initialize MSAL');
  }
  console.log('===================================');
} else {
  console.log('=== Authentication Configuration ===');
  console.log('AUTH_METHOD:', process.env.AUTH_METHOD || '(not set)');
  console.log('Authentication is DISABLED - all routes are publicly accessible');
  console.log('To enable authentication, set AUTH_METHOD=oauth2 in your .env file');
  console.log('===================================');
}

var indexRouter = require("./routes/index");
var authRouter = require("./routes/auth");
var TCMRouter = require("./routes/TCM/index");
var GastricCancerRouter = require("./routes/GastricCancer/index");
var GastricTMERouter = require("./routes/GastricTME/index");
var BcellLCRouter = require("./routes/BcellLC/index");
var OvarianMRDRouter = require("./routes/OvarianMRD/index");

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

// Cookie parser (required for MSAL cookie-based auth)
const sessionSecret = process.env.SESSION_SECRET || 'your-secret-key-change-in-production';
app.use(cookieParser(sessionSecret));

// Serve static files BEFORE authentication middleware
// This ensures CSS, JS, images, etc. are always accessible
app.use(express.static(path.join(__dirname, "public")));

// Session configuration (still needed for CSRF state validation)
if (process.env.AUTH_METHOD === 'oauth2' && authConfig) {
  if (!process.env.SESSION_SECRET) {
    console.warn('⚠ WARNING: SESSION_SECRET not set, using default (not secure for production)');
  }

  const sessionMiddleware = session({
    secret: sessionSecret,
    resave: true,  // Force session to be saved even if unmodified
    saveUninitialized: true,  // Save new sessions (needed for OAuth state)
    name: 'scrp.sid',
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax',
      path: '/'
    }
  });

  app.use(sessionMiddleware);
  console.log('✓ Session management enabled (for CSRF protection)');

  // Middleware to check session for authenticated user and make available to routes
  app.use(function (req, res, next) {
    // Check if user exists in session
    if (req.session && req.session.user) {
      req.user = req.session.user.account;
      req.accessToken = req.session.user.accessToken;
      req.isAuthenticated = () => true;

      // Only log for non-static file requests
      if (!req.path.startsWith('/assets') && !req.path.startsWith('/stylesheets')) {
        console.log(`[Auth] User authenticated: ${req.session.user.email || req.session.user.displayName}`);
      }
    } else {
      req.isAuthenticated = () => false;

      // Only log for non-static file requests
      if (!req.path.startsWith('/assets') && !req.path.startsWith('/stylesheets')) {
        console.log(`[Auth] No authenticated user in session for: ${req.method} ${req.path}`);
      }
    }

    // Make user available in templates
    res.locals.user = req.user || null;
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.authEnabled = true;

    next();
  });

  console.log('✓ MSAL authentication middleware registered');
} else {
  // No authentication - make variables available but false
  app.use(function (req, res, next) {
    req.isAuthenticated = () => false;
    res.locals.user = null;
    res.locals.isAuthenticated = false;
    res.locals.authEnabled = false;
    next();
  });
}

// READ IN FROM CMD AND LOAD MODULE
const enabled_modules = process.env.MODULES.split(',');
const _routers = {
  'tcm': TCMRouter,
  'gastric_cancer': GastricCancerRouter,
  'gastric_tme': GastricTMERouter,
  'bcell_lc': BcellLCRouter,
  'ovarian_mrd': OvarianMRDRouter,
};
console.log("Routers available:", Object.keys(_routers));

// Register authentication router (only if enabled)
if (process.env.AUTH_METHOD === 'oauth2') {
  app.use("/auth", authRouter);
  console.log('✓ Authentication routes registered at /auth');
}

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
