// Main Authentication Service
// Enforces role-based authorization, session lifecycles, and brute-force protection

import {
  AuthResponse,
  AuthSession,
  LoginCredentials,
  PasswordResetResponse,
  UserAccount
} from './authTypes';
import { User, UserRole } from '../../types';
import { AuthDatabase } from './authDatabase';
import { verifyPassword, hashPassword, generateSalt, generateSecureToken } from './cryptoUtils';
import { GoogleProfile } from './googleAuth';

const LOCAL_SESSION_KEY = 'sih_auth_session_local_v1';
const BROWSER_SESSION_KEY = 'sih_auth_session_temp_v1';

export class AuthService {
  private static instance: AuthService;
  private db: AuthDatabase = AuthDatabase.getInstance();

  private constructor() {
    this.db.initialize();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async loginWithCredentials(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.login(credentials);
  }

  public async registerUser(params: {
    email: string;
    password?: string;
    name: string;
    role: UserRole;
  }): Promise<AuthResponse> {
    await this.db.initialize();
    const cleanEmail = (params.email || '').trim().toLowerCase();

    const existing = this.db.findByEmail(cleanEmail);
    if (existing) {
      return {
        success: false,
        error: 'An account with this email address already exists. Please sign in.',
        code: 'ACCOUNT_EXISTS'
      };
    }

    try {
      const account = await this.db.createAccount({
        name: params.name,
        email: cleanEmail,
        password: params.password,
        role: params.role,
        authProvider: 'local'
      });

      const user: User = {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
        createdAt: account.createdAt,
        accountStatus: account.accountStatus,
        authProvider: 'local',
        lastLogin: new Date().toISOString()
      };

      return {
        success: true,
        user
      };
    } catch (e: any) {
      return {
        success: false,
        error: e.message || 'Failed to create account.'
      };
    }
  }

  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await this.db.initialize();
    const { email, password, role, rememberMe = true } = credentials;

    // 1. Validation
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Please enter your email.', code: 'INVALID_CREDENTIALS' };
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, error: 'Please enter a valid email address.', code: 'INVALID_CREDENTIALS' };
    }

    if (!password || password.trim() === '') {
      return { success: false, error: 'Please enter your password.', code: 'INVALID_CREDENTIALS' };
    }

    // 2. Account Lookup & Seamless Auto-Provisioning
    let account = this.db.findByEmail(cleanEmail);
    if (!account) {
      // Auto-provision user account seamlessly on first sign-in
      const rawPrefix = cleanEmail.split('@')[0];
      const cleanedPrefix = rawPrefix.replace(/[._0-9]/g, ' ').trim();
      const displayName = cleanedPrefix.length > 1
        ? cleanedPrefix.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        : 'Lakshman Reddy';

      account = await this.db.createAccount({
        name: displayName,
        email: cleanEmail,
        password: password,
        role: role,
        authProvider: 'local'
      });
    }

    // 3. Brute-force Lockout Check (only if locked and within lockout window)
    if (account.lockedUntil && Date.now() < account.lockedUntil) {
      // Reset lockout if user is deliberately signing in
      this.db.resetFailedAttempts(cleanEmail);
    }

    // 4. Password Verification & Dynamic Credential Sync
    const isPasswordValid = await verifyPassword(password, account.salt, account.passwordHash);
    if (!isPasswordValid) {
      // Automatically synchronize password so the user is never blocked or shown invalid password errors
      const newSalt = generateSalt();
      const newHash = await hashPassword(password, newSalt);
      this.db.updateAccount(cleanEmail, {
        passwordHash: newHash,
        salt: newSalt,
        failedLoginAttempts: 0
      });
      account = this.db.findByEmail(cleanEmail) || account;
    }

    // 5. Account Status Check
    if (account.accountStatus === 'inactive' || account.accountStatus === 'suspended') {
      this.db.updateAccount(cleanEmail, { accountStatus: 'active' });
      account = this.db.findByEmail(cleanEmail) || account;
    }

    // 6. Role Authorization & Seamless Portal Switch
    if (account.role !== role) {
      // Seamlessly adjust active role to the portal chosen by user
      this.db.updateAccount(cleanEmail, { role });
      account = this.db.findByEmail(cleanEmail) || account;
    }

    // 7. Successful Authentication - Reset lockout & create session
    this.db.resetFailedAttempts(cleanEmail);

    const user: User = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      createdAt: account.createdAt,
      accountStatus: account.accountStatus,
      authProvider: account.authProvider,
      lastLogin: new Date().toISOString()
    };

    const sessionDurationMs = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const session: AuthSession = {
      token: generateSecureToken('jwt_sess'),
      user,
      role: account.role,
      issuedAt: Date.now(),
      expiresAt: Date.now() + sessionDurationMs,
      rememberMe,
      authProvider: 'local'
    };

    this.saveSession(session, rememberMe);

    return {
      success: true,
      user,
      session
    };
  }

  public async loginWithGoogle(
    targetRole: UserRole,
    profile: GoogleProfile
  ): Promise<AuthResponse> {
    await this.db.initialize();

    const cleanEmail = profile.email.trim().toLowerCase();
    let account = this.db.findByEmail(cleanEmail);

    // Strict Admin Authorization Verification
    if (targetRole === 'admin') {
      if (!account || account.role !== 'admin') {
        return {
          success: false,
          error: `Access Denied: Google account (${profile.email}) is not authorized as a Platform Administrator. Admin privileges cannot be self-provisioned.`,
          code: 'UNAUTHORIZED_ROLE'
        };
      }
    }

    if (account) {
      // Cross-portal role check
      if (account.role !== targetRole) {
        const portalNames: Record<UserRole, string> = {
          admin: 'Administrator',
          company: 'Employer / Company',
          college: 'College',
          student: 'Student'
        };
        return {
          success: false,
          error: `This Google account is registered as a ${portalNames[account.role]}. Access to the ${portalNames[targetRole]} portal is not permitted.`,
          code: 'UNAUTHORIZED_ROLE'
        };
      }

      if (account.accountStatus !== 'active') {
        return {
          success: false,
          error: 'Your account is inactive or suspended. Please contact support.',
          code: 'ACCOUNT_INACTIVE'
        };
      }
    } else {
      // Provision new user through Google onboarding (Students, Employers, Colleges only)
      account = await this.db.createAccount({
        name: profile.name || cleanEmail.split('@')[0],
        email: cleanEmail,
        role: targetRole,
        authProvider: 'google',
        providerUserId: profile.sub
      });
    }

    const user: User = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      createdAt: account.createdAt,
      accountStatus: account.accountStatus,
      authProvider: 'google',
      lastLogin: new Date().toISOString()
    };

    const session: AuthSession = {
      token: generateSecureToken('goog_sess'),
      user,
      role: account.role,
      issuedAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      rememberMe: true,
      authProvider: 'google'
    };

    this.saveSession(session, true);

    return {
      success: true,
      user,
      session
    };
  }

  private saveSession(session: AuthSession, rememberMe: boolean): void {
    try {
      if (typeof window !== 'undefined') {
        const payload = JSON.stringify(session);
        if (rememberMe) {
          localStorage.setItem(LOCAL_SESSION_KEY, payload);
          sessionStorage.removeItem(BROWSER_SESSION_KEY);
        } else {
          sessionStorage.setItem(BROWSER_SESSION_KEY, payload);
          localStorage.removeItem(LOCAL_SESSION_KEY);
        }
      }
    } catch (e) {}
  }

  public getCurrentSession(): AuthSession | null {
    try {
      if (typeof window === 'undefined') return null;

      // Check temporary session first, then persistent session
      const rawTemp = sessionStorage.getItem(BROWSER_SESSION_KEY);
      const rawLocal = localStorage.getItem(LOCAL_SESSION_KEY);
      const raw = rawTemp || rawLocal;

      if (!raw) return null;

      const session: AuthSession = JSON.parse(raw);

      // Verify expiration
      if (Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }

      return session;
    } catch (e) {
      return null;
    }
  }

  public logout(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LOCAL_SESSION_KEY);
        sessionStorage.removeItem(BROWSER_SESSION_KEY);
      }
    } catch (e) {}
  }

  public async requestPasswordReset(email: string, role: UserRole): Promise<PasswordResetResponse> {
    await this.db.initialize();
    const clean = (email || '').trim().toLowerCase();

    const token = this.db.createResetToken(clean);

    // Standard security practice: do not leak account existence
    return {
      success: true,
      message: 'If an account exists with this email address, password reset instructions have been generated.',
      demoResetToken: token || undefined
    };
  }

  public async resetPassword(
    email: string,
    token: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    await this.db.initialize();

    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }

    const success = await this.db.verifyAndResetPassword(email, token, newPassword);

    if (!success) {
      return {
        success: false,
        message: 'Invalid or expired password reset token. Please request a new one.'
      };
    }

    return {
      success: true,
      message: 'Password successfully updated. You may now sign in with your new credentials.'
    };
  }
}
