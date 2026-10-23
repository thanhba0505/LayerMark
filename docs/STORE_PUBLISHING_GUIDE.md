# LayerMark — Store Publishing Guide

This comprehensive guide details how to package, submit, and publish **LayerMark** to both the **Chrome Web Store** and the **Microsoft Edge Add-ons Store**.

---

## 1. Store Comparison Overview

| Feature / Criteria | Chrome Web Store | Microsoft Edge Add-ons |
| :--- | :--- | :--- |
| **Developer Account Cost** | **$5 USD** (One-time registration fee) | **$0 USD (100% Free)** |
| **Account Portal** | [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole) | [Microsoft Partner Center](https://partner.microsoft.com/dashboard/microsoftedge) |
| **Review Turnaround** | Typically 24 hours – 3 business days | Typically 24 – 48 hours |
| **Target Audience** | Google Chrome, Brave, Arc, Opera users | Microsoft Edge, Chromium enterprise users |
| **Sync Capability** | Standalone submission | Supports 1-click sync/import from Chrome Web Store |

---

## 2. Automated Packaging

Run the packaging script to generate a clean, store-compliant ZIP archive:

```bash
pnpm run package
```

This builds the production bundle and outputs `layermark.zip` in the project root directory.

### Verification Checklist before uploading:
- `dist/manifest.json` has `version: "1.0.0"`.
- Root of `layermark.zip` directly contains `manifest.json` (not nested inside a subfolder).
- All icons (`icon16.png`, `icon48.png`, `icon128.png`) are properly linked.

---

## 3. Store Listing Copywriting (Ready-to-Use)

### Extension Name:
> **LayerMark - Visual Tag & Environment Manager**

### Short Description (Max 132 chars):
> **Visually tag Production, Staging, UAT, and Localhost websites with isolated corner ribbons. 100% offline & local.**

### Detailed Description (Markdown / Plain Text):
```markdown
LayerMark is a modern, lightweight, local-first browser extension designed for developers, QA testers, and product managers to visually distinguish web environments (Production, Staging, UAT, Localhost) without clutter or layout breakage.

🔥 Key Features:
• Distinct Visual Indicators: Elegant diagonal ribbons, pill badges, and top/bottom banners.
• 4 Screen Corners: Freely position tags in Top-Left, Top-Right, Bottom-Left, or Bottom-Right.
• Slide & Fade on Hover: Hovering over any badge smoothly tucks it into the corner and fades it out, allowing instant clicks on underlying buttons or navigation.
• Absolute CSS Isolation: Built with Shadow DOM (attachShadow) — your tags will never leak styles into or break the host website's layout.
• Flexible URL Matching: Supports exact domains, wildcard subdomains (*.staging.*, *.uat.*), local ports (localhost:*, 127.0.0.1:*), path patterns, and regex.
• 100% Offline & Private: No backend, no login, zero tracking, zero external telemetry. All rules and tags remain strictly in your browser's chrome.storage.local.
• Real-time Live Preview: Interactive mini-browser canvas lets you visualize, test hover tucking, and customize colors and shapes instantly.
• Import / Export: Easily back up or share your team's environment tag presets via JSON.
• Bilingual Interface: Full support for both Vietnamese and English.

🛡️ Privacy & Permissions:
LayerMark operates 100% offline and stores your settings locally. We never collect personal data or browse history.
Source Code: https://github.com/thanhba0505/LayerMark
```

### Category:
- **Developer Tools** (Công cụ phát triển)

---

## 4. Visual Assets Specifications

1. **Extension Icon**:
   - `128x128 px` PNG (Located at `public/icons/icon128.png`).
2. **Screenshots (Store Showcase)**:
   - Size: `1280x800 px` or `640x400 px` (16:10 or 4:3 ratio).
   - Recommended 3 to 5 screenshots:
     - Screenshot 1: Production Ribbon on website with hover slide-and-fade demonstration.
     - Screenshot 2: Toolbar Popup displaying matched tags and quick toggle switch.
     - Screenshot 3: Fullscreen Options Dashboard with tag list and filter controls.
     - Screenshot 4: Tag Editor Modal with live interactive browser preview.
3. **Small Promotional Tile**:
   - Size: `440x280 px` PNG/JPEG.
4. **Marquee Promotional Banner (Optional)**:
   - Size: `1400x560 px` PNG/JPEG.

---

## 5. Step-by-Step Submission: Chrome Web Store

1. **Access Developer Console**:
   - Navigate to [https://chrome.google.com/webstore/devconsole](https://chrome.google.com/webstore/devconsole).
   - Sign in with your Google account.
   - Pay the one-time $5 registration fee if this is your first time.
2. **Upload Package**:
   - Click **+ New Item**.
   - Drag and drop `layermark.zip`.
3. **Fill Store Listing Details**:
   - Enter **Name**, **Summary**, and **Detailed Description** (copied from Section 3).
   - Select Category: **Developer Tools**.
   - Upload Store Icon (`128x128`) and at least 1 Screenshot (`1280x800`).
4. **Privacy Tab (Crucial for Quick Approval)**:
   - **Single Purpose**: *"Provide visual environment indicators and tags on matching websites."*
   - **Permission Justification**:
     - `storage`: *"Stores user tags, visual styles, and matching rules locally on the device."*
     - `tabs` / `activeTab`: *"Detects current tab hostname to display active tags in the popup and evaluate overlay rules."*
     - Host Permission (`<all_urls>`): *"Required to inject isolated visual overlay badges into user-defined target domains."*
   - **Data Usage**:
     - Check: *"I do not collect or transmit user data."*
   - **Privacy Policy URL**:
     - `https://github.com/thanhba0505/LayerMark/blob/main/docs/PRIVACY_POLICY.md`
5. **Submit for Review**:
   - Click **Submit for Review**.
   - Review typically takes 24 – 72 hours.

---

## 6. Step-by-Step Submission: Microsoft Edge Add-ons

1. **Access Microsoft Partner Center**:
   - Navigate to [https://partner.microsoft.com/dashboard/microsoftedge](https://partner.microsoft.com/dashboard/microsoftedge).
   - Sign in with a Microsoft account (Hotmail, Outlook, GitHub, or Microsoft 365).
   - Registration is **100% Free** ($0 fee).
2. **Create New Extension**:
   - Click **Create new extension**.
   - Choose either:
     - **Option A (Manual)**: Upload `layermark.zip`.
     - **Option B (Import)**: If already approved on Chrome Web Store, you can paste your Chrome Web Store extension URL to automatically import metadata.
3. **Extension Details & Assets**:
   - Fill in Title, Description, and Developer Tools category.
   - Upload Logo (`128x128`) and Screenshots (`1280x800`).
4. **Properties & Privacy**:
   - Provide Privacy Policy URL:  
     `https://github.com/thanhba0505/LayerMark/blob/main/docs/PRIVACY_POLICY.md`
   - Support URL:  
     `https://github.com/thanhba0505/LayerMark/issues`
5. **Publish**:
   - Click **Publish**.
   - Edge reviews are usually completed within 1 to 2 business days.
