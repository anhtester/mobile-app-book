import { auth as authNs } from './ns/en/auth';
import { book as bookNs } from './ns/en/book';
import { home as homeNs } from './ns/en/home';
import { user as userNs } from './ns/en/user';
import { common as commonNs } from './ns/en/common';
import { category as categoryNs } from './ns/en/category';
import { promotion as promotionNs } from './ns/en/promotion';
import { components as componentsNs } from './ns/en/components';

// English. Keys must match vi.ts (checked by the type in index.ts).
// Namespace auth/user/book/promotion/home/components/common/category lấy từ bản web (src/locales/ns/),
// khoá riêng của mobile đặt ngay trong object dưới đây (ghi đè khi trùng).
export const en = {
  common: {
    ...commonNs,
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    close: 'Close',
    save: 'Save',
    reset: 'Reset',
    search: 'Search...',
    noData: 'No data',
    more: 'More actions',
    rowsPerPage: 'Rows per page:',
    displayedRows: '{{from}}–{{to}} of {{count}}',
    sortBy: 'Sort by',
    ascending: 'Ascending',
    descending: 'Descending',
    selectAll: 'Select all',
  },
  nav: {
    dashboard: 'Dashboard',
    user: 'User',
    book: 'Book',
    promotion: 'Promotion',
    file: 'File',
    contact: 'Contact',
  },
  contact: {
    title: 'Contact',
    description:
      'Contact Anh Tester directly by email or Zalo. Questions about the Book Management app, API testing or automation testing are all welcome.',
    info: {
      title: 'Contact',
      phone: 'Phone',
      email: 'Email',
      zalo: 'Zalo',
      website: 'Website',
    },
    social: {
      title: 'Follow Anh Tester',
    },
    community: {
      title: 'Community groups',
      automation: 'Automation Testing',
      manual: 'Manual Testing',
      playwright: 'Playwright Vietnam',
      jobs: 'Tester jobs',
    },
  },
  account: {
    home: 'Home',
    profile: 'Profile',
    settings: 'Settings',
    exitApp: 'Exit app',
    logout: 'Logout',
    menu: 'Account menu',
  },
  auth: {
    ...authNs,
    backToHome: 'Back to home',
    signIn: {
      ...authNs.signIn,
      title: 'Sign in',
      noAccount: 'Don’t have an account?',
      getStarted: 'Get started',
      emailLabel: 'Email address',
      passwordLabel: 'Password',
      submit: 'Login account',
    },
    validation: {
      ...authNs.validation,
      emailInvalid: 'Invalid email address',
      emailRequired: 'Email is required.',
      emailMaxLength: 'Email maximum length is 250 characters.',
      passwordRequired: 'Password is required.',
      passwordMaxLength: 'Password maximum length is 250 characters.',
    },
  },
  user: userNs,
  book: bookNs,
  promotion: promotionNs,
  home: homeNs,
  category: categoryNs,
  components: componentsNs,
  language: {
    label: 'Language',
    switchTo: 'Switch language',
    vi: 'Tiếng Việt',
    en: 'English',
  },
  dialog: {
    confirmTitle: 'Confirm',
    deleteTitle: 'Confirm delete',
    messageTitle: 'Message',
  },
  fab: {
    newUser: 'New user',
    newBook: 'New book',
    newPromotion: 'New Promotion',
    uploadFile: 'Upload file',
  },
  filter: {
    field: 'Field',
    operator: 'Operator',
    value: 'Value',
    true: 'True',
    false: 'False',
  },
};
