# LayerMark

**LayerMark** is a lightweight, visual environment and website tag manager browser extension (Chrome Manifest V3) operating 100% offline. It helps developers, QA testers, and DevOps engineers distinctly differentiate between Production, Staging, Development, and Localhost environments with absolute CSS isolation.

---

## ✨ Key Features

- 🎨 **Rich Visual Customization**: Customize tag name, background color, text color, icons (Lucide Icons / Emoji), size, opacity, and anchor positions (Corners, fixed top/bottom banners, diagonal ribbons).
- 🎯 **Flexible URL Matching Rules**: Exact hostnames, wildcard subdomains (`*.domain.com`), port numbers (`localhost:3000`), and path patterns (`domain.com/admin/*`).
- 🧩 **Multi-Tag Stacking**: Automatically stacks multiple active tags on the same webpage without overlapping or breaking layouts.
- 🛡️ **Absolute CSS Isolation via Shadow DOM**: Host website stylesheets never alter tag appearance, and tag styling never leaks into the user's web page.
- ⚡ **Real-Time Live Preview**: Instant visual feedback inside the tag editor modal while modifying colors, fonts, or badges.
- 🗂️ **Centralized Management Dashboard**: Fullscreen options page with real-time search, environment filters, project grouping, and drag-and-drop priority sorting.
- 🚀 **Quick Action Popup**: View active tags on the current browser tab, toggle tags on/off with 1 click, or quickly create a tag for the current domain.
- 💾 **Local-First & JSON Import/Export**: 100% offline storage (`chrome.storage.local`), zero backend dependencies, zero telemetry, and seamless JSON configuration backup and sharing.

---

## 🛠️ Development & Building

### Prerequisites
- **Node.js**: `>= 18.0.0`
- **pnpm**: Recommended package manager

### Install Dependencies
```bash
pnpm install
```

### Build the Extension
```bash
pnpm run build
```

Compiled extension assets will be generated in the [`dist/`](./dist) directory.

---

## 🔌 Installing into Browser (Developer Mode)

1. Open Google Chrome, Microsoft Edge, or Brave.
2. Navigate to: `chrome://extensions/`
3. Enable **Developer mode** toggle in the top-right corner.
4. Click **Load unpacked**.
5. Select the `dist/` directory inside this project folder.
6. Pin the **LayerMark** icon to your browser toolbar.

---

## 📚 Technical Documentation

- [AI Agent & Developer Guidelines (`AGENTS.md`)](./AGENTS.md)
- [System Architecture (`docs/ARCHITECTURE.md`)](./docs/ARCHITECTURE.md)
- [Data Specifications & JSON Schema (`docs/DATA_SPECIFICATION.md`)](./docs/DATA_SPECIFICATION.md)
- [5-Phase Roadmap (`docs/ROADMAP.md`)](./docs/ROADMAP.md)
- [Workspace Skill Runbook (`.agents/skills/layermark-dev/SKILL.md`)](./.agents/skills/layermark-dev/SKILL.md)

---

## 📄 License
Released under the [MIT License](LICENSE).
