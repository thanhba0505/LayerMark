/**
 * LayerMark Internationalization (i18n) Module
 * Supports Vietnamese (vi) and English (en)
 */

import { AppLanguage } from './types';

export const translations = {
  en: {
    // Brand & General
    appName: 'LayerMark',
    appSubtitle: 'Visual Environment & Website Tag Manager',
    dashboard: 'Dashboard',
    popupTitle: 'LayerMark',
    version: 'Version',
    localStorage: '100% Offline Local Storage',

    // Actions & Buttons
    createTag: 'Create New Tag',
    editTag: 'Edit Tag',
    duplicateTag: 'Duplicate',
    deleteTag: 'Delete',
    cancel: 'Cancel',
    save: 'Save Changes',
    confirm: 'Confirm',
    importJson: 'Import JSON',
    exportJson: 'Export JSON',
    loadPresets: 'Load Presets',
    resetDefaults: 'Reset to Defaults',
    openDashboard: 'Open Dashboard',
    close: 'Close',
    addRule: 'Add URL Rule',
    removeRule: 'Remove',
    testUrl: 'Test URL Match',
    testPlaceholder: 'e.g. https://staging.myapp.com:3000/admin',
    matched: 'Matches this tag!',
    notMatched: 'Does not match',
    moveUp: 'Move Up (Higher Priority)',
    moveDown: 'Move Down (Lower Priority)',

    // Navigation & Tabs
    allEnvironments: 'All Environments',
    production: 'Production',
    staging: 'Staging',
    uat: 'UAT',
    development: 'Development',
    local: 'Localhost',
    testing: 'Testing / QA',
    custom: 'Custom',

    // Search & Filters
    searchPlaceholder: 'Search by tag name, domain, project or path...',
    filterByEnv: 'Filter by Environment',
    groupBy: 'Group by',
    groupByNone: 'No Grouping',
    groupByEnv: 'Environment',
    groupByProject: 'Project',
    sortByPriority: 'Sorted by Priority (Top renders first)',

    // Empty States
    noTagsFound: 'No tags found',
    noTagsFoundDesc: 'Try adjusting your search query or filter criteria.',
    emptyDashboardTitle: 'No tags created yet',
    emptyDashboardDesc: 'LayerMark helps you distinctly identify Production, Staging, Dev, and Localhost environments on your browser with zero latency.',
    popupNoMatch: 'No active tags matching this URL.',
    popupCreateForDomain: 'Create tag for this domain',
    matchedTagsCount: 'Matched Tags',
    activeTabHost: 'Active Tab Host',

    // Tag Editor Modal
    modalCreateTitle: 'Create Environment Tag',
    modalEditTitle: 'Edit Environment Tag',
    tabBasic: 'General',
    tabStyle: 'Appearance',
    tabRules: 'URL Rules',
    tabPreview: 'Live Preview',

    // Form Labels
    tagName: 'Tag Name',
    tagNamePlaceholder: 'e.g. PRODUCTION, STAGING, DEV API',
    environment: 'Environment Type',
    project: 'Project Name',
    projectPlaceholder: 'e.g. CRM, Storefront, Internal Tool (Optional)',
    description: 'Description',
    descriptionPlaceholder: 'Brief note for this environment...',
    enabled: 'Enabled',
    priority: 'Priority Order',

    // Appearance Form
    bgColor: 'Background Color',
    textColor: 'Text Color',
    borderColor: 'Border Color',
    size: 'Size',
    sizeSmall: 'Small',
    sizeMedium: 'Medium',
    sizeLarge: 'Large',
    sizeCustom: 'Custom',
    opacity: 'Opacity',
    borderRadius: 'Corner Radius (px)',
    icon: 'Icon',
    iconNone: 'No Icon',
    anchorPosition: 'Screen Position',
    pulseAnimation: 'Pulse Alert Animation',
    pulseAnimationDesc: 'Adds a subtle pulsing alert badge (recommended for Production).',
    collapseOnHover: 'Minimize on Hover',
    collapseOnHoverDesc: 'Dim or minimize the tag when hovering to avoid obstructing page content.',

    // Anchor Positions
    anchorTopLeft: 'Top Left',
    anchorTopRight: 'Top Right (Recommended for Prod)',
    anchorBottomLeft: 'Bottom Left',
    anchorBottomRight: 'Bottom Right',
    anchorTopCenter: 'Top Center',
    anchorBottomCenter: 'Bottom Center',
    anchorTopBanner: 'Full Top Banner',
    anchorBottomBanner: 'Full Bottom Banner',
    anchorRibbonTopRight: 'Top Right Ribbon',
    anchorRibbonTopLeft: 'Top Left Ribbon',

    // URL Rules
    rulesTitle: 'URL Matching Rules',
    rulesDesc: 'This tag will display on any webpage whose URL matches at least one enabled rule below.',
    ruleType: 'Match Type',
    rulePattern: 'Pattern',
    rulePatternPlaceholder: 'e.g. *.staging.example.com or localhost:3000',
    typeExactDomain: 'Exact Host (e.g. myapp.com)',
    typeWildcardDomain: 'Wildcard Subdomain (e.g. *.staging.app.com)',
    typePort: 'Port (e.g. localhost:3000, 127.0.0.1:8080)',
    typePathPattern: 'Path Prefix (e.g. app.com/admin/*)',
    typeRegex: 'Regular Expression (Regex)',

    // Import / Export
    importTitle: 'Import JSON Configuration',
    importDesc: 'Upload a LayerMark JSON file to restore or add environment tags.',
    importModeOverwrite: 'Overwrite existing tags',
    importModeMerge: 'Merge with existing tags (Keep existing & add new)',
    selectJsonFile: 'Select .JSON file',
    exportSuccess: 'Exported tags successfully!',
    importSuccess: 'Imported tags successfully!',
    importError: 'Invalid LayerMark JSON file schema.',

    // Confirmation & Notifications
    deleteConfirmTitle: 'Delete Tag?',
    deleteConfirmDesc: 'Are you sure you want to delete this tag? This action cannot be undone.',
    resetConfirmTitle: 'Reset to Default Presets?',
    resetConfirmDesc: 'This will replace all your current tags with the default Production, Staging, Dev, and Localhost presets.',
    tagSaved: 'Tag saved successfully!',
    tagDeleted: 'Tag deleted.',
    tagDuplicated: 'Tag duplicated.',

    // Settings
    settingsTitle: 'Global Settings',
    language: 'Language',
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System Default',
    globalToggle: 'Enable Extension',
    globalToggleDesc: 'Master switch to turn all visual badges on or off without losing configuration.',
  },

  vi: {
    // Brand & General
    appName: 'LayerMark',
    appSubtitle: 'Quản lý Tag & Nhãn dán Môi trường Trực quan',
    dashboard: 'Bảng Điều Khiển',
    popupTitle: 'LayerMark',
    version: 'Phiên bản',
    localStorage: 'Lưu trữ 100% Offline Local',

    // Actions & Buttons
    createTag: 'Tạo Tag Mới',
    editTag: 'Chỉnh Sửa',
    duplicateTag: 'Nhân Bản',
    deleteTag: 'Xóa',
    cancel: 'Hủy',
    save: 'Lưu Thay Đổi',
    confirm: 'Xác Nhận',
    importJson: 'Nhập JSON',
    exportJson: 'Xuất JSON',
    loadPresets: 'Tải Mẫu Có Sẵn',
    resetDefaults: 'Khôi Phục Mặc Định',
    openDashboard: 'Mở Trang Quản Lý',
    close: 'Đóng',
    addRule: 'Thêm Quy Tắc URL',
    removeRule: 'Xóa',
    testUrl: 'Kiểm Tra Khớp URL',
    testPlaceholder: 'ví dụ: https://staging.myapp.com:3000/admin',
    matched: 'Khớp với tag này!',
    notMatched: 'Không khớp',
    moveUp: 'Đẩy lên (Ưu tiên cao hơn)',
    moveDown: 'Hạ xuống (Ưu tiên thấp hơn)',

    // Navigation & Tabs
    allEnvironments: 'Tất Cả Môi Trường',
    production: 'Production',
    staging: 'Staging',
    uat: 'UAT',
    development: 'Development',
    local: 'Localhost',
    testing: 'Testing / QA',
    custom: 'Tùy Chỉnh',

    // Search & Filters
    searchPlaceholder: 'Tìm theo tên tag, domain, dự án hoặc path...',
    filterByEnv: 'Lọc theo môi trường',
    groupBy: 'Nhóm theo',
    groupByNone: 'Không nhóm',
    groupByEnv: 'Môi trường',
    groupByProject: 'Dự án',
    sortByPriority: 'Sắp xếp theo thứ tự ưu tiên (Trên cùng hiển thị trước)',

    // Empty States
    noTagsFound: 'Không tìm thấy tag nào',
    noTagsFoundDesc: 'Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc môi trường.',
    emptyDashboardTitle: 'Chưa có tag nào được tạo',
    emptyDashboardDesc: 'LayerMark giúp bạn phân biệt rõ ràng giữa Production, Staging, Dev và Localhost ngay trên trình duyệt với tốc độ tức thì.',
    popupNoMatch: 'Chưa có tag nào kích hoạt cho URL này.',
    popupCreateForDomain: 'Tạo tag cho domain này',
    matchedTagsCount: 'Tag Đang Khớp',
    activeTabHost: 'Domain Tab Hiện Tại',

    // Tag Editor Modal
    modalCreateTitle: 'Tạo Nhãn Dán Môi Trường Mới',
    modalEditTitle: 'Chỉnh Sửa Nhãn Dán',
    tabBasic: 'Thông Tin Chung',
    tabStyle: 'Giao Diện & Vị Trí',
    tabRules: 'Quy Tắc URL',
    tabPreview: 'Xem Trước Trực Tiếp',

    // Form Labels
    tagName: 'Tên Tag',
    tagNamePlaceholder: 'ví dụ: PRODUCTION, STAGING, DEV API',
    environment: 'Môi Trường',
    project: 'Tên Dự Án',
    projectPlaceholder: 'ví dụ: CRM, E-Commerce, Portal (Không bắt buộc)',
    description: 'Mô Tả / Ghi Chú',
    descriptionPlaceholder: 'Ghi chú ngắn cho môi trường này...',
    enabled: 'Kích hoạt',
    priority: 'Thứ Tự Ưu Tiên',

    // Appearance Form
    bgColor: 'Màu Nền',
    textColor: 'Màu Chữ',
    borderColor: 'Màu Viền',
    size: 'Kích Thước',
    sizeSmall: 'Nhỏ',
    sizeMedium: 'Vừa',
    sizeLarge: 'Lớn',
    sizeCustom: 'Tùy Chỉnh',
    opacity: 'Độ Mờ Đục',
    borderRadius: 'Bo Góc (px)',
    icon: 'Icon Biểu Tượng',
    iconNone: 'Không dùng Icon',
    anchorPosition: 'Vị Trí Hiển Thị',
    pulseAnimation: 'Hiệu Ứng Nhấp Nháy Cảnh Báo',
    pulseAnimationDesc: 'Thêm chấm tròn nhấp nháy thu hút sự chú ý (khuyên dùng cho Production).',
    collapseOnHover: 'Thu Nhỏ Khi Rê Chuột',
    collapseOnHoverDesc: 'Tự động làm mờ hoặc thu nhỏ tag khi chuột rê vào để không che khuất nội dung website.',

    // Anchor Positions
    anchorTopLeft: 'Góc Trên Trái',
    anchorTopRight: 'Góc Trên Phải (Khuyên dùng cho Prod)',
    anchorBottomLeft: 'Góc Dưới Trái',
    anchorBottomRight: 'Góc Dưới Phải',
    anchorTopCenter: 'Giữa Trên Cùng',
    anchorBottomCenter: 'Giữa Dưới Cùng',
    anchorTopBanner: 'Thanh Banner Trên Cùng',
    anchorBottomBanner: 'Thanh Banner Dưới Cùng',
    anchorRibbonTopRight: 'Ruy Băng Góc Phải',
    anchorRibbonTopLeft: 'Ruy Băng Góc Trái',

    // URL Rules
    rulesTitle: 'Danh Sách Quy Tắc URL',
    rulesDesc: 'Tag này sẽ xuất hiện trên bất kỳ website nào khớp với ít nhất một quy tắc bên dưới.',
    ruleType: 'Loại Quy Tắc',
    rulePattern: 'Mẫu So Khớp',
    rulePatternPlaceholder: 'ví dụ: *.staging.example.com hoặc localhost:3000',
    typeExactDomain: 'Tên miền chính xác (ví dụ: myapp.com)',
    typeWildcardDomain: 'Tên miền con Wildcard (ví dụ: *.staging.app.com)',
    typePort: 'Khớp Port Local (ví dụ: localhost:3000, 127.0.0.1:8080)',
    typePathPattern: 'Khớp Đường Dẫn (ví dụ: app.com/admin/*)',
    typeRegex: 'Biểu Thức Chính Quy (Regex)',

    // Import / Export
    importTitle: 'Nhập Cấu Hình JSON',
    importDesc: 'Tải lên tệp JSON LayerMark để khôi phục hoặc bổ sung danh sách tag.',
    importModeOverwrite: 'Ghi đè toàn bộ danh sách hiện tại',
    importModeMerge: 'Gộp vào danh sách hiện có (Giữ tag cũ và thêm tag mới)',
    selectJsonFile: 'Chọn tệp .JSON',
    exportSuccess: 'Xuất tệp cấu hình thành công!',
    importSuccess: 'Nhập cấu hình thành công!',
    importError: 'Định dạng file JSON không hợp lệ.',

    // Confirmation & Notifications
    deleteConfirmTitle: 'Xác Nhận Xóa Tag?',
    deleteConfirmDesc: 'Bạn có chắc chắn muốn xóa tag này không? Thao tác này không thể hoàn tác.',
    resetConfirmTitle: 'Khôi Phục Mẫu Mặc Định?',
    resetConfirmDesc: 'Thao tác này sẽ đặt lại danh sách tag về các mẫu mặc định ban đầu (Production, Staging, Dev, Local).',
    tagSaved: 'Đã lưu tag thành công!',
    tagDeleted: 'Đã xóa tag.',
    tagDuplicated: 'Đã nhân bản tag.',

    // Settings
    settingsTitle: 'Cài Đặt Hệ Thống',
    language: 'Ngôn Ngữ',
    theme: 'Giao Diện',
    themeLight: 'Sáng',
    themeDark: 'Tối',
    themeSystem: 'Theo Hệ Thống',
    globalToggle: 'Bật Tiện Ích',
    globalToggleDesc: 'Công tắc chính để bật/tắt toàn bộ nhãn dán trên trình duyệt mà không mất cấu hình.',
  }
} as const;

export type TranslationKey = keyof typeof translations.en;

export function getTranslation(key: TranslationKey, lang: AppLanguage = 'vi'): string {
  const dictionary = translations[lang] || translations.en;
  return dictionary[key] || translations.en[key] || key;
}
