import { useTranslation } from 'react-i18next';

import { Box, Card, Stack, Alert, Button, Typography } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { useCart } from 'src/store/cart';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import Title from 'src/components/title';
import { Iconify } from 'src/components/iconify';

import { useQuote } from './hooks/use-quote';
import { CartLines } from './components/cart-lines';
import { OrderSummary } from './components/order-summary';

// ----------------------------------------------------------------------

export function EmptyCart() {
  const { t } = useTranslation();
  return (
    <Stack
      alignItems="center"
      spacing={2}
      sx={{ py: 8, textAlign: 'center' }}
      data-testid="cart-empty"
    >
      <Box
        sx={{
          width: 104,
          height: 104,
          display: 'grid',
          placeItems: 'center',
          borderRadius: '50%',
          bgcolor: 'var(--at-sky-bg)',
          color: 'var(--at-sky-ink)',
        }}
      >
        <Iconify icon="solar:cart-large-minimalistic-bold-duotone" width={56} />
      </Box>
      <Typography variant="h5">{t('shop.cart.empty')}</Typography>
      <Typography color="text.secondary">{t('shop.cart.emptyHint')}</Typography>
      <Button
        id="cart-browse"
        variant="contained"
        color="primary"
        size="large"
        component={RouterLink}
        href="/book-management"
        startIcon={<Iconify icon="solar:book-2-bold-duotone" />}
      >
        {t('shop.cart.browse')}
      </Button>
    </Stack>
  );
}

export default function CartPage() {
  const { t } = useTranslation();
  const clear = useCart((s) => s.clear);
  const { items, quote, loading, error } = useQuote();
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <DashboardContent>
      <Title>{`${t('shop.cart.title')} - ${CONFIG.appName}`}</Title>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ flex: 1 }}>
          {t('shop.cart.title')}
          {count > 0 && (
            <Typography
              component="span"
              color="text.secondary"
              data-testid="cart-count"
              sx={{ ml: 1, fontSize: 16, fontWeight: 500 }}
            >
              ({t('shop.cart.count', { count })})
            </Typography>
          )}
        </Typography>
        {items.length > 0 && (
          <Button
            color="error"
            size="small"
            id="cart-clear"
            data-testid="cart-clear"
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            onClick={clear}
          >
            {t('shop.cart.removeAll')}
          </Button>
        )}
      </Stack>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <Stack spacing={3}>
          <Card sx={{ px: 2, py: 0.5 }}>
            {error && (
              <Alert severity="warning" sx={{ mt: 1.5 }}>
                {t('shop.cart.quoteError')}
              </Alert>
            )}
            <CartLines quote={quote} />
          </Card>

          <OrderSummary
            subtotal={quote?.subtotal ?? 0}
            discount={quote?.discount ?? 0}
            shippingFee={quote?.shippingFee ?? 0}
            total={quote?.total ?? 0}
            freeShipThreshold={quote?.freeShipThreshold}
            freeShipping={quote?.freeShipping}
            loading={loading}
          >
            <Button
              fullWidth
              size="large"
              variant="contained"
              color="secondary"
              id="cart-checkout"
              data-testid="cart-checkout"
              disabled={!quote?.canCheckout || loading}
              component={RouterLink}
              href="/checkout"
              endIcon={<Iconify icon="solar:arrow-right-linear" />}
            >
              {loading ? t('shop.cart.updating') : t('shop.cart.checkout')}
            </Button>
          </OrderSummary>

          <Button id="cart-continue"
            color="inherit"
            data-testid="cart-continue"
            component={RouterLink}
            href="/book-management"
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            sx={{ alignSelf: 'center' }}
          >
            {t('shop.cart.continueShopping')}
          </Button>
        </Stack>
      )}
    </DashboardContent>
  );
}
