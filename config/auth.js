const msal = require('@azure/msal-node');

// Only initialize if authentication is enabled
if (process.env.AUTH_METHOD !== 'oauth2') {
  console.log('Auth config: Skipping MSAL initialization (AUTH_METHOD not set to oauth2)');
  module.exports = {
    msalInstance: null,
    ensureAuthenticated: (req, res, next) => next(), // No-op middleware
    ensureNotAuthenticated: (req, res, next) => next(), // No-op middleware
    msalConfig: null
  };
  return;
}

console.log('Auth config: Initializing MSAL with Azure AD...');

// Validate required environment variables
const requiredVars = ['AZURE_TENANT_ID', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('✗ Missing required environment variables:', missingVars.join(', '));
  console.error('  Authentication will not work properly without these values.');
  console.error('  Please check your .env file and docs/authentication.md for setup instructions.');
}

// Check if placeholder values are still being used
const placeholderValues = ['your-azure-tenant-id', 'your-tenant-id', 'your-azure-application-client-id',
                            'your-client-id', 'your-azure-application-client-secret', 'your-client-secret'];
if (placeholderValues.includes(process.env.AZURE_TENANT_ID)) {
  console.error('✗ AZURE_TENANT_ID is set to a placeholder value. Please set it to your actual Azure tenant ID.');
  console.error('  You can find this in Azure Portal > Azure Active Directory > Overview > Tenant ID');
}
if (placeholderValues.includes(process.env.AZURE_CLIENT_ID)) {
  console.error('✗ AZURE_CLIENT_ID is set to a placeholder value. Please set it to your actual application client ID.');
  console.error('  You can find this in Azure Portal > App registrations > Your App > Overview > Application (client) ID');
}
if (placeholderValues.includes(process.env.AZURE_CLIENT_SECRET)) {
  console.error('✗ AZURE_CLIENT_SECRET is set to a placeholder value. Please set it to your actual client secret.');
  console.error('  You can create this in Azure Portal > App registrations > Your App > Certificates & secrets');
}

// MSAL configuration
const msalConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        if (containsPii) {
          return;
        }
        console.log('[MSAL]', message);
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Info,
    }
  }
};

console.log('Auth config: MSAL Authority:', msalConfig.auth.authority);

if (missingVars.length === 0 && !placeholderValues.includes(process.env.AZURE_TENANT_ID)) {
  console.log('Auth config: All required Azure AD variables are set');
}

// Create MSAL instance
let msalInstance;
try {
  msalInstance = new msal.ConfidentialClientApplication(msalConfig);
  console.log('Auth config: MSAL Confidential Client Application created successfully');
} catch (error) {
  console.error('✗ Failed to create MSAL instance:', error.message);
  throw error;
}

// Get redirect URI from environment or use default
const getRedirectUri = () => {
  return process.env.AZURE_REDIRECT_URL || 'http://localhost:3000/auth/callback';
};

// Get auth code URL for login
const getAuthCodeUrl = async (state, nonce) => {
  const authCodeUrlParameters = {
    scopes: ['openid', 'profile', 'email', 'offline_access'],
    redirectUri: getRedirectUri(),
    state: state,
    responseMode: 'query',
    prompt: 'select_account',
  };

  try {
    const authCodeUrl = await msalInstance.getAuthCodeUrl(authCodeUrlParameters);
    console.log('Auth config: Generated auth code URL');
    return authCodeUrl;
  } catch (error) {
    console.error('✗ Failed to generate auth code URL:', error);
    throw error;
  }
};

// Exchange authorization code for tokens
const acquireTokenByCode = async (code, state) => {
  const tokenRequest = {
    code: code,
    scopes: ['openid', 'profile', 'email', 'offline_access'],
    redirectUri: getRedirectUri(),
    state: state,
  };

  try {
    const response = await msalInstance.acquireTokenByCode(tokenRequest);
    console.log('Auth config: Successfully acquired token by code');
    return response;
  } catch (error) {
    console.error('✗ Failed to acquire token by code:', error);
    throw error;
  }
};

// Middleware to check if user is authenticated (via session)
function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }

  // Store the original URL they were trying to access
  req.session.returnTo = req.originalUrl;
  res.redirect('/auth/login');
}

// Middleware to check if user is not authenticated (for login page)
function ensureNotAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return res.redirect('/');
  }

  next();
}

module.exports = {
  msalInstance,
  msalConfig,
  getAuthCodeUrl,
  acquireTokenByCode,
  ensureAuthenticated,
  ensureNotAuthenticated,
  getRedirectUri
};
