import { User, UserRole } from '../../types';

export type { User, UserRole };
export type AccountStatus = 'active' | 'inactive' | 'suspended';
export type AuthProvider = 'local' | 'google';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: UserRole;
  accountStatus: AccountStatus;
  authProvider: AuthProvider;
  providerUserId?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  failedLoginAttempts: number;
  lockedUntil?: number; // timestamp ms
  resetToken?: string;
  resetTokenExpiresAt?: number;
}

export interface AuthSession {
  token: string;
  user: User;
  role: UserRole;
  expiresAt: number; // timestamp ms
  issuedAt: number;
  rememberMe: boolean;
  authProvider: AuthProvider;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
  rememberMe?: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  session?: AuthSession;
  error?: string;
  code?: 'INVALID_CREDENTIALS' | 'ACCOUNT_LOCKED' | 'ACCOUNT_INACTIVE' | 'UNAUTHORIZED_ROLE' | 'CONFIG_MISSING' | 'NETWORK_ERROR' | 'ACCOUNT_EXISTS';
}

export interface PasswordResetRequest {
  email: string;
  role: UserRole;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
  demoResetToken?: string; // Provided in development mode to test reset flow
}
