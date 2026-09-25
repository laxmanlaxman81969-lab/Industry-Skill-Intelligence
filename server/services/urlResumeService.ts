// Secure Public Resume URL Fetcher with Anti-SSRF Protection
// Enforces: http/https only, private IP blocks, max 10MB size, timeout, redirect limit, auth-wall detection

import dns from 'dns';
import { URL } from 'url';

export interface FetchedResumeResource {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  sourceUrl: string;
}

export class UrlResumeService {
  private static instance: UrlResumeService;

  public static getInstance(): UrlResumeService {
    if (!UrlResumeService.instance) {
      UrlResumeService.instance = new UrlResumeService();
    }
    return UrlResumeService.instance;
  }

  /**
   * Fetches a resume from a public URL safely.
   */
  public async fetchResumeFromUrl(rawUrl: string): Promise<FetchedResumeResource> {
    const trimmed = (rawUrl || '').trim();
    if (!trimmed) {
      throw new Error('Please provide a valid resume URL.');
    }

    // 1. Protocol validation
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(trimmed);
    } catch {
      throw new Error('Invalid URL format. Please provide a complete URL starting with http:// or https://');
    }

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new Error('Unsupported protocol. Only http:// and https:// URLs are permitted.');
    }

    // 2. Auth-wall detection (LinkedIn, Indeed private candidate profiles)
    const hostname = parsedUrl.hostname.toLowerCase();
    if (
      hostname.includes('linkedin.com') ||
      hostname.includes('indeed.com') ||
      hostname.includes('naukri.com') ||
      hostname.includes('glassdoor.com')
    ) {
      throw new Error('This profile requires authentication and cannot be imported directly. Please upload your resume.');
    }

    // 3. SSRF IP & Hostname Validation
    await this.validateHostSafety(hostname);

    // 4. Safe fetch with redirect following and size limiting
    return await this.fetchWithRedirects(trimmed, 0);
  }

  /**
   * Resolves DNS and blocks private/loopback/cloud-metadata addresses.
   */
  private async validateHostSafety(hostname: string): Promise<void> {
    // Check known blocked hostnames
    const blockedHosts = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      '::1',
      'metadata.google.internal',
      '169.254.169.254'
    ];
    if (blockedHosts.includes(hostname) || hostname.endsWith('.local') || hostname.endsWith('.internal')) {
      throw new Error('Access to private or local network resources is strictly prohibited.');
    }

    // Check direct IPv4 literal
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
      if (this.isPrivateIp(hostname)) {
        throw new Error('Access to private or local network resources is strictly prohibited.');
      }
      return;
    }

    // Resolve domain to IP addresses
    try {
      const addresses = await dns.promises.resolve(hostname);
      for (const ip of addresses) {
        if (this.isPrivateIp(ip)) {
          throw new Error('Access to private or local network resources is strictly prohibited.');
        }
      }
    } catch (dnsErr: any) {
      if (dnsErr.message && dnsErr.message.includes('strictly prohibited')) throw dnsErr;
      throw new Error('Unable to access this resume URL. Hostname could not be resolved.');
    }
  }

  /**
   * Checks if an IP is in RFC1918, loopback, or cloud-metadata ranges.
   */
  private isPrivateIp(ip: string): boolean {
    if (ip === '127.0.0.1' || ip === '::1' || ip === '0.0.0.0') return true;
    const parts = ip.split('.').map(Number);
    if (parts.length === 4) {
      // 10.0.0.0/8
      if (parts[0] === 10) return true;
      // 172.16.0.0/12 (172.16 - 172.31)
      if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
      // 192.168.0.0/16
      if (parts[0] === 192 && parts[1] === 168) return true;
      // 169.254.0.0/16 (Link-local / cloud metadata)
      if (parts[0] === 169 && parts[1] === 254) return true;
      // 127.0.0.0/8
      if (parts[0] === 127) return true;
    }
    return false;
  }

  /**
   * Fetch resource with size limiting (10MB) and timeout (10s), supporting up to 3 redirects.
   */
  private async fetchWithRedirects(targetUrl: string, redirectCount: number): Promise<FetchedResumeResource> {
    if (redirectCount > 3) {
      throw new Error('Too many redirects encountered while fetching resume URL.');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SkillIntelligenceBot/1.0 (Resume Parser)',
          'Accept': 'text/html,application/pdf,application/xhtml+xml,application/xml;q=0.9,image/webp,image/png,image/jpeg,*/*;q=0.8'
        },
        redirect: 'manual',
        signal: controller.signal
      });

      // Handle redirect
      if ([301, 302, 303, 307, 308].includes(res.status)) {
        const location = res.headers.get('location');
        if (!location) throw new Error('Redirect with no location header.');
        const redirectUrl = new URL(location, targetUrl).toString();
        // Validate target host safety before following
        const nextHost = new URL(redirectUrl).hostname.toLowerCase();
        await this.validateHostSafety(nextHost);
        return await this.fetchWithRedirects(redirectUrl, redirectCount + 1);
      }

      if (!res.ok) {
        throw new Error(`Unable to access this resume URL (HTTP ${res.status}).`);
      }

      // Check Content-Length header
      const contentLength = parseInt(res.headers.get('content-length') || '0', 10);
      if (contentLength > 10 * 1024 * 1024) {
        throw new Error('The file at this URL exceeds the maximum allowed size (10 MB).');
      }

      const mimeType = (res.headers.get('content-type') || 'application/octet-stream').split(';')[0].trim().toLowerCase();
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (buffer.length > 10 * 1024 * 1024) {
        throw new Error('The file at this URL exceeds the maximum allowed size (10 MB).');
      }

      if (buffer.length === 0) {
        throw new Error('The file at this URL is empty.');
      }

      // Infer clean file name
      let fileName = 'Resume_Document';
      const disposition = res.headers.get('content-disposition');
      if (disposition && disposition.includes('filename=')) {
        const match = disposition.match(/filename=["']?([^"';]+)["']?/i);
        if (match) fileName = match[1].trim();
      } else {
        const pathname = new URL(targetUrl).pathname;
        const segment = pathname.split('/').filter(Boolean).pop();
        if (segment && segment.includes('.')) {
          fileName = decodeURIComponent(segment);
        } else if (mimeType.includes('pdf')) {
          fileName = 'Resume.pdf';
        } else if (mimeType.includes('html')) {
          fileName = 'Resume.html';
        } else if (mimeType.includes('png')) {
          fileName = 'Resume.png';
        } else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
          fileName = 'Resume.jpg';
        } else {
          fileName = 'Resume_Document.txt';
        }
      }

      return {
        buffer,
        fileName,
        mimeType,
        sourceUrl: targetUrl
      };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error('Connection timed out while trying to fetch the resume URL.');
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }
}
