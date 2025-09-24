// Only initialize if authentication is enabled
if (process.env.AUTH_METHOD !== 'oauth2') {
  module.exports = {
    passport: null,
    ensureAuthenticated: (req, res, next) => next(), // No-op middleware
    ensureNotAuthenticated: (req, res, next) => next(), // No-op middleware
    azureConfig: null
  };
  return;
}

const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

// Azure AD configuration
const azureConfig = {
  identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0/.well-known/openid_configuration`,
  clientID: process.env.AZURE_CLIENT_ID,
  clientSecret: process.env.AZURE_CLIENT_SECRET,
  responseType: 'code',
  responseMode: 'form_post',
  redirectUrl: process.env.AZURE_REDIRECT_URL || 'http://localhost:3000/auth/callback',
  allowHttpForRedirectUrl: process.env.NODE_ENV !== 'production',
  validateIssuer: false,
  passReqToCallback: false,
  scope: ['profile', 'offline_access', 'openid'],
  loggingLevel: process.env.NODE_ENV === 'development' ? 'info' : 'error',
  nonceLifetime: null,
  nonceMaxAmount: 5,
  useCookieInsteadOfSession: false,
  cookieSameSite: false,
  clockSkew: null
};

// Initialize Passport strategy
passport.use(new OIDCStrategy(azureConfig,
  function(iss, sub, profile, accessToken, refreshToken, done) {
    // In a real application, you would save the user to your database here
    const user = {
      id: profile.oid,
      displayName: profile.displayName,
      email: profile.preferred_username || profile.upn,
      firstName: profile.given_name,
      lastName: profile.family_name,
      accessToken: accessToken,
      refreshToken: refreshToken
    };

    return done(null, user);
  }
));

// Serialize user for session
passport.serializeUser(function(user, done) {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Middleware to check if user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Middleware to check if user is not authenticated (for login page)
function ensureNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = {
  passport,
  ensureAuthenticated,
  ensureNotAuthenticated,
  azureConfig
};