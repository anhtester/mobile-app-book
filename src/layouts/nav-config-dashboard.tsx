import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  /** Khoá dịch trong src/locales (rule 9) */
  tKey?: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Dashboard',
    tKey: 'nav.dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'User',
    tKey: 'nav.user',
    path: '/user-management',
    icon: icon('ic-user'),
  },
  {
    title: 'Book',
    tKey: 'nav.book',
    path: '/book-management',
    icon: icon('ic-book'),
  },
  {
    title: 'Promotion',
    tKey: 'nav.promotion',
    path: '/promotion-book-management',
    icon: icon('ic-sale'),
  },
  {
    title: 'File',
    tKey: 'nav.file',
    path: '/file-management',
    icon: icon('ic-dir'),
  },
];
