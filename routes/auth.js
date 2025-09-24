const express = require('express');
const router = express.Router();

// Only set up routes if authentication is enabled
if (process.env.AUTH_METHOD !== 'oauth2') {
  // Return empty router if auth is not enabled
  module.exports = router;
} else {
  const { passport, ensureNotAuthenticated } = require('../config/auth');

// Login page
router.get('/login', ensureNotAuthenticated, function(req, res) {
  res.render('auth/login', {
    title: 'Login - SCRP',
    error: req.query.error
  });
});

// Initiate Azure AD login
router.get('/login/azure', ensureNotAuthenticated,
  passport.authenticate('azuread-openidconnect', {
    failureRedirect: '/login?error=azure_login_failed'
  })
);

// Azure AD callback
router.post('/callback',
  passport.authenticate('azuread-openidconnect', {
    successRedirect: '/',
    failureRedirect: '/login?error=authentication_failed'
  })
);

// Logout
router.get('/logout', function(req, res) {
  req.logout(function(err) {
    if (err) {
      console.error('Logout error:', err);
    }
    req.session.destroy(function(err) {
      if (err) {
        console.error('Session destroy error:', err);
      }
      res.redirect('/login');
    });
  });
});

// User profile (protected route)
router.get('/profile', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  res.render('auth/profile', {
    title: 'Profile - SCRP',
    user: req.user
  });
});

  module.exports = router;
}