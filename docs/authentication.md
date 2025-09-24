# Authentication Setup

This application optionally supports Azure AD OAuth2 authentication using Passport.js.

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
- User sessions are managed with secure cookies

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
   - Enable "ID tokens" under "Implicit grant and hybrid flows"

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

**Note:** If `AUTH_METHOD` is not set to `oauth2`, all Azure AD configuration variables are ignored and authentication is disabled.

## Authentication Routes

When `AUTH_METHOD=oauth2`, the following routes are available:

- `/auth/login` - Login page
- `/auth/login/azure` - Initiate Azure AD OAuth2 flow
- `/auth/callback` - Azure AD callback endpoint
- `/auth/logout` - Logout and end session
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

After successful authentication, the user object contains:

```javascript
{
  id: 'user-oid-from-azure',
  displayName: 'John Doe',
  email: 'john.doe@company.com',
  firstName: 'John',
  lastName: 'Doe',
  accessToken: 'azure-access-token',
  refreshToken: 'azure-refresh-token'
}
```

## Template Variables

All templates have access to:
- `user` - Current user object (if authenticated)
- `isAuthenticated` - Boolean indicating if user is logged in

## Security Considerations

1. **Session Secret:** Use a strong, unique session secret in production
2. **HTTPS:** Always use HTTPS in production for OAuth2 flows
3. **Cookie Security:** Secure cookies are automatically enabled in production
4. **Redirect URI Validation:** Azure AD validates redirect URIs, so ensure they match exactly

## Development vs Production

### Development
- Uses HTTP for redirect URIs
- Session cookies are not secure
- Detailed error logging

### Production
- Requires HTTPS for redirect URIs
- Secure session cookies
- Minimal error logging

## Troubleshooting

1. **"AADSTS50011: The redirect URI specified in the request does not match"**
   - Ensure redirect URI in Azure AD matches exactly with `AZURE_REDIRECT_URL`

2. **"Invalid client secret"**
   - Regenerate client secret in Azure AD and update `.env` file

3. **"User not authenticated"**
   - Check if session middleware is properly configured
   - Verify session secret is set

4. **"Cannot POST /auth/callback"**
   - Ensure callback route is configured for POST method
   - Check if Express URL encoded middleware is enabled