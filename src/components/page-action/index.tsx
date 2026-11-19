import type { ButtonProps } from '@mui/material';

import { Button } from '@mui/material';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

type PageActionProps = Omit<ButtonProps, 'variant' | 'color'> & {
  /** Đường dẫn khi nút là link (tạo mới qua trang khác) */
  href?: string;
};

/**
 * Hành động chính của trang danh sách (Thêm mới / Tải lên) theo AT UI kit: gradient cam, 1 nút/màn.
 * - Màn ≥ 600dp: nút thường trên đầu trang.
 * - Điện thoại: nút nổi (FAB) góc dưới phải, nằm trên thanh tab đáy và vùng an toàn.
 * Cùng một phần tử cho cả hai kiểu nên locator (id, chữ) không đổi.
 */
export function PageAction({ href, sx, ...other }: PageActionProps) {
  return (
    <Button
      variant="contained"
      color="secondary"
      {...(href && { LinkComponent: RouterLink, href })}
      sx={[
        (theme) => ({
          flexShrink: 0,
          [theme.breakpoints.down('sm')]: {
            position: 'fixed',
            right: 16,
            bottom: 'calc(64px + env(safe-area-inset-bottom, 0px) + 16px)',
            zIndex: theme.zIndex.speedDial,
            minHeight: 52,
            px: 2.5,
            borderRadius: 999,
            fontSize: theme.typography.pxToRem(15),
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    />
  );
}
