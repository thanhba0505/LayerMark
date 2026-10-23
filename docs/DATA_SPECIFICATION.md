# LayerMark — Đặc Tả Dữ Liệu & Schema (Data Specification)

Tài liệu này quy định cấu trúc dữ liệu JSON, các interface, kiểu quy tắc so khớp và định dạng Import/Export của tiện ích **LayerMark**.

---

## 1. Cấu trúc Mô hình Dữ liệu (TypeScript Definitions)

### 1.1. Tag Entity (`LayerMarkTag`)

```typescript
export interface LayerMarkTag {
  id: string;               // UUID duy nhất (ví dụ: "tag_9f82d1...")
  name: string;             // Tên hiển thị (ví dụ: "PRODUCTION", "STAGING", "DEV")
  description?: string;     // Ghi chú mô tả ngắn
  enabled: boolean;         // Trạng thái bật/tắt (true/false)
  priority: number;         // Thứ tự ưu tiên (0, 1, 2... Số nhỏ xếp trước)
  project?: string;         // Phân nhóm dự án (ví dụ: "Core Banking", "CRM")
  environment: EnvironmentType; // "production" | "staging" | "development" | "local" | "testing" | "custom"
  style: TagStyle;          // Cấu hình giao diện tag
  rules: UrlRule[];         // Danh sách quy tắc URL áp dụng cho tag này
  createdAt: number;        // Epoch timestamp mili-giây
  updatedAt: number;        // Epoch timestamp mili-giây
}
```

### 1.2. Cấu hình Giao diện Tag (`TagStyle`)

```typescript
export interface TagStyle {
  bgColor: string;          // Màu nền Hex/RGBA (mặc định: "#EF4444")
  textColor: string;        // Màu chữ Hex/RGBA (mặc định: "#FFFFFF")
  borderColor?: string;     // Màu viền (tùy chọn)
  borderWidth?: number;     // Độ dày viền (px, mặc định: 0)
  borderRadius?: number;    // Bo góc (px, mặc định: 6)
  opacity?: number;         // Độ mờ đục (0.1 -> 1.0, mặc định: 0.95)
  fontSize?: number;        // Kích thước chữ (px, mặc định: 12)
  size: TagSize;            // "small" | "medium" | "large" | "custom"
  icon?: string;            // Tên icon Lucide hoặc ký tự emoji (ví dụ: "ShieldAlert", "Server", "🔥")
  anchorPosition: AnchorPosition; // Vị trí neo màn hình
  offsetX?: number;         // Khoảng cách mép ngang (px)
  offsetY?: number;         // Khoảng cách mép dọc (px)
  pulseAnimation?: boolean; // Hiệu ứng nhịp đập cảnh báo (dành cho Prod)
}
```

### 1.3. Quy tắc Khớp URL (`UrlRule`)

```typescript
export interface UrlRule {
  id: string;               // UUID định danh rule
  type: RuleMatchType;      // "exact-domain" | "wildcard-domain" | "port" | "path-pattern" | "regex"
  pattern: string;          // Chuỗi mẫu so khớp
  description?: string;     // Ghi chú của rule
  enabled: boolean;         // Bật/tắt riêng lẻ từng rule
}
```

---

## 2. Định dạng Tệp Import / Export JSON

Khi người dùng sao lưu hoặc chia sẻ cấu hình tag cho đồng đội, tiện ích xuất file JSON chuẩn theo định dạng sau:

```json
{
  "app": "LayerMark",
  "version": "1.0.0",
  "exportedAt": "2026-10-23T12:00:00.000Z",
  "tags": [
    {
      "id": "tag_prod_preset",
      "name": "PRODUCTION",
      "description": "Cảnh báo môi trường thực tế, cẩn trọng thao tác dữ liệu",
      "enabled": true,
      "priority": 0,
      "project": "Chung",
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
      "description": "Môi trường thử nghiệm trước khi release",
      "enabled": true,
      "priority": 1,
      "project": "Chung",
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
      "description": "Môi trường lập trình trên máy nội bộ",
      "enabled": true,
      "priority": 2,
      "project": "Chung",
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

## 3. Quy chuẩn Xác thực Dữ liệu (Schema Validation Rules)

Khi nhập file JSON từ bên ngoài:
1. **Kiểm tra Header**: Trường `app === "LayerMark"`.
2. **Kiểm tra Mảng Tag**: `Array.isArray(tags)` và có ít nhất 0 phần tử.
3. **Làm sạch (Sanitize)**:
   - Các trường màu sắc `bgColor` và `textColor` chỉ chấp nhận mã Hex hợp lệ (`#xxxxxx`) hoặc định dạng màu an toàn, loại bỏ các chuỗi chứa `javascript:` hoặc mã độc.
   - Loại bỏ các ký tự HTML có khả năng gây XSS trong trường `name`, `description` và `pattern`.
4. **Giải quyết Trùng lặp ID**: Tự động sinh ID mới nếu ID đã tồn tại trong local storage khi chọn chế độ "Merge" (Gộp).
