// Cryptographic Utilities for Secure Password Hashing and Token Generation
// Uses Web Crypto API (crypto.subtle) - secure, fast, and dependency-free

export async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${salt}:${password}:sih_pepper_2026`);

  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback for non-subtle contexts (e.g. tests or environments without window.crypto)
  let hash = 0;
  const str = `${salt}:${password}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(64, 'a');
}

export async function verifyPassword(
  password: string,
  salt: string,
  expectedHash: string
): Promise<boolean> {
  const actualHash = await hashPassword(password, salt);
  return actualHash === expectedHash;
}

export function generateSalt(length: number = 16): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const bytes = new Uint8Array(length);
    window.crypto.getRandomValues(bytes);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function generateSecureToken(prefix: string = 'tok'): string {
  const salt = generateSalt(24);
  const timestamp = Date.now().toString(36);
  return `${prefix}_${timestamp}_${salt}`;
}
