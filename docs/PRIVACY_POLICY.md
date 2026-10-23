# Privacy Policy for LayerMark

**Effective Date:** October 23, 2026  
**Last Updated:** October 23, 2026

**LayerMark** ("we", "our", or "the extension") is a lightweight Chrome and Chromium browser extension designed to visually identify and tag website environments (Production, Staging, UAT, Localhost) for developers, testers, and product managers.

We are deeply committed to protecting user privacy. This Privacy Policy explains our practices regarding user data.

---

## 1. 100% Offline & Local-First

- **Zero Backend**: LayerMark does not possess, operate, or connect to any remote server or backend service.
- **Local Storage Only**: All user configurations, custom tags, URL matching rules, and application settings are stored solely on your local device via `chrome.storage.local`.
- **Zero Telemetry & Tracking**: LayerMark does not track your browsing history, does not collect analytics or telemetry, and does not use any third-party tracking scripts.
- **No Accounts Required**: No account registration, email, or login credentials are ever requested or stored.

---

## 2. Information We Do NOT Collect

We do **not** collect, store, transmit, or sell:
- Personally Identifiable Information (PII) such as names, email addresses, phone numbers, or IP addresses.
- Browsing history, visited URLs, web contents, keystrokes, form submissions, or cookies.
- Device identifiers or financial information.

---

## 3. Chrome Extension Permissions Justification

LayerMark declares the following permissions strictly necessary for its visual tagging features:

| Permission | Purpose |
| :--- | :--- |
| `storage` | Saves your environment tags, visual preferences (colors, shapes, positions), and settings offline on your computer. |
| `tabs` / `activeTab` | Detects the active tab's hostname (e.g., `localhost:3000`, `staging.example.com`) to display matching tags in the toolbar popup and evaluate which visual badge to render. No URL data is ever transmitted outside your browser. |
| Host Permissions (`<all_urls>`) | Required to inject the isolated Shadow DOM visual overlay badge onto websites that match your configured rules. |

---

## 4. Data Sharing and Third Parties

Because we do not collect any user data, we **never** sell, transfer, or disclose any user information to third parties, advertisers, or data brokers.

---

## 5. User Control & Data Retention

- You maintain 100% ownership and control over your configuration.
- You can export your tags to a local JSON file or import them at any time.
- Uninstalling the LayerMark extension from your browser immediately and permanently deletes all stored data and settings from your device.

---

## 6. Open Source & Transparency

LayerMark is open source. The entire source code is publicly inspectable and auditable on GitHub:  
[https://github.com/thanhba0505/LayerMark](https://github.com/thanhba0505/LayerMark)

---

## 7. Contact Us

If you have any questions or feedback regarding this Privacy Policy, please open an issue on our GitHub repository:  
[https://github.com/thanhba0505/LayerMark/issues](https://github.com/thanhba0505/LayerMark/issues)
