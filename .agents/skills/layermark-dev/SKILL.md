---
name: layermark-dev
description: >-
  Workflows, procedures, testing, and debugging guidelines for the LayerMark Chrome Extension.
  Use when building, running, packaging, debugging, or verifying features in the LayerMark extension codebase.
---

# LayerMark Extension Development & Debugging Runbook

Operational runbook and developer workflows for developing, building, testing, and troubleshooting the **LayerMark** Chrome/Chromium extension.

---

## 1. Environment & Commands

- Package manager: **pnpm** (always prefer pnpm over npm/yarn).
- Recommended Node.js version: `>= 18.0.0` (runs cleanly on Node v24).

```bash
# 1. Type-check TypeScript codebase
pnpm run type-check

# 2. Build the extension bundle to dist/
pnpm run build

# 3. Preview UI components in dev server
pnpm run dev
```

---

## 2. Browser Verification Procedure (Load Unpacked)

1. Compile the extension:
   ```bash
   pnpm run build
   ```
2. Open Google Chrome, Microsoft Edge, or Brave:
   - Go to `chrome://extensions/`
   - Enable **Developer mode** (top-right toggle switch)
   - Click **Load unpacked** -> Select `/Users/lethanhba/workspace/app/LayerMark/dist`
3. After making code changes:
   - Run `pnpm run build`.
   - On `chrome://extensions/`, click the reload icon on the LayerMark extension card.
   - Refresh active browser tabs to load the updated content script.

---

## 3. Critical Technical Patterns

### 3.1. Shadow DOM CSS Isolation
- Content script injects into target web pages via `attachShadow({ mode: 'open' })`.
- All tag CSS styles must be injected directly into the Shadow Root (or inline inside internal `<style>` tags).
- The outer host wrapper must strictly enforce:
  ```css
  pointer-events: none;
  position: fixed;
  z-index: 2147483647;
  ```
- Individual interactive badge elements must explicitly specify `pointer-events: auto` to receive hover, click, and drag events.

### 3.2. URL Matching Engine
- Always verify matcher behavior against the 5 supported rule types:
  1. **Exact Host**: `example.com`
  2. **Wildcard Subdomain**: `*.staging.mycompany.com` (matches both `api.staging...` and `web.staging...`)
  3. **Port Matching**: `localhost:3000`, `127.0.0.1:8080`, `*:5173`
  4. **Path Pattern**: `github.com/*/pulls/*`, `my-app.com/admin/*`
  5. **Regex**: `^https://(qa|dev)\.domain\.com`

### 3.3. Reactive chrome.storage.local Sync
- Never rely solely on in-memory variables in content scripts, as page navigation or reloads will discard them.
- Use `chrome.storage.onChanged`:
  ```ts
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.tags) {
      // Automatically re-render active tags on the page immediately
    }
  });
  ```

---

## 4. Troubleshooting Guide

- **Missing icon error when loading unpacked**: Ensure `dist/manifest.json` correctly points to files in `dist/icons/`. Run `node scripts/generate-icons.js` if icons are absent.
- **Content script not executing on website**:
  - Check if the page is restricted by Chrome policies (e.g. `chrome://`, Chrome Web Store URLs disallow content scripts).
  - Open DevTools (F12 -> Console) and check for the `[LayerMark]` log prefix.
- **Host website layout broken**: Confirm no DOM elements or CSS stylesheets leaked outside the Shadow Root.
