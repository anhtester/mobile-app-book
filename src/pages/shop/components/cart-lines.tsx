import { useTranslation } from 'react-i18next';

import { Box, Stack, Alert, IconButton, Typography } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { atInk } from 'src/theme/at-tones';
import { useCart, CART_MAX_QTY } from 'src/store/cart';

import { toast } from 'src/components/toast';
import { Iconify } from 'src/components/iconify';
import { QuantityInput } from 'src/components/quantity-input/quantity-input';

import { formatVnd } from '../utils';
import { BookCover } from '../../book-mgt/components/book-cover';

import type { Quote, QuoteLine } from '../api/order';

// ----------------------------------------------------------------------

/** Ghép dòng trong giỏ (lưu ở máy) với dòng báo giá của server theo id hoặc slug. */
export function findQuoteLine(
  quote: Quote | undefined,
  bookId: string,
  slug: string
): QuoteLine | undefined {
  return quote?.items.find((l) => l.bookId === bookId || (l.slug && l.slug === slug));
}

type CartLinesProps = {
  quote?: Quote;
  /** Chỉ xem (bước xác nhận): không đổi số lượng / xoá */
  readOnly?: boolean;
};

/**
 * Danh sách sách trong giỏ, bố cục cho màn hẹp: ảnh bìa | tên + đơn giá (+ nút xoá góc phải),
 * hàng dưới là ô số lượng và thành tiền. Locator giống bản web: `cart-line-<slug>`,
 * `cart-qty-<slug>-{decrease,input,increase}`, `cart-remove-<slug>`.
 */
export function CartLines({ quote, readOnly }: CartLinesProps) {
  const { t } = useTranslation();
  const { items, setQuantity, remove } = useCart();

  return (
    <Stack
      divider={<Box sx={{ borderTop: '1px dashed var(--at-line)' }} />}
      data-testid="cart-lines"
    >
      {items.map((item) => {
        const line = findQuoteLine(quote, item.bookId, item.slug);
        const unavailable = line && !line.available;
        return (
          <Stack
            key={item.bookId}
            direction="row"
            spacing={1.5}
            id={`cart-line-${item.slug}`}
            data-testid={`cart-line-${item.slug}`}
            sx={{ py: 2, opacity: unavailable ? 0.75 : 1 }}
          >
            <Box
              component={RouterLink}
              href={`/book-management/detail/${item.slug}`}
              sx={{
                width: readOnly ? 48 : 64,
                alignSelf: 'flex-start',
                flexShrink: 0,
                borderRadius: '2px 6px 6px 2px',
                overflow: 'hidden',
                boxShadow: '2px 4px 10px -2px rgba(15,23,42,.25)',
              }}
            >
              <BookCover
                src={line?.picture ?? item.picture ?? undefined}
                name={line?.name || item.name}
                sx={{ aspectRatio: '2 / 3', p: 0.5, '& > *': { display: 'none' } }}
              />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" alignItems="flex-start" spacing={0.5}>
                <Typography
                  component={RouterLink}
                  href={`/book-management/detail/${item.slug}`}
                  data-testid="cart-line-name"
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    fontWeight: 700,
                    fontSize: 15,
                    lineHeight: 1.4,
                    color: 'text.primary',
                    textDecoration: 'none',
                  }}
                >
                  {line?.name || item.name}
                </Typography>
                {!readOnly && (
                  <IconButton
                    size="small"
                    aria-label={t('shop.cart.remove')}
                    id={`cart-remove-${item.slug}`}
                    data-testid={`cart-remove-${item.slug}`}
                    onClick={() => {
                      remove(item.bookId);
                      toast.info(t('shop.cart.removed', { name: item.name }));
                    }}
                    sx={{ mt: -0.5, mr: -0.5, color: 'text.disabled' }}
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                )}
              </Stack>

              {line?.available && (
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="baseline"
                  flexWrap="wrap"
                  sx={{ mt: 0.5 }}
                >
                  <Typography
                    variant="body2"
                    data-testid="cart-line-unit-price"
                    sx={{ fontWeight: 600 }}
                  >
                    {formatVnd(line.unitPrice)}
                  </Typography>
                  {line.price > line.unitPrice && (
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ textDecoration: 'line-through' }}
                    >
                      {formatVnd(line.price)}
                    </Typography>
                  )}
                  {readOnly && (
                    <Typography variant="body2" color="text.secondary">
                      × {item.quantity}
                    </Typography>
                  )}
                </Stack>
              )}
              {unavailable && (
                <Alert severity="error" sx={{ mt: 1, py: 0 }} data-testid="cart-line-error">
                  {line.error === 'Book not found.'
                    ? t('shop.cart.notFound')
                    : t('shop.cart.unavailable')}
                </Alert>
              )}

              <Stack
                direction="row"
                alignItems="center"
                justifyContent={readOnly ? 'flex-end' : 'space-between'}
                spacing={1}
                sx={{ mt: 1.25 }}
              >
                {!readOnly && (
                  <QuantityInput
                    size="small"
                    value={item.quantity}
                    max={CART_MAX_QTY}
                    disabled={!!unavailable}
                    onChange={(q) => setQuantity(item.bookId, q)}
                    testId={`cart-qty-${item.slug}`}
                  />
                )}
                <Typography
                  data-testid="cart-line-total"
                  sx={{ fontWeight: 800, color: atInk('orange'), textAlign: 'right' }}
                >
                  {line?.available ? formatVnd(line.lineTotal) : '—'}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        );
      })}
    </Stack>
  );
}
