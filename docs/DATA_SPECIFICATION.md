# LayerMark — Data Specifications & JSON Schema

This document specifies the TypeScript interfaces, JSON schema models, URL matching rule types, and Import/Export formats for the **LayerMark** extension.

---

## 1. Core Data Models (TypeScript Definitions)

### 1.1. Tag Entity (`LayerMarkTag`)

```typescript
export interface LayerMarkTag {
  id: string;               // Unique UUID (e.g., "tag_9f82d1...")
  name: string;             // Display name (e.g., "PRODUCTION", "STAGING", "DEV")
  description?: string;     // Optional descriptive note
  enabled: boolean;         // Active status toggle (true/false)
  priority: number;         // Priority order (0, 1, 2... Lower number renders first)
  project?: string;         // Project grouping (e.g., "Core Banking", "CRM")
  environment: EnvironmentType; // "production" | "staging" | "development" | "local" | "testing" | "custom"
  style: TagStyle;          // Visual appearance and positioning configuration
  rules: UrlRule[];         // List of URL matching rules triggering this tag
  createdAt: number;        // Epoch timestamp (ms)
  updatedAt: number;        // Epoch timestamp (ms)
}
```

### 1.2. Visual Styling Configuration (`TagStyle`)

```typescript
export interface TagStyle {
  bgColor: string;          // Background color Hex or RGBA (default: "#EF4444")
  textColor: string;        // Text color Hex or RGBA (default: "#FFFFFF")
  borderColor?: string;     // Border color (optional)
  borderWidth?: number;     // Border thickness in px (default: 0)
  borderRadius?: number;    // Corner radius in px (default: 6)
  opacity?: number;         // Opacity (0.1 to 1.0, default: 0.95)
  fontSize?: number;        // Font size in px (default: 12)
  size: TagSize;            // "small" | "medium" | "large" | "custom"
  icon?: string;            // Lucide icon identifier or emoji (e.g., "ShieldAlert", "Server", "🔥")
  anchorPosition: AnchorPosition; // Viewport docking position
  offsetX?: number;         // Horizontal margin offset in px
  offsetY?: number;         // Vertical margin offset in px
  pulseAnimation?: boolean; // Subtle pulsing badge dot for critical environments (Prod)
}
```

### 1.3. URL Matching Rule (`UrlRule`)

```typescript
export interface UrlRule {
  id: string;               // Unique rule identifier
  type: RuleMatchType;      // "exact-domain" | "wildcard-domain" | "port" | "path-pattern" | "regex"
  pattern: string;          // Target matching pattern string
  description?: string;     // Optional rule note
  enabled: boolean;         // Individual rule active toggle
}
```

---

## 2. Import / Export JSON Format

When users back up configurations or share environment tags with team members, LayerMark exports a standardized JSON file:

```json
{
  "app": "LayerMark",
  "version": "1.0.0",
  "exportedAt": "2026-10-23T12:00:00.000Z",
  "tags": [
    {
      "id": "tag_prod_preset",
      "name": "PRODUCTION",
      "description": "Live production environment — handle actions with caution",
      "enabled": true,
      "priority": 0,
      "project": "General",
      "environment": "production",
      "style": {
        "bgColor": "#DC2626",
        "textColor": "#FFFFFF",
        "borderRadius": 6,
        "opacity": 0.95,
        "size": "medium",
        "icon": "ShieldAlert",
        "anchorPosition": "top-right",
        "pulseAnimation": true
      },
      "rules": [
        {
          "id": "rule_1",
          "type": "exact-domain",
          "pattern": "mycompany.com",
          "enabled": true
        },
        {
          "id": "rule_2",
          "type": "wildcard-domain",
          "pattern": "*.prod.mycompany.com",
          "enabled": true
        }
      ],
      "createdAt": 1729684800000,
      "updatedAt": 1729684800000
    },
    {
      "id": "tag_staging_preset",
      "name": "STAGING",
      "description": "Pre-release testing environment",
      "enabled": true,
      "priority": 1,
      "project": "General",
      "environment": "staging",
      "style": {
        "bgColor": "#D97706",
        "textColor": "#FFFFFF",
        "borderRadius": 6,
        "opacity": 0.95,
        "size": "medium",
        "icon": "Server",
        "anchorPosition": "top-right",
        "pulseAnimation": false
      },
      "rules": [
        {
          "id": "rule_3",
          "type": "wildcard-domain",
          "pattern": "*.staging.mycompany.com",
          "enabled": true
        }
      ],
      "createdAt": 1729684800000,
      "updatedAt": 1729684800000
    },
    {
      "id": "tag_local_preset",
      "name": "LOCAL DEV",
      "description": "Local workstation development servers",
      "enabled": true,
      "priority": 2,
      "project": "General",
      "environment": "local",
      "style": {
        "bgColor": "#2563EB",
        "textColor": "#FFFFFF",
        "borderRadius": 6,
        "opacity": 0.95,
        "size": "medium",
        "icon": "Laptop",
        "anchorPosition": "top-left",
        "pulseAnimation": false
      },
      "rules": [
        {
          "id": "rule_4",
          "type": "port",
          "pattern": "localhost:3000",
          "enabled": true
        },
        {
          "id": "rule_5",
          "type": "port",
          "pattern": "localhost:5173",
          "enabled": true
        },
        {
          "id": "rule_6",
          "type": "port",
          "pattern": "127.0.0.1:*",
          "enabled": true
        }
      ],
      "createdAt": 1729684800000,
      "updatedAt": 1729684800000
    }
  ],
  "settings": {
    "defaultAnchor": "top-right",
    "enableGlobalToggle": true,
    "collapseOnHover": true,
    "showBadgeCounter": true,
    "theme": "system"
  }
}
```

---

## 3. Schema Validation & Sanitization Rules

When importing external JSON files:
1. **Header Verification**: Check `app === "LayerMark"`.
2. **Tag Array Integrity**: Verify `Array.isArray(tags)`.
3. **Color & Input Sanitization**:
   - `bgColor` and `textColor` must validate against standard Hex/RGBA formats; reject any values containing `javascript:` or malicious patterns.
   - Strip unsafe HTML tags from `name`, `description`, and `pattern` fields to prevent XSS.
4. **Collision Handling**: In "Merge" mode, generate fresh UUIDs for any tag or rule IDs that already exist in local storage.
