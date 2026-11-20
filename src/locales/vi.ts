import { auth as authNs } from './ns/vi/auth';
import { book as bookNs } from './ns/vi/book';
import { home as homeNs } from './ns/vi/home';
import { shop as shopNs } from './ns/vi/shop';
import { user as userNs } from './ns/vi/user';
import { common as commonNs } from './ns/vi/common';
import { category as categoryNs } from './ns/vi/category';
import { bookstore as bookstoreNs } from './ns/vi/bookstore';
import { promotion as promotionNs } from './ns/vi/promotion';
import { components as componentsNs } from './ns/vi/components';

import type { en } from './en';

// Tiếng Việt. Phải có đủ khoá như en.ts (TypeScript kiểm tra).
export const vi: typeof en = {
  common: {
    ...commonNs,
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
    contact: 'Liên hệ',
    category: 'Danh mục',
    cart: 'Giỏ hàng',
    orders: 'Đơn hàng của tôi',
    menu: 'Mở menu',
    closeMenu: 'Đóng menu',
    groups: {
      manage: 'Quản lý',
      shop: 'Mua sắm',
      account: 'Tài khoản',
      other: 'Khác',
    },
  },
  contact: {
    title: 'Liên hệ',
    description:
      'Liên hệ trực tiếp Anh Tester qua email hoặc Zalo. Mọi câu hỏi về ứng dụng Quản lý sách, kiểm thử API hay automation testing đều được giải đáp.',
    info: {
      title: 'Liên hệ',
      phone: 'Điện thoại',
      email: 'Email',
      zalo: 'Zalo',
      website: 'Website',
    },
    social: {
      title: 'Theo dõi Anh Tester',
    },
    community: {
      title: 'Nhóm cộng đồng',
      automation: 'Automation Testing',
      manual: 'Manual Testing',
      playwright: 'Playwright Việt Nam',
      jobs: 'Tuyển dụng Tester',
    },
  },
  account: {
    home: 'Trang chủ',
    orders: 'Đơn hàng của tôi',
    profile: 'Hồ sơ',
    settings: 'Cài đặt',
    exitApp: 'Thoát ứng dụng',
    logout: 'Đăng xuất',
    menu: 'Menu tài khoản',
  },
  auth: {
    ...authNs,
    backToHome: 'Về trang chủ',
    signIn: {
      ...authNs.signIn,
      title: 'Đăng nhập',
      noAccount: 'Chưa có tài khoản?',
      getStarted: 'Đăng ký ngay',
      emailLabel: 'Địa chỉ email',
      passwordLabel: 'Mật khẩu',
      submit: 'Đăng nhập',
    },
    validation: {
      ...authNs.validation,
      emailInvalid: 'Địa chỉ email không hợp lệ',
      emailRequired: 'Vui lòng nhập email.',
      emailMaxLength: 'Email dài tối đa 250 ký tự.',
      passwordRequired: 'Vui lòng nhập mật khẩu.',
      passwordMaxLength: 'Mật khẩu dài tối đa 250 ký tự.',
    },
  },
  user: userNs,
  book: bookNs,
  promotion: promotionNs,
  home: homeNs,
  category: categoryNs,
  shop: shopNs,
  bookstore: {
    ...bookstoreNs,
    // Mobile: không có rê chuột, đổi câu gợi ý theo thao tác chạm
    detail: { ...bookstoreNs.detail, zoomHint: 'Chạm ảnh nhỏ để đổi trang · chạm ảnh lớn để xem toàn màn hình' },
  },
  components: componentsNs,
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
