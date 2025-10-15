const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Only set up routes if authentication is enabled
if (process.env.AUTH_METHOD !== 'oauth2') {
  // Return empty router if auth is not enabled
  module.exports = router;
} else {
  const { getAuthCodeUrl, acquireTokenByCode, ensureNotAuthenticated, getRedirectUri } = require('../config/auth');

  // Login - redirect directly to Azure AD (no login page needed)
  router.get('/login', ensureNotAuthenticated, async function(req, res, next) {
    console.log('=== Azure AD Login Attempt (MSAL) ===');
    console.log('Auth method:', process.env.AUTH_METHOD);
    console.log('Azure Tenant ID:', process.env.AZURE_TENANT_ID ? 'SET' : 'NOT SET');
    console.log('Azure Client ID:', process.env.AZURE_CLIENT_ID ? 'SET' : 'NOT SET');
    console.log('Azure Client Secret:', process.env.AZURE_CLIENT_SECRET ? 'SET' : 'NOT SET');
    console.log('Redirect URI:', getRedirectUri());
    console.log('Session ID:', req.sessionID);
    console.log('======================================');

    try {
      // Generate state and nonce for CSRF protection
      const state = crypto.randomBytes(16).toString('hex');
      const nonce = crypto.randomBytes(16).toString('hex');

      console.log('Generated state:', state);

      // Store state and nonce in session for validation
      req.session.authState = state;
      req.session.authNonce = nonce;

      console.log('Session data before save:', req.session);

      // Save session before redirect
      req.session.save(async function(err) {
        if (err) {
          console.error('Session save error:', err);
          return res.redirect('/auth/login?error=session_error');
        }

        console.log('Session saved successfully with state:', req.session.authState);

        try {
          // Get authorization URL from MSAL
          const authCodeUrl = await getAuthCodeUrl(state, nonce);
          console.log('Redirecting to Azure AD:', authCodeUrl);
          res.redirect(authCodeUrl);
        } catch (error) {
          console.error('Error generating auth URL:', error);
          res.redirect('/auth/login?error=azure_login_failed');
        }
      });
    } catch (error) {
      console.error('Error during Azure AD authentication setup:', error);
      res.redirect('/auth/login?error=azure_login_failed');
    }
  });

  // Alias for backward compatibility
  router.get('/login/azure', ensureNotAuthenticated, function(req, res) {
    res.redirect('/auth/login');
  });

  // Azure AD callback
  router.get('/callback', async function(req, res, next) {
    console.log('=== Azure AD Callback (MSAL) ===');
    console.log('Query params:', JSON.stringify(req.query, null, 2));
    console.log('Session ID:', req.sessionID);
    console.log('Session state:', req.session.authState);
    console.log('=================================');

    try {
      // Check for errors from Azure AD
      if (req.query.error) {
        console.error('Azure AD returned error:', req.query.error);
        console.error('Error description:', req.query.error_description);
        return res.redirect('/auth/login?error=azure_error');
      }

      // Validate state for CSRF protection
      if (!req.query.state || req.query.state !== req.session.authState) {
        console.error('State validation failed');
        console.error('Expected:', req.session.authState);
        console.error('Received:', req.query.state);
        return res.redirect('/auth/login?error=state_mismatch');
      }

      // Exchange authorization code for tokens
      const code = req.query.code;
      if (!code) {
        console.error('No authorization code received');
        return res.redirect('/auth/login?error=no_code');
      }

      console.log('Exchanging authorization code for tokens...');
      const tokenResponse = await acquireTokenByCode(code, req.query.state);

      console.log('=== Token Response Received ===');
      console.log('Account:', JSON.stringify(tokenResponse.account, null, 2));
      console.log('Access token:', tokenResponse.accessToken ? 'received' : 'not received');
      console.log('ID token:', tokenResponse.idToken ? 'received' : 'not received');
      console.log('Token expires on:', tokenResponse.expiresOn);
      console.log('===============================');

      // Create user object
      const user = {
        id: tokenResponse.account.homeAccountId,
        displayName: tokenResponse.account.name,
        email: tokenResponse.account.username,
        account: tokenResponse.account,
        accessToken: tokenResponse.accessToken,
        expiresOn: tokenResponse.expiresOn
      };

      console.log('\n=== USER LOGGED IN SUCCESSFULLY ===');
      console.log('User ID:', user.id);
      console.log('Display Name:', user.displayName);
      console.log('Email:', user.email);
      console.log('Account Details:', JSON.stringify(user.account, null, 2));
      console.log('Token Expiration:', new Date(user.expiresOn).toLocaleString());
      console.log('====================================\n');

      // Store user data in session (like btc-express-auth-example)
      req.session.user = {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        accessToken: user.accessToken,
        idToken: tokenResponse.idToken,
        account: user.account
      };

      console.log('User stored in session');

      // Clean up temporary session state
      delete req.session.authState;
      delete req.session.authNonce;

      // Redirect to the page they were trying to access, or home
      const returnTo = req.session.returnTo || '/';
      delete req.session.returnTo;
      console.log('Authentication successful, redirecting to:', returnTo);

      res.redirect(returnTo);

    } catch (error) {
      console.error('Error during token exchange:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      res.redirect('/auth/login?error=token_exchange_failed');
    }
  });

  // Logout
  router.get('/logout', function(req, res) {
    console.log('=== Logout ===');

    // Destroy session
    req.session.destroy(function(err) {
      if (err) {
        console.error('Session destroy error:', err);
      }

      // Redirect to Azure AD logout endpoint to fully sign out
      const postLogoutRedirectUri = process.env.AZURE_LOGOUT_REDIRECT_URL ||
                                    (process.env.AZURE_REDIRECT_URL ? process.env.AZURE_REDIRECT_URL.replace('/auth/callback', '/') : 'http://localhost:3000/');

      const logoutUrl = `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/logout?post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirectUri)}`;

      console.log('Redirecting to Azure AD logout:', logoutUrl);
      res.redirect(logoutUrl);
    });
  });

  // User profile (protected route)
  router.get('/profile', function(req, res) {
    // Check if user is in session
    if (!req.session || !req.session.user) {
      return res.redirect('/auth/login');
    }

    // Map Azure AD account fields to profile template fields
    const userProfile = {
      id: req.session.user.id,
      displayName: req.session.user.displayName,
      email: req.session.user.email,
      firstName: req.session.user.account.idTokenClaims?.given_name,
      lastName: req.session.user.account.idTokenClaims?.family_name,
      roles: req.session.user.account.idTokenClaims?.groups || []
    };

    res.render('auth/profile', {
      title: 'Profile - SCRP',
      user: userProfile
    });
  });

  module.exports = router;
}
