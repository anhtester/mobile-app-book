import { useTranslation } from 'react-i18next';

import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';

import { RouterLink } from 'src/routes/components';

import { useCartCount } from 'src/store/cart';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

/**
 * Nút giỏ hàng trên header: số trên huy hiệu = tổng số cuốn trong giỏ (giỏ lưu ở máy).
 * Locator: `id="header-cart"`, `data-testid="header-cart"`, số `data-testid="header-cart-count"`.
 */
export function CartButton() {
  const { t } = useTranslation();
  const count = useCartCount();

  return (
    <IconButton
      id="header-cart"
      component={RouterLink}
      href="/cart"
      aria-label={t('shop.cart.open')}
      data-testid="header-cart"
      sx={{ width: 44, height: 44 }}
    >
      <Badge
        badgeContent={count}
        max={99}
        data-testid="header-cart-count"
        sx={{
          '& .MuiBadge-badge': {
            color: '#fff',
            fontWeight: 700,
            backgroundImage: 'var(--at-grad-orange)',
            boxShadow: 'var(--at-glow-orange)',
          },
        }}
      >
        <Iconify icon="solar:cart-large-minimalistic-bold-duotone" width={26} />
      </Badge>
    </IconButton>
  );
}
