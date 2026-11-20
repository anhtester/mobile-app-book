import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

import { Iconify } from 'src/components/iconify';

import type { AccountPopoverProps } from './components/account-popover';
// ----------------------------------------------------------------------

export const _account: AccountPopoverProps['data'] = [
  {
    label: 'Home',
    tKey: 'account.home',
    href: '/',
    icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" />,
  },
  {
    label: 'Profile',
    tKey: 'account.profile',
    href: '/user-management/my-profile',
    icon: <Iconify width={22} icon="solar:shield-keyhole-bold-duotone" />,
  },
  {
    label: 'My orders',
    tKey: 'account.orders',
    href: '/orders',
    icon: <Iconify width={22} icon="solar:bill-list-bold-duotone" />,
  },
  {
    label: 'Settings',
    tKey: 'account.settings',
    href: '/user-management/setting-account',
    icon: <Iconify width={22} icon="solar:settings-bold-duotone" />,
  },
  // Chỉ Android: Apple không cho app tự thoát (App.exitApp bị từ chối khi duyệt App Store)
  ...(Capacitor.getPlatform() === 'android'
    ? [
        {
          label: 'Exit app',
          tKey: 'account.exitApp',
          href: '#',
          icon: <Iconify width={22} icon="solar:exit-bold" />,
          onClick: async () => {
            await App.exitApp();
          },
        },
      ]
    : []),
];
