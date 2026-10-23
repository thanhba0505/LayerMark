# LayerMark — AI Agent & Developer Guidelines

Welcome to the **LayerMark** codebase — a modern Chrome/Chromium extension (Manifest V3) for visual website environment tagging and indicators (Production, Staging, Dev, Local) featuring strict CSS isolation and 100% offline local storage.

This document (`AGENTS.md`) is the mandatory guideline and operational manual for AI agents (such as Antigravity) and human developers when maintaining, extending, or refactoring this codebase.

---

## 1. Core Principles

1. **Local-First & Zero Backend**:
   - All data (tags, rules, settings) is stored exclusively in `chrome.storage.local`.
   - Never send telemetry, never make external API calls, and never require user accounts or login.
2. **Absolute CSS Isolation via Shadow DOM**:
   - Content scripts **must** render overlay UI inside a **Shadow Root** (`attachShadow({ mode: 'open' })`).
   - Host website styles must never break Tag Badge layout, and Tag styles must never leak into or alter the host page layout.
3. **Non-Intrusive UX**:
   - The full-screen overlay host container must strictly have `pointer-events: none`.
   - Only interactive badge elements and buttons have `pointer-events: auto`.
   - Support hover-to-minimize / hover-to-dim so badges never obstruct critical web content.
4. **Zero-Latency & SPA Support**:
   - The URL matching engine must be ultra-fast: O(N) where N is the number of active rules.
   - Fully support Single Page Applications (SPAs) by listening to history navigation (`popstate`, `pushState`, `replaceState`, and `chrome.tabs.onUpdated`).

---

## 2. Directory Structure

```
LayerMark/
├── .agents/
│   └── skills/
│       └── layermark-dev/
│           └── SKILL.md            # Skill runbook for extension dev, build, and debug
├── docs/
│   ├── ARCHITECTURE.md             # In-depth architectural design & Shadow DOM specs
│   ├── DATA_SPECIFICATION.md       # JSON schema, TypeScript interfaces, and presets
│   └── ROADMAP.md                  # 5-phase development roadmap
├── public/
│   └── icons/                      # Extension icons (16, 48, 128)
├── src/
│   ├── background/
│   │   └── index.ts                # Service worker: Tab updates, badge counters, hot-sync
│   ├── content/
│   │   ├── index.ts                # Content script entry: Shadow DOM injection
│   │   ├── shadow-host.ts          # Shadow Root lifecycle manager
│   │   └── tag-renderer.ts         # Tag badge layout, anchor stacking, and render logic
│   ├── options/                    # Fullscreen dashboard page (React + Tailwind)
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.html
│   │   └── components/             # Modal editor, live preview, tag list, import/export
│   ├── popup/                      # Extension toolbar popup
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.html
│   │   └── components/             # Quick toggle, matched tag list, quick add
│   ├── shared/
│   │   ├── types.ts                # TypeScript types & interfaces
│   │   ├── storage.ts              # Type-safe wrapper for chrome.storage.local
│   │   ├── matcher.ts              # URL matching engine (Exact, Wildcard, Port, Path, Regex)
│   │   └── presets.ts              # Built-in presets (Prod, Staging, Dev, Localhost)
│   ├── styles/
│   │   └── globals.css             # Tailwind base & utilities
│   └── manifest.json               # Chrome Extension Manifest V3 configuration
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts                  # Vite multi-entry build pipeline
```

---

## 3. Coding Standards

- **Language**: TypeScript in strict mode (`strict: true`). Avoid `any`; define explicit models in `src/shared/types.ts`.
- **UI & Icons**: React 18, Tailwind CSS, and `lucide-react`. Support both Dark Mode and Light Mode seamlessly.
- **Chrome Extension API**:
  - Always guard `chrome?.storage?.local` access to prevent crashes in non-extension browser preview environments.
  - Rely on `chrome.storage.onChanged` to reactively update the UI across all open tabs simultaneously without manual page reload.
- **Import / Export Handling**:
  - Exported JSON must include version metadata (`app: 'LayerMark'`, `version: '1.0.0'`).
  - Imported JSON must undergo schema validation, sanitization (prevent XSS / injection), and offer an overwrite vs. merge option.

---

## 4. Developer Commands

```bash
# Install dependencies (use pnpm)
pnpm install

# Type check TypeScript codebase
pnpm run type-check

# Build extension to dist/ folder
pnpm run build

# Start preview dev server
pnpm run dev
```

---

## 5. Loading Unpacked Extension into Browser for Testing

1. Run: `pnpm run build`
2. Open Google Chrome, Microsoft Edge, or Brave, and navigate to: `chrome://extensions/`
3. Toggle on **Developer mode** in the top right corner.
4. Click **Load unpacked**.
5. Select the `dist/` directory inside the `LayerMark` project workspace.
6. Pin the extension to the toolbar and test the popup, options dashboard, and injected badges across target websites.
