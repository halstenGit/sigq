import { PublicClientApplication, LogLevel } from '@azure/msal-browser'

// Your Azure AD (Entra ID) application configuration
const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_ENTRA_CLIENT_ID || 'your-client-id',
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_ENTRA_TENANT_ID || 'your-tenant-id'}/`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string) => {
        if (level === LogLevel.Error) {
          console.error(message)
        }
      },
    },
  },
}

// Initialize MSAL
export const msalInstance = new PublicClientApplication(msalConfig)

// Scopes for requesting access tokens
export const loginRequest = {
  scopes: ['openid', 'profile', 'email'],
}

// Scopes for getting tokens for API
export const apiTokenRequest = {
  scopes: [`api://${import.meta.env.VITE_ENTRA_CLIENT_ID || 'your-client-id'}/access_as_user`],
}
