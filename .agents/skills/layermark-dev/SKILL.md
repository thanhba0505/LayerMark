---
name: layermark-dev
description: >-
  Workflows, procedures, testing, and debugging guidelines for the LayerMark Chrome Extension.
  Use when building, running, packaging, debugging, or verifying features in the LayerMark extension codebase.
---

# LayerMark Extension Development & Debugging Runbook

Runbook hướng dẫn phát triển, kiểm thử và xử lý sự cố cho tiện ích mở rộng Chrome/Chromium **LayerMark**.

---

## 1. Môi trường & Lệnh thực thi

- Luôn sử dụng trình quản lý gói `pnpm`.
- Node.js phiên bản khuyến nghị: `>= 18.0.0` (Dự án hiện chạy mượt trên Node v24).

```bash
# 1. Kiểm tra type và cú pháp
pnpm run type-check

# 2. Build toàn bộ extension ra thư mục dist/
pnpm run build
```

---

## 2. Quy trình kiểm thử Extension trên trình duyệt

1. Thực hiện build bằng lệnh:
   ```bash
   pnpm run build
   ```
2. Mở trình duyệt Chrome hoặc Edge:
   - Truy cập địa chỉ: `chrome://extensions/`
   - Bật **Developer mode** (Góc trên bên phải)
   - Chọn **Load unpacked** -> Chỉ định thư mục `/Users/lethanhba/workspace/app/LayerMark/dist`
3. Mỗi lần thay đổi code:
   - Chạy lại `pnpm run build`.
   - Vào `chrome://extensions/`, bấm nút reload (biểu tượng xoay vòng) trên thẻ LayerMark.
   - F5 lại các tab web đang mở để content script nạp code mới.

---

## 3. Các thành phần then chốt cần chú ý khi phát triển

### 3.1. Shadow DOM CSS Isolation
- Content script inject overlay vào trang mục tiêu thông qua `attachShadow({ mode: 'open' })`.
- Mọi CSS của tag phải được bơm vào trong Shadow Root (hoặc qua `<style>` tag nội bộ).
- Khung container bao ngoài cùng phải luôn mang style:
  ```css
  pointer-events: none;
  position: fixed;
  z-index: 2147483647;
  ```
- Các phần tử badge cụ thể mang `pointer-events: auto` để người dùng có thể click hoặc hover.

### 3.2. URL Matching Engine
- Luôn kiểm thử matcher với 5 dạng pattern:
  1. **Exact Host**: `example.com`
  2. **Wildcard Subdomain**: `*.staging.mycompany.com` (khớp cả `api.staging...` lẫn `web.staging...`)
  3. **Port Matching**: `localhost:3000`, `127.0.0.1:8080`, `*:5173`
  4. **Path Pattern**: `github.com/*/pulls/*`, `my-app.com/admin/*`
  5. **Regex**: `^https://(qa|dev)\.domain\.com`

### 3.3. chrome.storage.local Reactive Sync
- Không lưu dữ liệu vào biến in-memory vĩnh viễn ở content script vì sẽ bị mất khi trang reload.
- Sử dụng listener:
  ```ts
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.tags) {
      // Tự động re-render tag trên trang ngay lập tức
    }
  });
  ```

---

## 4. Xử lý sự cố thường gặp (Troubleshooting)

- **Lỗi thiếu icon khi Load unpacked**: Kiểm tra xem file `dist/manifest.json` có trỏ đúng vào các file icon trong `dist/icons/` hay không. Chạy `node scripts/generate-icons.js` nếu thiếu.
- **Lỗi Content Script không hiển thị trên website**:
  - Kiểm tra xem trang có bị cấm extension không (ví dụ: `chrome://`, Chrome Web Store không cho phép inject script).
  - Kiểm tra console log trong tab web (F12 -> Console) xem có thông báo `[LayerMark]` không.
- **Lỗi CSS của web bị méo mó**: Đảm bảo không render bất kỳ element nào ra ngoài Shadow DOM.
