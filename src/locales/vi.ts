import type { en } from './en';

// Tiếng Việt. Phải có đủ khoá như en.ts (TypeScript kiểm tra).
export const vi: typeof en = {
  common: {
    cancel: 'Huỷ',
    confirm: 'Xác nhận',
    delete: 'Xoá',
    close: 'Đóng',
    save: 'Lưu',
    reset: 'Đặt lại',
    search: 'Tìm kiếm...',
    noData: 'Không có dữ liệu',
    more: 'Thao tác khác',
    rowsPerPage: 'Số dòng:',
    displayedRows: '{{from}}–{{to}} / {{count}}',
    sortBy: 'Sắp xếp theo',
    ascending: 'Tăng dần',
    descending: 'Giảm dần',
    selectAll: 'Chọn tất cả',
  },
  nav: {
    dashboard: 'Tổng quan',
    user: 'Người dùng',
    book: 'Sách',
    promotion: 'Khuyến mãi',
    file: 'Tệp',
  },
  account: {
    home: 'Trang chủ',
    profile: 'Hồ sơ',
    settings: 'Cài đặt',
    exitApp: 'Thoát ứng dụng',
    logout: 'Đăng xuất',
    menu: 'Menu tài khoản',
  },
  language: {
    label: 'Ngôn ngữ',
    switchTo: 'Đổi ngôn ngữ',
    vi: 'Tiếng Việt',
    en: 'English',
  },
  dialog: {
    confirmTitle: 'Xác nhận',
    deleteTitle: 'Xác nhận xoá',
    messageTitle: 'Thông báo',
  },
  fab: {
    newUser: 'Thêm người dùng',
    newBook: 'Thêm sách',
    newPromotion: 'Thêm khuyến mãi',
    uploadFile: 'Tải tệp lên',
  },
  filter: {
    field: 'Trường',
    operator: 'Điều kiện',
    value: 'Giá trị',
    true: 'Đúng',
    false: 'Sai',
  },
};
