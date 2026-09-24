// Auth Database & Account Repository
// Manages persisted user credentials, salt storage, rate-limiting locks, and reset tokens

import { UserAccount, UserRole } from './authTypes';
import { hashPassword, generateSalt } from './cryptoUtils';

const STORAGE_KEY = 'sih_auth_accounts_v1';

// Pre-configured fixed salts and default test credentials
const DEFAULT_SALT = 'sih_seed_salt_98765';

// Pre-seeded accounts configuration
interface SeedUserConfig {
  id: string;
  name: string;
  email: string;
  defaultPlainPassword: string;
  role: UserRole;
}

export const PRECONFIGURED_USERS: SeedUserConfig[] = [
  {
    id: 'usr-admin-1',
    name: 'System Administrator',
    email: 'admin@skillplatform.gov.in',
    defaultPlainPassword: 'Admin@Platform2026',
    role: 'admin'
  },
  {
    id: 'usr-company-1',
    name: 'ABC Technologies HR',
    email: 'hiring@abctech.com',
    defaultPlainPassword: 'Company@Pass2026',
    role: 'company'
  },
  {
    id: 'usr-college-1',
    name: 'Apex Institute of Technology',
    email: 'dean@apextech.edu.in',
    defaultPlainPassword: 'College@Pass2026',
    role: 'college'
  },
  {
    id: 'usr-student-1',
    name: 'Lakshman Reddy',
    email: 'lakshman@skillplatform.edu',
    defaultPlainPassword: 'Student@Pass2026',
    role: 'student'
  },
  {
    id: 'usr-student-2',
    name: 'Lakshman Reddy',
    email: 'laxmanlaxman81969@gmail.com',
    defaultPlainPassword: 'Student@Pass2026',
    role: 'student'
  }
];

export class AuthDatabase {
  private static instance: AuthDatabase;
  private accounts: Map<string, UserAccount> = new Map();
  private initialized = false;

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): AuthDatabase {
    if (!AuthDatabase.instance) {
      AuthDatabase.instance = new AuthDatabase();
    }
    return AuthDatabase.instance;
  }

  private loadFromStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const list: UserAccount[] = JSON.parse(raw);
          list.forEach((acc) => this.accounts.set(acc.email.toLowerCase(), acc));
        }
      }
    } catch (e) {
      console.warn('Could not read auth storage, initializing fresh store.');
    }
  }

  private saveToStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const list = Array.from(this.accounts.values());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      }
    } catch (e) {
      console.warn('Could not save auth storage.');
    }
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    // Seed default users if they do not yet exist
    for (const conf of PRECONFIGURED_USERS) {
      const emailKey = conf.email.toLowerCase();
      if (!this.accounts.has(emailKey)) {
        const salt = DEFAULT_SALT;
        const passwordHash = await hashPassword(conf.defaultPlainPassword, salt);

        const account: UserAccount = {
          id: conf.id,
          name: conf.name,
          email: conf.email,
          passwordHash,
          salt,
          role: conf.role,
          accountStatus: 'active',
          authProvider: 'local',
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
          failedLoginAttempts: 0
        };

        this.accounts.set(emailKey, account);
      }
    }

    this.saveToStorage();
    this.initialized = true;
  }

  public findByEmail(email: string): UserAccount | null {
    const key = (email || '').trim().toLowerCase();
    return this.accounts.get(key) || null;
  }

  public findById(id: string): UserAccount | null {
    for (const acc of this.accounts.values()) {
      if (acc.id === id) return acc;
    }
    return null;
  }

  public async createAccount(data: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    authProvider?: 'local' | 'google';
    providerUserId?: string;
  }): Promise<UserAccount> {
    await this.initialize();
    const key = data.email.trim().toLowerCase();

    const salt = generateSalt();
    const passwordHash = data.password ? await hashPassword(data.password, salt) : '';

    const newAcc: UserAccount = {
      id: `usr-${data.role}-${Date.now()}`,
      name: data.name,
      email: data.email.trim(),
      passwordHash,
      salt,
      role: data.role,
      accountStatus: 'active',
      authProvider: data.authProvider || 'local',
      providerUserId: data.providerUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      failedLoginAttempts: 0
    };

    this.accounts.set(key, newAcc);
    this.saveToStorage();
    return newAcc;
  }

  public updateAccount(email: string, updates: Partial<UserAccount>): UserAccount | null {
    const key = email.trim().toLowerCase();
    const existing = this.accounts.get(key);
    if (!existing) return null;

    const updated: UserAccount = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.accounts.set(key, updated);
    this.saveToStorage();
    return updated;
  }

  public recordFailedAttempt(email: string): { attempts: number; isLocked: boolean; lockMinutesRemaining?: number } {
    const key = email.trim().toLowerCase();
    const acc = this.accounts.get(key);
    if (!acc) return { attempts: 0, isLocked: false };

    acc.failedLoginAttempts += 1;

    // Lock account after 5 consecutive failed attempts
    if (acc.failedLoginAttempts >= 5) {
      acc.lockedUntil = Date.now() + 5 * 60 * 1000; // 5 minutes lock
      this.saveToStorage();
      return {
        attempts: acc.failedLoginAttempts,
        isLocked: true,
        lockMinutesRemaining: 5
      };
    }

    this.saveToStorage();
    return { attempts: acc.failedLoginAttempts, isLocked: false };
  }

  public resetFailedAttempts(email: string): void {
    const key = email.trim().toLowerCase();
    const acc = this.accounts.get(key);
    if (acc) {
      acc.failedLoginAttempts = 0;
      acc.lockedUntil = undefined;
      acc.lastLogin = new Date().toISOString();
      this.saveToStorage();
    }
  }

  public createResetToken(email: string): string | null {
    const key = email.trim().toLowerCase();
    const acc = this.accounts.get(key);
    if (!acc) return null;

    // 15 minutes expiration token
    const token = `rst_${Math.floor(100000 + Math.random() * 900000)}`;
    acc.resetToken = token;
    acc.resetTokenExpiresAt = Date.now() + 15 * 60 * 1000;
    this.saveToStorage();
    return token;
  }

  public async verifyAndResetPassword(email: string, token: string, newPassword: string): Promise<boolean> {
    const key = email.trim().toLowerCase();
    const acc = this.accounts.get(key);
    if (!acc) return false;

    if (!acc.resetToken || acc.resetToken !== token.trim()) {
      return false;
    }

    if (!acc.resetTokenExpiresAt || Date.now() > acc.resetTokenExpiresAt) {
      return false;
    }

    // Salt and hash new password
    const newSalt = generateSalt();
    const newHash = await hashPassword(newPassword, newSalt);

    acc.salt = newSalt;
    acc.passwordHash = newHash;
    acc.resetToken = undefined;
    acc.resetTokenExpiresAt = undefined;
    acc.failedLoginAttempts = 0;
    acc.lockedUntil = undefined;
    acc.updatedAt = new Date().toISOString();

    this.saveToStorage();
    return true;
  }
}
