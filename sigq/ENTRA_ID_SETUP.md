# Entra ID (Azure AD) Setup Guide

This document explains how to configure Entra ID authentication for SIGQ.

## Overview

SIGQ uses a two-step authentication process:

1. **Frontend**: Users authenticate with Entra ID (Microsoft Azure AD) using MSAL (Microsoft Authentication Library)
2. **Backend**: The frontend exchanges the Entra ID token for a JWT token issued by our API

This approach keeps the SECRET_KEY secure and allows for custom claims and permissions management.

## Backend Setup

### 1. Entra ID Application Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations** → **New registration**
3. Enter application name: "SIGQ API"
4. Select **Accounts in this organizational directory only** (or your preferred option)
5. Click **Register**

### 2. Configure Application

1. Go to **Settings** → **Authentication**
   - Add Platform → Web
   - Redirect URI: `http://localhost:8000/auth/callback` (for dev)
   - Enable "Access tokens" and "ID tokens"

2. Go to **Certificates & secrets**
   - Create a new Client Secret
   - Copy the Value (you'll need this)

3. Go to **Manifest**
   - Find "accessTokenAcceptedVersion" and set to `2`

### 3. Set Environment Variables

Update `sigq/backend/.env`:

```
ENTRA_TENANT_ID=your-directory-id
ENTRA_CLIENT_ID=your-application-id
ENTRA_CLIENT_SECRET=your-client-secret
```

Get these values from Azure Portal:
- **Tenant ID**: Directory (tenant) ID from the Overview page
- **Client ID**: Application (client) ID from the Overview page
- **Client Secret**: From Certificates & secrets

## Frontend Setup

### 1. Register Frontend Application

In Azure Portal, register another application for the frontend:

1. **Azure Active Directory** → **App registrations** → **New registration**
2. Enter application name: "SIGQ Frontend"
3. Select **Accounts in this organizational directory only**
4. Platform → Web
   - Redirect URI: `http://localhost:5173`
   - Redirect URI: `http://localhost:5173/`
5. Click **Register**

### 2. Configure API Permissions

For the frontend app:

1. Go to **API permissions** → **Add a permission**
2. Select **APIs my organization uses**
3. Search for and select your backend app (SIGQ API)
4. Select **access_as_user** scope
5. Grant admin consent

### 3. Set Environment Variables

Update `sigq/frontend/.env`:

```
VITE_ENTRA_TENANT_ID=your-directory-id
VITE_ENTRA_CLIENT_ID=frontend-application-id
VITE_API_URL=http://localhost:8000
```

## Testing the Authentication Flow

### 1. Start Backend

```bash
cd sigq/backend
pip install -e .
uvicorn app.main:app --reload
```

### 2. Start Frontend

```bash
cd sigq/frontend
npm install
npm run dev
```

### 3. Test Login

1. Open `http://localhost:5173` in your browser
2. Click "Entrar com Microsoft"
3. Sign in with your Microsoft account
4. You should be redirected back and authenticated in SIGQ

### 4. Test API Endpoints

The frontend automatically adds the JWT token to all API requests. Test with:

```bash
# Get current user info
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:8000/v1/auth/me

# Get empreendimentos
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:8000/v1/empreendimentos
```

## Production Deployment

### Important Changes

1. Update environment variables in your deployment platform:
   - Set `SECRET_KEY` to a strong, random value
   - Update Entra ID redirect URIs to match your domain
   - Update API URLs

2. Enable HTTPS (required for Entra ID)

3. Update CORS origins in backend config to match frontend domain

4. Configure database (PostgreSQL recommended for production)

## Troubleshooting

### "Token invalid or expired"

- Check that ENTRA_TENANT_ID and ENTRA_CLIENT_ID are correct
- Verify the token hasn't expired
- Check browser console for MSAL errors

### "Redirect URI mismatch"

- Ensure the redirect URI in Azure Portal matches exactly
- Include trailing slash if needed

### "API permission errors"

- Verify that the frontend app has permission to access the backend app
- Grant admin consent in Azure Portal

### CORS errors

- Check that frontend URL is in CORS_ORIGINS in `sigq/backend/app/core/config.py`

## References

- [MSAL React Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react)
- [Azure AD Documentation](https://docs.microsoft.com/en-us/azure/active-directory/)
- [PyJWT Documentation](https://pyjwt.readthedocs.io/)
