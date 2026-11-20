import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Card,
  Link,
  Stack,
  Alert,
  Button,
  Dialog,
  Skeleton,
  Typography,
  Breadcrumbs,
  DialogTitle,
  DialogActions,
} from '@mui/material';

import { RouterLink } from 'src/routes/components';
import { useAuthCheck } from 'src/routes/hooks/use-auth-check';

import { useRequest } from 'src/hooks/use-request';

import { useAuth } from 'src/store/auth';
import { CONFIG } from 'src/config-global';
import { atInk } from 'src/theme/at-tones';
import { DashboardContent } from 'src/layouts/dashboard';

import Title from 'src/components/title';
import { toast } from 'src/components/toast';
import { Iconify } from 'src/components/iconify';
import { PageHeader } from 'src/components/page-header/page-header';

import { formatVnd } from './utils';
import { OrderApi } from './api/order';
import { OrderSummary } from './components/order-summary';
import { BookCover } from '../book-mgt/components/book-cover';
import { OrderStatusPill } from './components/order-status-pill';

// ----------------------------------------------------------------------

/** Tên sách dài (có cuốn > 100 ký tự) chỉ hiện 2 dòng, cắt "…" */
const CLAMP_2 = {
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
} as const;

/**
 * Chi tiết đơn `/orders/:code` (cần đăng nhập). Đơn PENDING có nút Huỷ đơn + hộp xác nhận.
 * Locator như web: order-detail-code, order-cancel, order-cancel-confirm, order-not-found,
 * order-recipient, order-address, order-payment, order-item-<slug>.
 */
export default function OrderDetailPage() {
  const { t } = useTranslation();
  const { code = '' } = useParams();
  useAuthCheck();
  const { auth } = useAuth();
  const [confirm, setConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const {
    data: order,
    error,
    setData,
  } = useRequest(
    useCallback(() => (auth ? OrderApi.get(code) : Promise.resolve(undefined)), [auth, code])
  );

  const cancel = async () => {
    setCancelling(true);
    try {
      const res = await OrderApi.cancel(code);
      setData(res.order);
      toast.success(t('shop.orders.cancelled'));
      setConfirm(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.msg ?? t('book.toast.networkError'));
    } finally {
      setCancelling(false);
    }
  };

  return (
    <DashboardContent>
      <Title>{`${t('shop.orders.detail')} ${code} - ${CONFIG.appName}`}</Title>
      <PageHeader
        icon="solar:bill-list-bold-duotone"
        tone="teal"
        title={
          <>
            {t('shop.orders.detail')}{' '}
            <Box component="span" data-testid="order-detail-code" sx={{ color: 'primary.main' }}>
              {code}
            </Box>
          </>
        }
      >
        <Breadcrumbs sx={{ mt: 0.5 }}>
          <Link component={RouterLink} href="/orders" id="order-back" color="text.secondary">
            {t('shop.orders.back')}
          </Link>
          <Typography variant="body2">{code}</Typography>
        </Breadcrumbs>
      </PageHeader>

      {error ? (
        <Alert severity="error" data-testid="order-not-found">
          {t('shop.orders.notFound')}
        </Alert>
      ) : !order ? (
        <Skeleton variant="rounded" height={320} />
      ) : (
        <Stack spacing={2.5}>
          <Card sx={{ p: 2 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
              <OrderStatusPill status={order.status} />
              <Typography variant="body2" color="text.secondary">
                {t('shop.orders.placedAt', {
                  date: dayjs(order.createdAt).format('DD/MM/YYYY HH:mm'),
                })}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="flex-start" spacing={1.5} sx={{ mt: 2 }}>
              <Iconify
                icon="solar:map-point-bold"
                width={22}
                sx={{ color: atInk('red'), mt: 0.25, flexShrink: 0 }}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700 }} data-testid="order-recipient">
                  {order.recipientName} · {order.phone}
                </Typography>
                <Typography color="text.secondary" data-testid="order-address">
                  {[order.street, order.ward, order.province].join(', ')}
                </Typography>
                {order.note && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontStyle: 'italic', mt: 0.5 }}
                  >
                    “{order.note}”
                  </Typography>
                )}
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 1.5 }}>
              <Iconify icon="solar:wallet-money-bold" width={22} sx={{ color: atInk('green') }} />
              <Typography data-testid="order-payment">
                {t(`shop.orders.paymentMethod.${order.paymentMethod}`)}
              </Typography>
            </Stack>
          </Card>

          <Card sx={{ px: 2, py: 0.5 }}>
            <Stack divider={<Box sx={{ borderTop: '1px dashed var(--at-line)' }} />}>
              {order.items.map((item) => (
                <Stack
                  key={item.id}
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ py: 1.5 }}
                  data-testid={`order-item-${item.slug}`}
                >
                  <Box
                    sx={{
                      width: 48,
                      flexShrink: 0,
                      borderRadius: '2px 6px 6px 2px',
                      overflow: 'hidden',
                      boxShadow: '2px 4px 10px -2px rgba(15,23,42,.25)',
                    }}
                  >
                    <BookCover
                      src={item.picture ?? undefined}
                      name={item.name}
                      sx={{ aspectRatio: '2 / 3', p: 0, '& > *': { display: 'none' } }}
                    />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    {item.bookId ? (
                      <Link
                        component={RouterLink}
                        href={`/book-management/detail/${item.slug}`}
                        color="text.primary"
                        title={item.name}
                        sx={{ fontWeight: 700, ...CLAMP_2 }}
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <Typography title={item.name} sx={{ fontWeight: 700, ...CLAMP_2 }}>
                        {item.name}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      {formatVnd(item.unitPrice)} × {item.quantity}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 800, color: atInk('orange') }}>
                    {formatVnd(item.lineTotal)}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Card>

          <OrderSummary
            subtotal={order.subtotal}
            discount={order.discount}
            shippingFee={order.shippingFee}
            total={order.total}
          />

          {order.status === 'PENDING' && (
            <Button
              fullWidth
              size="large"
              color="error"
              variant="outlined"
              id="order-cancel"
              data-testid="order-cancel"
              startIcon={<Iconify icon="solar:close-circle-bold" />}
              onClick={() => setConfirm(true)}
            >
              {t('shop.orders.cancel')}
            </Button>
          )}
        </Stack>
      )}

      <Dialog open={confirm} onClose={() => setConfirm(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{t('shop.orders.cancelConfirm', { code })}</DialogTitle>
        <DialogActions>
          <Button
            variant="outlined"
            color="inherit"
            id="order-cancel-keep"
            onClick={() => setConfirm(false)}
          >
            {t('shop.orders.keep')}
          </Button>
          <Button
            variant="contained"
            color="error"
            id="order-cancel-confirm"
            data-testid="order-cancel-confirm"
            disabled={cancelling}
            onClick={cancel}
          >
            {t('shop.orders.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
