# LayerMark

**LayerMark** là tiện ích mở rộng (Chrome Extension Manifest V3) quản lý tag và nhãn dán môi trường trực quan, linh hoạt và độc lập 100% với backend. Giúp lập trình viên, QA và DevOps phân biệt rõ ràng giữa Production, Staging, Dev và Localhost bằng overlay badge cô lập CSS tuyệt đối.

---

## ✨ Điểm Nổi Bật

- 🎨 **Tùy biến trực quan cao**: Tùy chỉnh tên, màu nền, màu chữ, icon (Lucide Icons / Emoji), kích thước, độ mờ đục và vị trí hiển thị (Góc trên/dưới, thanh banner, ruy băng góc).
- 🎯 **Quy tắc so khớp URL linh hoạt**: Hỗ trợ domain chính xác, wildcard subdomain (`*.domain.com`), port (`localhost:3000`) và đường dẫn path pattern.
- 🧩 **Hiển thị nhiều tag đồng thời**: Tự động xếp hàng thông minh (stacking flexbox) không đè che khuất nhau.
- 🛡️ **Cô lập CSS tuyệt đối qua Shadow DOM**: Không bị ảnh hưởng bởi CSS của trang web và không làm biến dạng giao diện website người dùng.
- ⚡ **Xem trước theo thời gian thực (Live Preview)**: Xem trước giao diện badge ngay khi đang chỉnh sửa.
- 🗂️ **Trang quản trị tập trung (Dashboard)**: Tìm kiếm, lọc theo môi trường, phân nhóm theo dự án, kéo thả thay đổi thứ tự ưu tiên.
- 🚀 **Popup thao tác nhanh**: Xem các tag đang áp dụng trên tab hiện tại, bật/tắt nhanh 1 chạm, thêm tag tức thì.
- 💾 **Lưu trữ Offline & Import/Export JSON**: 100% local storage (`chrome.storage.local`), không cần tài khoản, dễ dàng sao lưu hoặc chia sẻ cấu hình cho team.

---

## 🛠️ Cài Đặt & Phát Triển

### Yêu cầu môi trường
- **Node.js**: phiên bản `>= 18.0.0`
- **pnpm**: trình quản lý gói khuyến nghị

### Cài đặt dependencies
```bash
pnpm install
```

### Build tiện ích
```bash
pnpm run build
```

Sau khi build xong, mã nguồn tiện ích đã sẵn sàng tại thư mục `dist/`.

---

## 🔌 Hướng Dẫn Cài Đặt Tiện Ích Vào Trình Duyệt

1. Mở trình duyệt Chrome, Edge, Brave hoặc Cốc Cốc.
2. Truy cập thanh địa chỉ: `chrome://extensions/`
3. Kích hoạt chế độ **Chế độ dành cho nhà phát triển** (**Developer mode**) ở góc trên bên phải màn hình.
4. Bấm vào nút **Tải tiện ích đã giải nén** (**Load unpacked**).
5. Điều hướng và chọn thư mục `dist/` nằm trong thư mục dự án `LayerMark`.
6. Ghim biểu tượng **LayerMark** lên thanh công cụ trình duyệt để bắt đầu sử dụng.

---

## 📚 Tài Liệu Kỹ Thuật

- [Chỉ dẫn phát triển cho AI Agent (`AGENTS.md`)](./AGENTS.md)
- [Kiến trúc hệ thống (`docs/ARCHITECTURE.md`)](./docs/ARCHITECTURE.md)
- [Đặc tả dữ liệu & Schema JSON (`docs/DATA_SPECIFICATION.md`)](./docs/DATA_SPECIFICATION.md)
- [Lộ trình triển khai 5 giai đoạn (`docs/ROADMAP.md`)](./docs/ROADMAP.md)
- [Quy trình phát triển & debug (`.agents/skills/layermark-dev/SKILL.md`)](./.agents/skills/layermark-dev/SKILL.md)

---

## 📄 Bản Quyền & Giấy Phép
Dự án được phân phối dưới giấy phép mã nguồn mở MIT.
