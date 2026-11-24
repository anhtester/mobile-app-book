import { useTranslation } from 'react-i18next';
import { varAlpha } from 'minimal-shared/utils';

import { Box, Tab, Tabs } from '@mui/material';

import { useRouter, usePathname } from 'src/routes/hooks';

import { useLayoutPadding } from '.';
import { navData } from '../nav-config-dashboard';

// ----------------------------------------------------------------------

/**
 * Thanh tab đáy (bottom nav). Theo AT UI kit: nền trắng, đường kẻ --at-line phía trên,
 * tab đang chọn chữ brand trên nền --at-brand-soft. Có vùng an toàn đáy (thanh điều hướng Android).
 * Locator test: `id="bottom-nav-<path>"` không đổi theo ngôn ngữ.
 */
export function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const { bottom } = useLayoutPadding();
  const current = '/' + pathname.split('/')[1];

  return (
    <Box
      component="nav"
      sx={(theme) => ({
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: 1,
        zIndex: theme.zIndex.appBar,
        display: 'flex',
        justifyContent: 'center',
        bgcolor: theme.vars.palette.background.paper,
        borderTop: `1px solid ${theme.vars.palette.divider}`,
        pb: `calc(${theme.spacing(bottom)} + env(safe-area-inset-bottom, 0px))`,
      })}
    >
      <Tabs
        // Trang không có tab riêng (giỏ hàng, thanh toán, đơn hàng) thì không chọn tab nào; truyền đường
        // dẫn không có trong danh sách tab làm MUI báo lỗi "value provided to the Tabs component is invalid"
        value={navData.some((i) => i.path === current) ? current : false}
        onChange={(_, value) => router.push(value)}
        variant="fullWidth"
        // Cao cố định 64dp: FAB (PageAction) và phần đệm đáy trang tính theo con số này
        sx={{ width: 1, maxWidth: 600, height: 64, minHeight: 64, '& .MuiTabs-indicator': { display: 'none' } }}
      >
        {navData.map((item) => (
          <Tab
            key={item.path}
            id={`bottom-nav-${item.path === '/' ? 'dashboard' : item.path.slice(1)}`}
            value={item.path}
            label={t(item.tKey)}
            icon={item.icon}
            disableRipple
            sx={(theme) => ({
              minWidth: 0,
              height: 64,
              minHeight: 64,
              px: 0.25,
              pt: 1,
              pb: 0.75,
              gap: 0.25,
              fontSize: theme.typography.pxToRem(12.5),
              fontWeight: 500,
              lineHeight: 1.2,
              // Màn 390dp (iPhone): "Khuyến mãi" in đậm khi đang chọn bị xuống 2 dòng ⇒ giữ 1 dòng, thu chữ ở màn hẹp (2026-11-25)
              whiteSpace: 'nowrap',
              '@media (max-width: 399.95px)': { fontSize: theme.typography.pxToRem(11.5) },
              color: theme.vars.palette.text.secondary,
              '& .minimal__svg__color__root': {
                width: 24,
                height: 24,
                mb: '0 !important',
                transition: 'transform .15s ease',
              },
              // Ô nền nhạt quanh icon của tab đang chọn
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 6,
                left: '50%',
                width: 52,
                height: 30,
                borderRadius: 999,
                transform: 'translateX(-50%)',
                transition: 'background-color .15s ease',
              },
              '&.Mui-selected': {
                color: theme.vars.palette.primary.main,
                fontWeight: 700,
                '&::before': {
                  backgroundColor: varAlpha(theme.vars.palette.primary.mainChannel, 0.12),
                },
                '& .minimal__svg__color__root': { transform: 'scale(1.05)' },
              },
            })}
          />
        ))}
      </Tabs>
    </Box>
  );
}
