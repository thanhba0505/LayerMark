import { describe, it, expect } from 'vitest';
import { matchesRule, matchesTag, getMatchingTags } from './matcher';
import { LayerMarkTag, UrlRule } from './types';

describe('LayerMark URL Matcher Engine', () => {
  describe('exact-domain', () => {
    const rule: UrlRule = {
      id: 'r1',
      type: 'exact-domain',
      pattern: 'example.com',
      enabled: true,
    };

    it('matches exact domain', () => {
      expect(matchesRule('https://example.com/some/path', rule)).toBe(true);
      expect(matchesRule('http://example.com', rule)).toBe(true);
    });

    it('does not match subdomains or different domains', () => {
      expect(matchesRule('https://api.example.com', rule)).toBe(false);
      expect(matchesRule('https://anotherexample.com', rule)).toBe(false);
    });
  });

  describe('wildcard-domain', () => {
    const ruleSubdomain: UrlRule = {
      id: 'r2',
      type: 'wildcard-domain',
      pattern: '*.staging.app.com',
      enabled: true,
    };

    const ruleWildcardProd: UrlRule = {
      id: 'r3',
      type: 'wildcard-domain',
      pattern: '*.prod.*',
      enabled: true,
    };

    it('matches subdomains with wildcard', () => {
      expect(matchesRule('https://api.staging.app.com/dashboard', ruleSubdomain)).toBe(true);
      expect(matchesRule('https://web.staging.app.com', ruleSubdomain)).toBe(true);
    });

    it('matches any domain with prod in it', () => {
      expect(matchesRule('https://api.prod.mycompany.com', ruleWildcardProd)).toBe(true);
      expect(matchesRule('https://auth.prod.internal.net', ruleWildcardProd)).toBe(true);
    });
  });

  describe('port matching', () => {
    const localhost3000: UrlRule = {
      id: 'r4',
      type: 'port',
      pattern: 'localhost:3000',
      enabled: true,
    };

    const anyPort5173: UrlRule = {
      id: 'r5',
      type: 'port',
      pattern: '*:5173',
      enabled: true,
    };

    const localhostWildcard: UrlRule = {
      id: 'r6',
      type: 'port',
      pattern: 'localhost:*',
      enabled: true,
    };

    it('matches specific host and port', () => {
      expect(matchesRule('http://localhost:3000/app', localhost3000)).toBe(true);
      expect(matchesRule('http://localhost:5173', localhost3000)).toBe(false);
    });

    it('matches wildcard host with specific port', () => {
      expect(matchesRule('http://localhost:5173', anyPort5173)).toBe(true);
      expect(matchesRule('http://127.0.0.1:5173', anyPort5173)).toBe(true);
      expect(matchesRule('http://localhost:3000', anyPort5173)).toBe(false);
    });

    it('matches localhost with any port', () => {
      expect(matchesRule('http://localhost:8080/test', localhostWildcard)).toBe(true);
      expect(matchesRule('http://localhost:4000', localhostWildcard)).toBe(true);
    });
  });

  describe('path-pattern', () => {
    const adminPath: UrlRule = {
      id: 'r7',
      type: 'path-pattern',
      pattern: '/admin/*',
      enabled: true,
    };

    it('matches path prefix', () => {
      expect(matchesRule('https://mycompany.com/admin/users', adminPath)).toBe(true);
      expect(matchesRule('https://test.com/admin/settings', adminPath)).toBe(true);
      expect(matchesRule('https://test.com/customer/profile', adminPath)).toBe(false);
    });
  });

  describe('regex', () => {
    const regexRule: UrlRule = {
      id: 'r8',
      type: 'regex',
      pattern: '^https://(uat|qa)\\.mycorp\\.com',
      enabled: true,
    };

    it('matches regex pattern', () => {
      expect(matchesRule('https://uat.mycorp.com/billing', regexRule)).toBe(true);
      expect(matchesRule('https://qa.mycorp.com', regexRule)).toBe(true);
      expect(matchesRule('https://dev.mycorp.com', regexRule)).toBe(false);
    });
  });

  describe('matchesTag & getMatchingTags', () => {
    const tag1: LayerMarkTag = {
      id: 't1',
      name: 'LOCAL DEV',
      enabled: true,
      priority: 10,
      environment: 'local',
      style: {
        bgColor: '#2563EB',
        textColor: '#FFFFFF',
        size: 'medium',
        anchorPosition: 'top-left',
      },
      rules: [
        { id: 'r1', type: 'port', pattern: 'localhost:3000', enabled: true },
      ],
      createdAt: 1000,
      updatedAt: 1000,
    };

    const tag2: LayerMarkTag = {
      id: 't2',
      name: 'FEATURE BRANCH',
      enabled: true,
      priority: 1, // Higher priority
      environment: 'development',
      style: {
        bgColor: '#10B981',
        textColor: '#FFFFFF',
        size: 'small',
        anchorPosition: 'top-left',
      },
      rules: [
        { id: 'r2', type: 'path-pattern', pattern: '/feature/*', enabled: true },
      ],
      createdAt: 1000,
      updatedAt: 1000,
    };

    it('correctly matches and orders multiple tags simultaneously', () => {
      const url = 'http://localhost:3000/feature/checkout';
      expect(matchesTag(url, tag1)).toBe(true);
      expect(matchesTag(url, tag2)).toBe(true);

      const matched = getMatchingTags(url, [tag1, tag2]);
      expect(matched.length).toBe(2);
      expect(matched[0].id).toBe('t2'); // Priority 1 comes before priority 10
      expect(matched[1].id).toBe('t1');
    });

    it('ignores disabled tags', () => {
      const disabledTag = { ...tag1, enabled: false };
      expect(matchesTag('http://localhost:3000', disabledTag)).toBe(false);
    });
  });
});
