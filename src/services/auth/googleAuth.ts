// Google OAuth / OpenID Connect (OIDC) Integration Service

export interface GoogleProfile {
  sub: string;
  name: string;
  email: string;
  picture?: string;
}

export interface GoogleAuthConfig {
  isConfigured: boolean;
  clientId: string | null;
  statusMessage: string;
}

export class GoogleAuthService {
  private static instance: GoogleAuthService;
  private clientId: string | null = null;
  private isLoaded = false;

  private constructor() {
    // Read from Vite environment variables
    const envClientId = typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID : null;
    this.clientId = envClientId && envClientId.trim() !== '' ? envClientId.trim() : null;
  }

  public static getInstance(): GoogleAuthService {
    if (!GoogleAuthService.instance) {
      GoogleAuthService.instance = new GoogleAuthService();
    }
    return GoogleAuthService.instance;
  }

  public getClientId(): string | null {
    if (this.clientId && this.clientId.trim() !== '') return this.clientId;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sih_google_client_id');
      if (stored && stored.trim() !== '') return stored.trim();
    }
    return null;
  }

  public setClientId(newId: string): void {
    if (typeof window !== 'undefined') {
      if (newId && newId.trim() !== '') {
        localStorage.setItem('sih_google_client_id', newId.trim());
      } else {
        localStorage.removeItem('sih_google_client_id');
      }
    }
  }

  public getConfig(): GoogleAuthConfig {
    const activeId = this.getClientId();
    if (activeId) {
      return {
        isConfigured: true,
        clientId: activeId,
        statusMessage: 'Google OAuth Client ID is configured and ready.'
      };
    }

    return {
      isConfigured: false,
      clientId: null,
      statusMessage:
        'Google OAuth requires a Client ID from Google Cloud Console. Set VITE_GOOGLE_CLIENT_ID in .env or provide your Client ID.'
    };
  }

  public async loadGoogleIdentityScript(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    if ((window as any).google?.accounts?.oauth2) {
      this.isLoaded = true;
      return true;
    }

    return new Promise((resolve) => {
      const existingScript = document.getElementById('google-client-script');
      if (existingScript) {
        if ((window as any).google?.accounts?.oauth2) {
          this.isLoaded = true;
          resolve(true);
        } else {
          existingScript.addEventListener('load', () => {
            this.isLoaded = true;
            resolve(true);
          });
        }
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-client-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.isLoaded = true;
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.head.appendChild(script);
    });
  }

  /**
   * Real Google OAuth 2.0 Flow:
   * Launches Google's actual authentication / account chooser popup with prompt='select_account'.
   * Google displays active accounts in the browser and the real 'Use another account' option.
   */
  public async promptGoogleOAuth(): Promise<{ success: boolean; profile?: GoogleProfile; error?: string }> {
    const activeId = this.getClientId();
    if (!activeId) {
      return {
        success: false,
        error: 'GOOGLE_CLIENT_ID_REQUIRED'
      };
    }

    const scriptLoaded = await this.loadGoogleIdentityScript();
    if (!scriptLoaded || !(window as any).google?.accounts?.oauth2) {
      return {
        success: false,
        error: 'Unable to load Google Identity Services from accounts.google.com. Please check your connection.'
      };
    }

    return new Promise((resolve) => {
      try {
        const google = (window as any).google;
        const tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: activeId,
          scope: 'openid profile email',
          prompt: 'select_account',
          callback: async (tokenResponse: any) => {
            if (tokenResponse.error) {
              resolve({
                success: false,
                error: tokenResponse.error_description || tokenResponse.error || 'Google authentication was cancelled.'
              });
              return;
            }

            if (!tokenResponse.access_token) {
              resolve({ success: false, error: 'No access token returned by Google.' });
              return;
            }

            try {
              // Retrieve the real authenticated Google account profile directly from Google
              const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                  Authorization: `Bearer ${tokenResponse.access_token}`
                }
              });

              if (!userInfoRes.ok) {
                resolve({ success: false, error: 'Failed to retrieve profile data from Google.' });
                return;
              }

              const userInfo = await userInfoRes.json();
              resolve({
                success: true,
                profile: {
                  sub: userInfo.sub,
                  name: userInfo.name || userInfo.email.split('@')[0],
                  email: userInfo.email,
                  picture: userInfo.picture
                }
              });
            } catch (err: any) {
              resolve({
                success: false,
                error: err.message || 'Error communicating with Google userinfo service.'
              });
            }
          },
          error_callback: (err: any) => {
            resolve({
              success: false,
              error: err.message || 'Google account chooser window was closed or dismissed.'
            });
          }
        });

        // Request token with explicit prompt='select_account' so Google displays all accounts + "Use another account"
        tokenClient.requestAccessToken({ prompt: 'select_account' });
      } catch (err: any) {
        resolve({
          success: false,
          error: err.message || 'Failed to initialize Google OAuth account chooser.'
        });
      }
    });
  }

  /**
   * Redirect OAuth Flow fallback if popups are blocked
   */
  public initiateGoogleRedirect(targetRole: string): void {
    const activeId = this.getClientId();
    if (!activeId || typeof window === 'undefined') return;

    const redirectUri = window.location.origin + '/login';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      activeId
    )}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=openid%20profile%20email&prompt=select_account&state=${encodeURIComponent(
      targetRole
    )}`;

    window.location.href = authUrl;
  }

  /**
   * Check for returned OAuth token in window.location.hash after redirect
   */
  public async handleRedirectHash(): Promise<{ role?: string; profile?: GoogleProfile } | null> {
    if (typeof window === 'undefined') return null;
    const hash = window.location.hash;
    if (!hash || !hash.includes('access_token')) return null;

    try {
      const params = new URLSearchParams(hash.replace(/^#/, ''));
      const accessToken = params.get('access_token');
      const stateRole = params.get('state') || 'student';

      if (!accessToken) return null;

      const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!userInfoRes.ok) return null;
      const userInfo = await userInfoRes.json();

      // Clean up the hash
      window.history.replaceState(null, '', window.location.pathname);

      return {
        role: stateRole,
        profile: {
          sub: userInfo.sub,
          name: userInfo.name || userInfo.email.split('@')[0],
          email: userInfo.email,
          picture: userInfo.picture
        }
      };
    } catch {
      return null;
    }
  }
}
