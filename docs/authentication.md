# Authentication Setup

This application optionally supports Azure AD OAuth2 authentication using Microsoft Authentication Library (MSAL) for Node.js with cookie-based session management.

## Enabling Authentication

Authentication is **disabled by default**. To enable authentication, set the `AUTH_METHOD` environment variable to `oauth2`:

```env
AUTH_METHOD=oauth2
```

When authentication is disabled:
- No login/logout links will appear in the navigation
- All routes are accessible without authentication
- No session management is performed

When authentication is enabled:
- Users must sign in with Azure AD to access the application
- Login/logout links appear in the navigation
- User sessions are managed with secure, httpOnly cookies
- Authentication state is stored in cookies (not server-side sessions)

## Azure AD Application Registration

1. **Register a new application in Azure AD:**
   - Go to [Azure Portal](https://portal.azure.com)
   - Navigate to "Azure Active Directory" > "App registrations"
   - Click "New registration"
   - Enter application name (e.g., "SCRP Authentication")
   - Select "Accounts in this organizational directory only"
   - Set Redirect URI to `http://localhost:3000/auth/callback` (for development)

2. **Configure the application:**
   - After registration, note down the "Application (client) ID"
   - Note down the "Directory (tenant) ID"
   - Go to "Certificates & secrets" and create a new client secret
   - Save the client secret value (you won't be able to see it again)

3. **Set redirect URIs:**
   - Go to "Authentication" section
   - Add platform "Web"
   - Add redirect URI: `http://localhost:3000/auth/callback` (development)
   - Add redirect URI: `https://your-domain.com/auth/callback` (production)
   - Under "Implicit grant and hybrid flows", enable "ID tokens"

## Environment Configuration

Update your `.env` file with the authentication configuration:

```env
# Application Configuration
NODE_ENV=development

# Authentication Configuration
AUTH_METHOD=oauth2
SESSION_SECRET=your-very-secure-session-secret-change-this-in-production

# Azure AD OAuth2 Configuration
AZURE_TENANT_ID=your-tenant-id-from-azure-ad
AZURE_CLIENT_ID=your-client-id-from-azure-ad
AZURE_CLIENT_SECRET=your-client-secret-from-azure-ad
AZURE_REDIRECT_URL=http://localhost:3000/auth/callback
```

**Important Notes:**
- `SESSION_SECRET` is used for cookie signing and CSRF state validation
- If `AUTH_METHOD` is not set to `oauth2`, all Azure AD configuration variables are ignored
- Use strong, random values for `SESSION_SECRET` in production

## Authentication Routes

When `AUTH_METHOD=oauth2`, the following routes are available:

- `/auth/login` - Login page
- `/auth/login/azure` - Initiate Azure AD OAuth2 flow
- `/auth/callback` - Azure AD callback endpoint (GET)
- `/auth/logout` - Logout and end session (also logs out of Azure AD)
- `/auth/profile` - User profile page (protected)

When authentication is disabled, these routes return 404.

## Protected Routes

To protect a route, use the `ensureAuthenticated` middleware:

```javascript
const { ensureAuthenticated } = require('../config/auth');

router.get('/protected-route', ensureAuthenticated, function(req, res) {
  // This route requires authentication
  res.render('protected-page', { user: req.user });
});
```

## User Object

After successful authentication, the user object is available via `req.user` and contains:

```javascript
{
  homeAccountId: 'unique-account-id',
  environment: 'login.windows.net',
  tenantId: 'tenant-id',
  username: 'john.doe@company.com',
  localAccountId: 'object-id',
  name: 'John Doe',
  idTokenClaims: {
    // Full ID token claims from Azure AD
  }
}
```

Additionally, `req.accessToken` contains the OAuth2 access token for making API calls.

## Template Variables

All templates have access to:
- `user` - Current user account object (if authenticated)
- `isAuthenticated` - Boolean indicating if user is logged in
- `authEnabled` - Boolean indicating if authentication is enabled

## How Cookie-Based Auth Works

This implementation uses MSAL for token exchange and stores authentication state in cookies:

1. **Login Flow:**
   - User clicks login and is redirected to Azure AD
   - Azure AD authenticates the user and redirects back with an authorization code
   - Server exchanges the code for tokens using MSAL
   - User account and tokens are stored in a signed, httpOnly cookie
   - Cookie expires after 24 hours or when tokens expire

2. **Authentication Check:**
   - On each request, the `ensureAuthenticated` middleware checks for the auth cookie
   - Cookie data is validated and parsed
   - If valid and not expired, `req.user` is populated
   - If invalid or expired, user is redirected to login

3. **Logout:**
   - Auth cookie is cleared
   - User is redirected to Azure AD logout endpoint
   - Azure AD clears its session and redirects back to login page

## Security Considerations

1. **Cookie Security:**
   - Cookies are httpOnly (not accessible via JavaScript)
   - Cookies are signed using SESSION_SECRET
   - Secure flag is automatically enabled in production (HTTPS only)
   - SameSite=lax provides CSRF protection

2. **Session Secret:**
   - Use a strong, unique session secret in production
   - Rotate session secrets periodically

3. **HTTPS:**
   - Always use HTTPS in production for OAuth2 flows
   - Cookies with secure flag only work over HTTPS

4. **Token Storage:**
   - Access tokens are stored in cookies (base64 encoded)
   - Tokens are only accessible server-side
   - Tokens expire and are validated on each request

5. **CSRF Protection:**
   - State parameter is validated during OAuth2 callback
   - State is stored in session and must match callback state

## Development vs Production

### Development
- Uses HTTP for redirect URIs
- Cookies are not secure (no HTTPS required)
- Detailed error logging with MSAL debug info
- Cookie parsing is more permissive

### Production
- Requires HTTPS for redirect URIs
- Secure cookies (HTTPS only)
- Minimal error logging (no PII)
- Set `NODE_ENV=production` in environment

## Troubleshooting

1. **"AADSTS50011: The redirect URI specified in the request does not match"**
   - Ensure redirect URI in Azure AD matches exactly with `AZURE_REDIRECT_URL`
   - Check for trailing slashes and protocol (http vs https)

2. **"Invalid client secret"**
   - Regenerate client secret in Azure AD and update `.env` file
   - Ensure there are no extra spaces in the secret value

3. **"State mismatch" or "State validation failed"**
   - Clear browser cookies and try again
   - Ensure `SESSION_SECRET` is set in your `.env` file
   - Check that cookies are enabled in your browser
   - Verify session middleware is configured before auth routes

4. **"Token exchange failed"**
   - Check MSAL logs in server console for detailed error
   - Verify all Azure AD configuration values are correct
   - Ensure authorization code is being received in callback

5. **"User not authenticated" or redirect loops**
   - Check if auth cookie is being set (browser dev tools > Application > Cookies)
   - Verify cookie domain and path are correct
   - Ensure `cookieParser` middleware is configured before auth routes
   - Check that token has not expired

6. **Cookie not persisting**
   - Verify `SESSION_SECRET` is set
   - Check cookie settings in browser (httpOnly, secure, sameSite)
   - In production, ensure HTTPS is being used
   - Clear all cookies and restart browser

## Migration from Passport.js

If you're upgrading from the previous Passport.js implementation:

1. **Dependencies:** `passport` and `passport-azure-ad` have been removed
2. **MSAL:** Now using `@azure/msal-node` for OAuth2
3. **Session Storage:** User data stored in cookies instead of server-side sessions
4. **Middleware:** Same `ensureAuthenticated` middleware works with cookies
5. **User Object:** Structure is slightly different (uses MSAL account object)
6. **No Breaking Changes:** All routes and environment variables remain the same
