/**
 * LayerMark URL Matching Engine
 * Evaluates webpage URLs against Exact, Wildcard, Port, Path, and Regex rules.
 */

import { LayerMarkTag, UrlRule } from './types';

/**
 * Normalizes input URL string into a URL object safely.
 */
export function safeParseUrl(inputUrl: string): URL | null {
  if (!inputUrl) return null;
  try {
    // If URL lacks protocol, prepend http:// for parsing
    if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
      return new URL(`http://${inputUrl}`);
    }
    return new URL(inputUrl);
  } catch {
    return null;
  }
}

/**
 * Checks if a specific URL string matches a single UrlRule.
 */
export function matchesRule(url: string, rule: UrlRule): boolean {
  if (!rule.enabled || !rule.pattern) return false;

  const urlObj = safeParseUrl(url);
  if (!urlObj) return false;

  const pattern = rule.pattern.trim();
  const hostname = urlObj.hostname.toLowerCase();
  const port = urlObj.port || (urlObj.protocol === 'https:' ? '443' : '80');
  const host = `${hostname}${urlObj.port ? `:${urlObj.port}` : ''}`;
  const fullPath = `${hostname}${urlObj.pathname}${urlObj.search}`;
  const pathname = urlObj.pathname;

  switch (rule.type) {
    case 'exact-domain': {
      // Matches exact domain or exact host:port
      const cleanPattern = pattern.toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      return hostname === cleanPattern || host === cleanPattern;
    }

    case 'wildcard-domain': {
      // e.g. "*.staging.com", "*.prod.*", "dev.*", "*.stg.*", "*.uat.*"
      const cleanPattern = pattern.toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      
      // If pattern starts with `*.`, allow matching with or without preceding subdomains
      let basePattern = cleanPattern;
      let matchPrefix = '';
      if (basePattern.startsWith('*.')) {
        basePattern = basePattern.slice(2);
        matchPrefix = '(?:.*\\.)?';
      }

      // Escape all regex special chars except *
      const escaped = basePattern
        .replace(/[-[\]{}()+?.,\\^$|#\s]/g, '\\$&')
        .replace(/\*/g, '.*');

      const regex = new RegExp(`^${matchPrefix}${escaped}$`, 'i');
      return regex.test(hostname);
    }

    case 'port': {
      // e.g. "localhost:3000", "*:5173", "localhost:*", "127.0.0.1:8080"
      const cleanPattern = pattern.toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      const [targetHost, targetPort] = cleanPattern.split(':');

      if (!targetPort) {
        // Pattern was just a port like "3000"
        return port === targetHost;
      }

      // Check host part
      const hostMatch = targetHost === '*' || targetHost === hostname;
      // Check port part
      const portMatch = targetPort === '*' || targetPort === port || targetPort === urlObj.port;

      return hostMatch && portMatch;
    }

    case 'path-pattern': {
      // e.g. "/admin/*", "domain.com/admin/*", "*/checkout"
      let cleanPattern = pattern;
      if (cleanPattern.startsWith('/')) {
        // Match against pathname
        const escaped = cleanPattern.replace(/[-[\]{}()+.,\\^$|#\s]/g, '\\$&').replace(/\*/g, '.*');
        return new RegExp(`^${escaped}`, 'i').test(pathname);
      } else {
        // Match against host + path
        const stripped = cleanPattern.replace(/^https?:\/\//, '');
        const escaped = stripped.replace(/[-[\]{}()+.,\\^$|#\s]/g, '\\$&').replace(/\*/g, '.*');
        return new RegExp(`^${escaped}`, 'i').test(fullPath);
      }
    }

    case 'regex': {
      try {
        const regex = new RegExp(pattern, 'i');
        return regex.test(url);
      } catch {
        return false;
      }
    }

    default:
      return false;
  }
}

/**
 * Checks if a URL satisfies any of the enabled rules of a LayerMarkTag.
 */
export function matchesTag(url: string, tag: LayerMarkTag): boolean {
  if (!tag.enabled || !tag.rules || tag.rules.length === 0) {
    return false;
  }

  return tag.rules.some((rule) => matchesRule(url, rule));
}

/**
 * Filters and sorts all tags that match the given URL by priority (ascending: 0, 1, 2...).
 */
export function getMatchingTags(url: string, tags: LayerMarkTag[]): LayerMarkTag[] {
  if (!url || !tags) return [];

  return tags
    .filter((tag) => matchesTag(url, tag))
    .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
}
