# LayerMark — AI Agent & Developer Guidelines

Chào mừng bạn đến với codebase của **LayerMark** — Tiện ích mở rộng Chrome/Chromium (Manifest V3) giúp đánh dấu, gắn tag môi trường trực quan và phân biệt website (Production, Staging, Dev, Local) với độ cô lập CSS tuyệt đối và lưu trữ 100% offline.

Tài liệu này (`AGENTS.md`) là bộ quy chuẩn và chỉ dẫn bắt buộc dành cho AI Agent (như Antigravity) và lập trình viên khi phát triển, mở rộng hoặc bảo trì codebase này.

---

## 1. Triết lý thiết kế cốt lõi (Core Principles)

1. **Local-First & Zero Backend**:
   - Mọi dữ liệu (tag, rules, settings) lưu trữ độc quyền trong `chrome.storage.local`.
   - Tuyệt đối không gửi telemetry, không gọi API ngoại vi, không yêu cầu đăng nhập/tài khoản.
2. **CSS Isolation tuyệt đối qua Shadow DOM**:
   - Content Script **bắt buộc** phải render overlay UI bên trong **Shadow Root** (`attachShadow({ mode: 'open' })`).
   - Tuyệt đối không để CSS của website gốc làm vỡ layout của Tag, và ngược lại không để CSS của Tag rò rỉ làm ảnh hưởng website của người dùng.
3. **Non-Intrusive UX (Không cản trở trải nghiệm web)**:
   - Overlay container bao quanh toàn màn hình phải luôn có `pointer-events: none`.
   - Chỉ các tag badge/nút tương tác cụ thể mới có `pointer-events: auto`.
   - Hỗ trợ tính năng thu nhỏ / làm mờ khi rê chuột (hover to minimize) để không che khuất nội dung quan trọng của trang web.
4. **Hiệu năng & Khởi động tức thì (Zero Latency)**:
   - Thuật toán so khớp URL (Matching Engine) phải đạt tốc độ tối đa, O(N) với N là số lượng rule đang kích hoạt.
   - Hỗ trợ tốt Single Page Applications (SPA) bằng cách lắng nghe URL change (`popstate`, `pushState`/`replaceState` & `chrome.tabs.onUpdated`).

---

## 2. Kiến trúc thư mục (Directory Structure)

```
LayerMark/
├── .agents/
│   └── skills/
│       └── layermark-dev/
│           └── SKILL.md            # Skill hướng dẫn quy trình dev, build, debug extension
├── docs/
│   ├── ARCHITECTURE.md             # Chi tiết kiến trúc Shadow DOM, storage, URL matching
│   ├── DATA_SPECIFICATION.md       # Đặc tả schema JSON, types, rule types, preset data
│   └── ROADMAP.md                  # Lộ trình triển khai 5 giai đoạn
├── public/
│   └── icons/                      # Icon tiện ích (16, 48, 128)
├── src/
│   ├── background/
│   │   └── index.ts                # Service worker: Tab updates, badge counters, hot-sync
│   ├── content/
│   │   ├── index.ts                # Content script entry: chèn host container & Shadow DOM
│   │   ├── shadow-host.ts          # Quản lý vòng đời Shadow Root
│   │   └── tag-renderer.ts         # Xếp hàng tag theo Anchor Point và rendering
│   ├── options/                    # Trang Dashboard toàn màn hình (React + Tailwind)
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.html
│   │   └── components/             # Modal tạo/sửa tag, Live Preview, Tag List, Import/Export
│   ├── popup/                      # Popup nhỏ khi click icon extension
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.html
│   │   └── components/             # Quick toggle, tag match list, quick add
│   ├── shared/
│   │   ├── types.ts                # TypeScript types & interfaces
│   │   ├── storage.ts              # Type-safe wrapper cho chrome.storage.local
│   │   ├── matcher.ts              # URL Matcher Engine (Exact, Wildcard, Port, Path, Regex)
│   │   └── presets.ts              # Mẫu tag có sẵn (Prod, Staging, Dev, Localhost)
│   ├── styles/
│   │   └── globals.css             # Tailwind base & utilities
│   └── manifest.json               # Chrome Extension Manifest V3
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts                  # Vite multi-entry build pipeline
```

---

## 3. Quy chuẩn viết Code (Coding Standards)

- **Ngôn ngữ**: TypeScript ở chế độ nghiêm ngặt (`strict: true`). Không được dùng `any`; hãy định nghĩa interface tường minh trong `src/shared/types.ts`.
- **UI & Icons**: Sử dụng React 18, Tailwind CSS và `lucide-react`. Đảm bảo hỗ trợ cả Dark Mode và Light Mode.
- **Chrome Extension API**:
  - Luôn kiểm tra sự tồn tại của `chrome?.storage?.local` trước khi gọi để tránh crash khi chạy dev trong trình duyệt thông thường.
  - Sử dụng sự kiện `chrome.storage.onChanged` để cập nhật trạng thái UI tự động trên tất cả các tab đang mở.
- **Xử lý Import/Export**:
  - Dữ liệu export ra JSON phải kèm version metadata (`app: 'LayerMark'`, `version: '1.0.0'`).
  - Dữ liệu import vào phải đi qua bước validate schema, sanitize dữ liệu và cho phép chọn ghi đè (overwrite) hoặc gộp thêm (merge).

---

## 4. Lệnh thao tác trong dự án (Developer Commands)

```bash
# Cài đặt thư viện (Sử dụng pnpm)
pnpm install

# Kiểm tra kiểu dữ liệu TypeScript
pnpm run type-check

# Build extension ra thư mục dist/
pnpm run build

# Chạy dev server xem trước UI
pnpm run dev
```

---

## 5. Quy trình nạp Extension vào trình duyệt để kiểm thử

1. Chạy lệnh: `pnpm run build`
2. Mở Google Chrome hoặc Microsoft Edge, truy cập: `chrome://extensions/`
3. Bật công tắc **Developer mode** (Chế độ dành cho nhà phát triển) ở góc phải phía trên.
4. Bấm nút **Load unpacked** (Tải tiện ích đã giải nén).
5. Chọn thư mục `dist/` bên trong thư mục dự án `LayerMark`.
6. Ghim extension lên thanh công cụ và kiểm thử popup, options page và content script trên các trang web mục tiêu.
