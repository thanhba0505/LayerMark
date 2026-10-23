/**
 * LayerMark Core Type Definitions
 */

export type AnchorPosition = 
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'bottom-center'
  | 'top-banner'
  | 'bottom-banner'
  | 'ribbon-top-right'
  | 'ribbon-top-left';

export type TagSize = 'small' | 'medium' | 'large' | 'custom';

export type RuleMatchType = 
  | 'exact-domain'    // e.g. "github.com"
  | 'wildcard-domain' // e.g. "*.staging.example.com"
  | 'port'            // e.g. "localhost:3000", "127.0.0.1:8080"
  | 'path-pattern'    // e.g. "company.com/admin/*"
  | 'regex';          // e.g. "^https:\/\/(dev|stage)\.app\.com"

export interface UrlRule {
  id: string;
  type: RuleMatchType;
  pattern: string;
  description?: string;
  enabled: boolean;
}

export type EnvironmentType = 
  | 'production'
  | 'staging'
  | 'development'
  | 'local'
  | 'testing'
  | 'custom';

export interface TagStyle {
  bgColor: string;          // Hex or RGBA (e.g. #EF4444)
  textColor: string;        // Hex or RGBA (e.g. #FFFFFF)
  borderColor?: string;     // Border color
  borderWidth?: number;     // In pixels
  borderRadius?: number;    // In pixels
  opacity?: number;         // 0.1 to 1.0
  fontSize?: number;        // In pixels
  size: TagSize;
  icon?: string;            // Lucide icon name or emoji (e.g. 'ShieldAlert', 'Server', '🚀')
  anchorPosition: AnchorPosition;
  offsetX?: number;         // Margin/offset X in px
  offsetY?: number;         // Margin/offset Y in px
  showIconOnlyOnMobile?: boolean;
  pulseAnimation?: boolean; // Subtle pulsing dot/badge for critical environments (Prod)
}

export interface LayerMarkTag {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  priority: number;         // Lower number = higher priority / rendered first
  project?: string;         // Project name (e.g. "E-Commerce", "Admin Portal")
  environment: EnvironmentType;
  style: TagStyle;
  rules: UrlRule[];
  createdAt: number;        // Epoch timestamp
  updatedAt: number;        // Epoch timestamp
}

export type AppLanguage = 'en' | 'vi';

export interface LayerMarkSettings {
  defaultAnchor: AnchorPosition;
  enableGlobalToggle: boolean;
  collapseOnHover: boolean;
  showBadgeCounter: boolean;
  theme: 'light' | 'dark' | 'system';
  language: AppLanguage;
}

export interface LayerMarkStorageSchema {
  version: string;
  tags: LayerMarkTag[];
  settings: LayerMarkSettings;
}

export interface LayerMarkExportData {
  app: 'LayerMark';
  version: string;
  exportedAt: string;
  tags: LayerMarkTag[];
  settings?: LayerMarkSettings;
}
