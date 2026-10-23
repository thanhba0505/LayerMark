# LayerMark — System Architecture Design

This document details the technical architecture of the **LayerMark** browser extension built on the **Google Chrome Manifest V3** standard.

---

## 1. High-Level Architecture

```mermaid
flowchart TD
    subgraph Browser Context
        subgraph Active Web Tab
            DOM[Host Webpage DOM]
            Host[LayerMark Host Container]
            ShadowRoot[Shadow Root - mode: open]
            AnchorZones[Anchor Stacking Zones]
            Badge1[Tag Badge: Production]
            Badge2[Tag Badge: API v2]

            DOM --> Host
            Host --> ShadowRoot
            ShadowRoot --> AnchorZones
            AnchorZones --> Badge1
            AnchorZones --> Badge2
        end

        subgraph Extension Process
            SW[Service Worker - Background]
            Popup[Popup UI - Active Tab]
            Options[Options Page - Management Dashboard]
            Storage[(chrome.storage.local)]
        end
    end

    Options <-->|CRUD / Export / Import| Storage
    Popup <-->|Quick Toggle / Active Query| Storage
    SW <-->|Badge Counter / Tab Update| Storage
    Storage -.->|onChanged Event| ShadowRoot
    SW -.->|chrome.tabs.sendMessage| ShadowRoot
```

---

## 2. Core Architectural Components

### 2.1. Shadow DOM Isolation Layer (`src/content/`)
- **Objective**: Ensure complete stylistic and structural isolation between extension overlays and host websites.
- **Mechanism**:
  - Injects a fixed container `#layermark-root-container` directly attached to `document.documentElement`.
  - Sets `pointer-events: none` on the root host container so standard user clicks and gestures pass through unimpeded to the underlying webpage.
  - Instantiates an open Shadow Root via `element.attachShadow({ mode: 'open' })`.
  - Injects scoped stylesheets, SVG icons, and Tag Badge DOM nodes strictly inside the Shadow Root.
  - Individual badges and interactive buttons are set to `pointer-events: auto` to receive user hover and click events.

### 2.2. Anchor Points & Stacking System
To support **multiple badges co-existing simultaneously on a single website** without collision, the viewport is partitioned into Docking Zones:

| Anchor Position | CSS Coordinates | Stacking Direction (Flex) | Primary Use Cases |
| :--- | :--- | :--- | :--- |
| `top-left` | `top: 12px; left: 12px` | `flex-col` or `flex-row` (gap: 8px) | General environment info |
| `top-right` | `top: 12px; right: 12px` | `flex-col` | Critical alert badges (Production) |
| `bottom-left` | `bottom: 12px; left: 12px` | `flex-col-reverse` | Debug info, Tenant ID |
| `bottom-right` | `bottom: 12px; right: 12px` | `flex-col-reverse` | Git branch, commit sha, version |
| `top-banner` | `top: 0; left: 0; width: 100%` | Fixed top horizontal ribbon | Site-wide alerts (PROD CRITICAL) |
| `bottom-banner` | `bottom: 0; left: 0; width: 100%` | Fixed bottom horizontal ribbon | Maintenance or read-only banner |
| `ribbon-top-right`| Top-right diagonal | 45-degree corner ribbon | GitHub/Staging ribbon badge |

- When 2 or more tags share the same `anchorPosition`, they automatically stack according to ascending `priority` with a configurable gap (`6px` to `8px`).

### 2.3. URL Matching Engine (`src/shared/matcher.ts`)
The matching engine evaluates URLs against 5 pattern modes:
1. **Exact Host**: Exact hostname equality check (`window.location.hostname === rule.pattern`).
2. **Wildcard Subdomain**: Transforms `*.domain.com` into regex `^.*\.domain\.com$`.
3. **Port Matching**: Matches specific ports for local development (e.g., `localhost:3000`, `127.0.0.1:8080`, `*:5173`).
4. **Path Pattern**: Glob-based path matching (e.g., `domain.com/admin/*` or `/checkout/*`).
5. **Regex**: Full regular expressions for advanced power users.

### 2.4. Reactive Storage & Multi-Tab Synchronization (`src/shared/storage.ts`)
- All persistence is centralized in `chrome.storage.local`.
- Listens to `chrome.storage.onChanged`: When tags are modified, toggled, or reordered in the Options Page or Toolbar Popup, Content Scripts across all open browser tabs receive notifications and re-render instantly without requiring a page refresh.

### 2.5. Single Page Application (SPA) Support
- Tracks route transitions seamlessly via two mechanisms:
  1. Content script hooks into `window.history.pushState`, `window.history.replaceState`, and `popstate` events.
  2. Background Service Worker monitors `chrome.tabs.onUpdated` and broadcasts tab updates to content scripts.
