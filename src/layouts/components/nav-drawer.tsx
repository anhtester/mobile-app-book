import type { TKey } from 'src/locales';

import { useState } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import {
  Box,
  Badge,
  Stack,
  Drawer,
  IconButton,
  Typography,
  ListItemText,
  ListItemIcon,
  ListItemButton,
} from '@mui/material';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useAuth } from 'src/store/auth';
import { useTranslate } from 'src/locales';
import { useCartCount } from 'src/store/cart';
import { isHiddenPath } from 'src/config-global';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

type Item = {
  path: string;
  tKey: TKey;
  icon: React.ReactNode;
  /** Chỉ hiện khi đã đăng nhập */
  auth?: boolean;
  badge?: 'cart';
};

const svg = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

const GROUPS: { tKey: TKey; items: Item[] }[] = [
  {
    tKey: 'nav.groups.manage',
    items: [
      { path: '/', tKey: 'nav.dashboard', icon: svg('ic-analytics') },
      { path: '/user-management', tKey: 'nav.user', icon: svg('ic-user') },
      { path: '/book-management', tKey: 'nav.book', icon: svg('ic-book') },
      { path: '/category-management', tKey: 'nav.category', icon: svg('ic-category') },
      { path: '/promotion-book-management', tKey: 'nav.promotion', icon: svg('ic-sale') },
    ],
  },
  {
    tKey: 'nav.groups.shop',
    items: [
      { path: '/cart', tKey: 'nav.cart', icon: svg('ic-cart'), badge: 'cart' },
      {
        path: '/orders',
        tKey: 'nav.orders',
        icon: <Iconify icon="solar:bill-list-bold-duotone" width={24} />,
      },
    ],
  },
  {
    tKey: 'nav.groups.account',
    items: [
      {
        path: '/user-management/my-profile',
        tKey: 'account.profile',
        icon: <Iconify icon="solar:shield-keyhole-bold-duotone" width={24} />,
        auth: true,
      },
      {
        path: '/user-management/setting-account',
        tKey: 'account.settings',
        icon: <Iconify icon="solar:settings-bold-duotone" width={24} />,
        auth: true,
      },
    ],
  },
  {
    tKey: 'nav.groups.other',
    items: [{ path: '/contact', tKey: 'nav.contact', icon: svg('ic-contact') }],
  },
];

/** `/` khớp đúng trang chủ; các mục khác khớp cả trang con (VD /orders/BK...) nhưng không nuốt mục con có riêng */
function isActive(path: string, pathname: string) {
  if (path === '/') return pathname === '/';
  if (path === '/user-management')
    return pathname === path || (pathname.startsWith(`${path}/`) && !/my-profile|setting-account/.test(pathname));
  return pathname === path || pathname.startsWith(`${path}/`);
}

/**
 * Menu đầy đủ ở góc trái header (2026-11-21, người dùng: "Thêm menu cho mobile phía trên để chứa
 * được nhiều hơn"). Thanh tab đáy chỉ đủ 5 mục; menu này có mọi màn, chia nhóm Quản lý / Mua sắm /
 * Tài khoản / Khác. Locator: nút `#header-menu`, ngăn kéo `#nav-drawer`, mục `#nav-drawer-<path>`
 * (VD `nav-drawer-category-management`, trang chủ là `nav-drawer-dashboard`).
 */
export function NavDrawer() {
  const { t } = useTranslate();
  const { auth } = useAuth();
  const pathname = usePathname();
  const cartCount = useCartCount();
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        id="header-menu"
        aria-label={t('nav.menu')}
        aria-expanded={open}
        aria-controls="nav-drawer"
        onClick={() => setOpen(true)}
        sx={{ width: 44, height: 44, ml: -1, color: 'text.primary' }}
      >
        <Iconify icon="custom:menu-duotone" width={26} />
      </IconButton>

      <Drawer
        id="nav-drawer"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 'min(300px, 84vw)',
              pt: 'env(safe-area-inset-top, 0px)',
              pb: 'env(safe-area-inset-bottom, 0px)',
            },
          },
        }}
      >
        <Stack direction="row" alignItems="center" sx={{ px: 2, height: 64, flexShrink: 0 }}>
          <Box sx={{ flex: 1 }}>
            <Logo height={32} />
          </Box>
          <IconButton
            id="nav-drawer-close"
            aria-label={t('nav.closeMenu')}
            onClick={() => setOpen(false)}
          >
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Stack>

        <Box component="nav" sx={{ px: 1.5, pb: 3, overflowY: 'auto' }}>
          {GROUPS.map((group) => {
            const items = group.items.filter(
              (i) => !isHiddenPath(i.path) && (!i.auth || !!auth)
            );
            if (!items.length) return null;
            return (
              <Box key={group.tKey} sx={{ mt: 1.5 }}>
                <Typography
                  variant="overline"
                  component="p"
                  sx={{ px: 1.5, mb: 0.5, color: 'text.disabled', fontSize: 11.5 }}
                >
                  {t(group.tKey)}
                </Typography>
                {items.map((item) => {
                  const active = isActive(item.path, pathname);
                  const slug = item.path === '/' ? 'dashboard' : item.path.slice(1).replace(/\//g, '-');
                  return (
                    <ListItemButton
                      key={item.path}
                      id={`nav-drawer-${slug}`}
                      component={RouterLink}
                      href={item.path}
                      selected={active}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => setOpen(false)}
                      sx={(theme) => ({
                        mb: 0.5,
                        minHeight: 48,
                        borderRadius: 1.5,
                        color: 'text.secondary',
                        '&.Mui-selected': {
                          color: 'primary.main',
                          fontWeight: 700,
                          bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.1),
                        },
                      })}
                    >
                      <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                        {item.badge === 'cart' ? (
                          <Badge
                            badgeContent={cartCount}
                            max={99}
                            sx={{
                              '& .MuiBadge-badge': {
                                color: '#fff',
                                fontWeight: 700,
                                backgroundImage: 'var(--at-grad-orange)',
                              },
                            }}
                          >
                            {item.icon}
                          </Badge>
                        ) : (
                          item.icon
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={t(item.tKey)}
                        slotProps={{
                          primary: { sx: { fontWeight: 'inherit', color: 'inherit' } },
                        }}
                      />
                    </ListItemButton>
                  );
                })}
              </Box>
            );
          })}
        </Box>
      </Drawer>
    </>
  );
}
