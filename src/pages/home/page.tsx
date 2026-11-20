import type { IconifyName } from 'src/components/iconify';

import api from 'axios';
import { useTranslation } from 'react-i18next';
import { varAlpha } from 'minimal-shared/utils';
import { useForm, Controller } from 'react-hook-form';

import {
  Box,
  Card,
  Link,
  Grid,
  Stack,
  Badge,
  Slider,
  Avatar,
  Button,
  TextField,
  Typography,
  CardHeader,
  Autocomplete,
} from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { useRequest } from 'src/hooks/use-request';

import { formatFilePath } from 'src/utils/format-filepath';

import { useAuth } from 'src/store/auth';
import { CONFIG } from 'src/config-global';
import { useCartCount } from 'src/store/cart';
import { axios, URLBASE } from 'src/api/axios';
import { DashboardContent } from 'src/layouts/dashboard';

import Title from 'src/components/title';
import { toast } from 'src/components/toast';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

const status = [
  { code: 200, msg: 'OK', color: '#4CAF50' }, // Xanh lá (Thành công)
  { code: 201, msg: 'Created', color: '#4CAF50' },
  { code: 202, msg: 'Accepted', color: '#4CAF50' },
  { code: 203, msg: 'Non-Authoritative Information', color: '#4CAF50' },
  { code: 204, msg: 'No Content', color: '#4CAF50' },
  { code: 205, msg: 'Reset Content', color: '#4CAF50' },
  { code: 206, msg: 'Partial Content', color: '#4CAF50' },
  { code: 207, msg: 'Multi-Status', color: '#4CAF50' },
  { code: 208, msg: 'Already Reported', color: '#4CAF50' },
  { code: 226, msg: 'IM Used', color: '#4CAF50' },

  { code: 300, msg: 'Multiple Choices', color: '#FFCA28' }, // Vàng (Chuyển hướng)
  { code: 301, msg: 'Moved Permanently', color: '#FFCA28' },
  { code: 302, msg: 'Found', color: '#FFCA28' },
  { code: 303, msg: 'See Other', color: '#FFCA28' },
  { code: 304, msg: 'Not Modified', color: '#FFCA28' },
  { code: 305, msg: 'Use Proxy', color: '#FFCA28' },
  { code: 306, msg: '(Unused)', color: '#FFCA28' },
  { code: 307, msg: 'Temporary Redirect', color: '#FFCA28' },
  { code: 308, msg: 'Permanent Redirect', color: '#FFCA28' },

  { code: 400, msg: 'Bad Request', color: '#FF9800' }, // Cam (Lỗi phía máy khách)
  { code: 401, msg: 'Unauthorized', color: '#FF9800' },
  { code: 402, msg: 'Payment Required', color: '#FF9800' },
  { code: 403, msg: 'Forbidden', color: '#FF9800' },
  { code: 404, msg: 'Not Found', color: '#FF9800' },
  { code: 405, msg: 'Method Not Allowed', color: '#FF9800' },
  { code: 406, msg: 'Not Acceptable', color: '#FF9800' },
  { code: 407, msg: 'Proxy Authentication Required', color: '#FF9800' },
  { code: 408, msg: 'Request Timeout', color: '#FF9800' },
  { code: 409, msg: 'Conflict', color: '#FF9800' },
  { code: 410, msg: 'Gone', color: '#FF9800' },
  { code: 411, msg: 'Length Required', color: '#FF9800' },
  { code: 412, msg: 'Precondition Failed', color: '#FF9800' },
  { code: 413, msg: 'Payload Too Large', color: '#FF9800' },
  { code: 414, msg: 'URI Too Long', color: '#FF9800' },
  { code: 415, msg: 'Unsupported Media Type', color: '#FF9800' },
  { code: 416, msg: 'Range Not Satisfiable', color: '#FF9800' },
  { code: 417, msg: 'Expectation Failed', color: '#FF9800' },
  { code: 418, msg: "I'm a Teapot", color: '#FF9800' },
  { code: 421, msg: 'Misdirected Request', color: '#FF9800' },
  { code: 422, msg: 'Unprocessable Entity', color: '#FF9800' },
  { code: 423, msg: 'Locked', color: '#FF9800' },
  { code: 424, msg: 'Failed Dependency', color: '#FF9800' },
  { code: 425, msg: 'Too Early', color: '#FF9800' },
  { code: 426, msg: 'Upgrade Required', color: '#FF9800' },
  { code: 428, msg: 'Precondition Required', color: '#FF9800' },
  { code: 429, msg: 'Too Many Requests', color: '#FF9800' },
  { code: 431, msg: 'Request Header Fields Too Large', color: '#FF9800' },
  { code: 451, msg: 'Unavailable For Legal Reasons', color: '#FF9800' },

  { code: 500, msg: 'Internal Server Error', color: '#F44336' }, // Đỏ đậm (Lỗi phía máy chủ)
  { code: 501, msg: 'Not Implemented', color: '#F44336' },
  { code: 502, msg: 'Bad Gateway', color: '#F44336' },
  { code: 503, msg: 'Service Unavailable', color: '#F44336' },
  { code: 504, msg: 'Gateway Timeout', color: '#F44336' },
  { code: 505, msg: 'HTTP Version Not Supported', color: '#F44336' },
  { code: 506, msg: 'Variant Also Negotiates', color: '#F44336' },
  { code: 507, msg: 'Insufficient Storage', color: '#F44336' },
  { code: 508, msg: 'Loop Detected', color: '#F44336' },
  { code: 510, msg: 'Not Extended', color: '#F44336' },
  { code: 511, msg: 'Network Authentication Required', color: '#F44336' },
];

const Icon: Record<number, IconifyName> = {
  2: 'eva:checkmark-fill',
  3: 'eva:checkmark-fill',
  4: 'mingcute:close-line',
  5: 'mingcute:close-line',
  6: 'solar:clock-circle-outline',
};

type Tone = 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary';

/**
 * Thẻ số liệu (2 cột trên điện thoại). Theo bản web 2026-11-20-15: icon nằm trong ô vuông phía trên
 * tên (không còn icon to `position: absolute` bị cắt mép phải), tên + icon là link sang màn tương ứng
 * (`data-action="open-page"`). `href` bỏ trống thì thẻ không gắn link.
 * Locator: `data-testid="home-stat-<key>"`, số `data-testid="home-stat-<key>-total"`.
 */
const ViewCard = ({
  statKey,
  title,
  total,
  unit,
  icon,
  color,
  href,
}: {
  statKey: string;
  title: string;
  total: number;
  unit: string;
  icon: string;
  color: Tone;
  href?: string;
}) => {
  const { t } = useTranslation();
  const linkProps = href
    ? { component: RouterLink, href, 'data-action': 'open-page' }
    : { component: 'span' as const };
  return (
    <Card
      data-testid={`home-stat-${statKey}`}
      sx={{
        p: 2,
        gap: 1.5,
        height: 1,
        display: 'flex',
        flexDirection: 'column',
        background: (theme) =>
          `linear-gradient(30deg, ${varAlpha(theme.vars.palette[color].mainChannel, 0.16)} 0%, rgba(0, 0, 0, 0) 65%)`,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Link
          {...linkProps}
          aria-label={title}
          sx={{
            width: 44,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1.5,
            bgcolor: (theme) => varAlpha(theme.vars.palette[color].mainChannel, 0.16),
          }}
        >
          <SvgColor
            src={`/assets/icons/navbar/${icon}.svg`}
            sx={{ width: 24, height: 24, color: `${color}.main` }}
          />
        </Link>
        <Typography
          data-testid={`home-stat-${statKey}-total`}
          sx={{ fontSize: 26, fontWeight: 800, lineHeight: 1, color: `${color}.dark` }}
        >
          {total}
        </Typography>
      </Stack>
      <Box sx={{ minWidth: 0 }}>
        <Link
          {...linkProps}
          color={color}
          underline={href ? 'hover' : 'none'}
          sx={{ display: 'inline-block' }}
        >
          <Typography variant="subtitle1" component="h6" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
            {title}
          </Typography>
        </Link>
        <Typography variant="caption" component="p" sx={{ mt: 0.25, color: 'text.secondary' }}>
          {t('home.stats.total', { count: total, unit })}
        </Typography>
      </Box>
    </Card>
  );
};

/** Lối tắt một dòng (Giỏ hàng, Đơn hàng): ô icon + tên + mô tả + mũi tên. */
const Shortcut = ({
  id,
  href,
  icon,
  tone,
  title,
  hint,
  badge,
}: {
  id: string;
  href: string;
  icon: IconifyName;
  tone: 'orange' | 'teal';
  title: string;
  hint: string;
  badge?: number;
}) => (
  <Box
    id={id}
    component={RouterLink}
    href={href}
    sx={{
      p: 2,
      gap: 1.5,
      display: 'flex',
      alignItems: 'center',
      color: 'text.primary',
      textDecoration: 'none',
    }}
  >
    <Badge
      badgeContent={badge}
      max={99}
      sx={{
        '& .MuiBadge-badge': {
          color: '#fff',
          fontWeight: 700,
          backgroundImage: 'var(--at-grad-orange)',
        },
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          display: 'grid',
          placeItems: 'center',
          borderRadius: 1.5,
          bgcolor: `var(--at-${tone}-bg)`,
          color: `var(--at-${tone}-ink)`,
        }}
      >
        <Iconify icon={icon} width={26} />
      </Box>
    </Badge>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
      <Typography variant="body2" color="text.secondary" noWrap>
        {hint}
      </Typography>
    </Box>
    <Iconify icon="eva:arrow-ios-forward-fill" sx={{ color: 'text.disabled' }} />
  </Box>
);

export default function Page() {
  const { t } = useTranslation();
  const { auth } = useAuth();
  const cartCount = useCartCount();
  const form = useForm<{ time: number; code: number }>();

  const { data: totalUser = 0 } = useRequest(
    async () =>
      await axios.get('/user', { params: { limit: 1 } }).then((e) => e.data.pagination.total)
  );

  const { data: totalBook = 0 } = useRequest(
    async () =>
      await axios.get('/book', { params: { limit: 1 } }).then((e) => e.data.pagination.total)
  );

  const { data: totalPromotion = 0 } = useRequest(
    async () =>
      await axios
        .get('/promotion-book', { params: { limit: 1 } })
        .then((e) => e.data.pagination.total)
  );

  const { data: totalCategory = 0 } = useRequest(
    async () => await axios.get('/category-book').then((e) => e.data.pagination.total)
  );

  const handleAction = (item: { code: number; msg: string; time?: number }) => () => {
    toast.loading(
      () =>
        // Dùng axios gốc (không qua interceptor) để test mã 401 không kích hoạt làm mới token
        // rồi đăng xuất người dùng. Phải ghép URLBASE: trên thiết bị, đường dẫn tương đối
        // `/api/status` trỏ vào chính WebView chứ không phải server.
        api.post(`${URLBASE}/api/status`, {
          code: item.code,
          msg: item.msg,
          time: item.time,
        }),
      {
        loading: t('home.testMessage.loading'),
        success: (res) => res.data?.msg ?? `${item.code}`,
        error: (err) => err?.response?.data?.msg ?? err?.message ?? t('common.somethingWrong'),
      }
    );
  };

  return (
    <DashboardContent>
      {/* Không có Title thì tab giữ tiêu đề tiếng Việt cố định của index.html ở cả hai ngôn ngữ */}
      <Title>{`${t('nav.dashboard')} - ${CONFIG.appName}`}</Title>
      <Stack spacing={3}>
        <Card>
          <Box
            component="img"
            alt={t('home.bannerAlt')}
            src="/assets/Free-API-for-Testing.png"
            srcSet="/assets/thumb.webp 1x, /assets/Free-API-for-Testing.png 2x"
            sx={{
              width: 1,
              border: 'none',
              aspectRatio: '1200/628',
              objectFit: 'cover',
              borderRadius: 2,
            }}
          />
        </Card>
        {/* Chào: một hàng gọn (avatar / icon + tên + mô tả) */}
        <Card
          data-testid="home-welcome"
          sx={{
            p: 2,
            gap: 2,
            display: 'flex',
            alignItems: 'center',
            background: (theme) =>
              `linear-gradient(30deg, ${varAlpha(theme.vars.palette.info.mainChannel, 0.1)} 0%, rgba(0, 0, 0, 0) 60%, ${varAlpha(theme.vars.palette.secondary.mainChannel, 0.1)} 100%)`,
          }}
        >
          {auth ? (
            <Avatar
              sx={{ width: 52, height: 52, borderRadius: 1.75, flexShrink: 0 }}
              src={formatFilePath(auth?.avatarUrl)}
            />
          ) : (
            <Box
              sx={{
                width: 52,
                height: 52,
                flexShrink: 0,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 1.75,
                color: 'info.main',
                bgcolor: (theme) => varAlpha(theme.vars.palette.info.mainChannel, 0.16),
              }}
            >
              <Iconify icon="solar:user-plus-bold" width={26} />
            </Box>
          )}
          <Box sx={{ minWidth: 0 }}>
            <Link
              color="info"
              underline={!auth ? 'hover' : 'none'}
              {...(!auth && {
                id: 'home-sign-in',
                component: RouterLink,
                href: '/sign-in',
              })}
            >
              <Typography variant="h6" sx={{ lineHeight: 1.35 }}>
                {auth ? t('home.welcome.title', { name: auth.name }) : t('home.welcome.signIn')}
              </Typography>
            </Link>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
              {auth ? t('home.welcome.descriptionAuth') : t('home.welcome.descriptionGuest')}
            </Typography>
          </Box>
        </Card>

        <Grid container spacing={2} columns={{ xs: 2, md: 4 }}>
          <Grid size={1}>
            <ViewCard
              statKey="user"
              total={totalUser}
              title={t('home.stats.user')}
              unit={t('home.stats.users')}
              icon="ic-user"
              href="/user-management"
              color="info"
            />
          </Grid>
          <Grid size={1}>
            <ViewCard
              statKey="book"
              total={totalBook}
              title={t('home.stats.book')}
              unit={t('home.stats.books')}
              icon="ic-book"
              href="/book-management"
              color="success"
            />
          </Grid>
          <Grid size={1}>
            <ViewCard
              statKey="category"
              total={totalCategory}
              title={t('home.stats.category')}
              unit={t('home.stats.categories')}
              icon="ic-category"
              href="/category-management"
              color="error"
            />
          </Grid>
          <Grid size={1}>
            <ViewCard
              statKey="promotion"
              total={totalPromotion}
              title={t('home.stats.promotion')}
              unit={t('home.stats.promotions')}
              icon="ic-sale"
              href="/promotion-book-management"
              color="warning"
            />
          </Grid>
        </Grid>

        {/* Lối tắt mua sắm (giỏ hàng lưu ở máy, đơn hàng cần đăng nhập) */}
        <Card data-testid="home-shortcuts">
          <Stack divider={<Box sx={{ borderTop: '1px solid var(--at-line)' }} />}>
            <Shortcut
              id="home-shortcut-cart"
              href="/cart"
              icon="solar:cart-large-minimalistic-bold-duotone"
              tone="orange"
              title={t('shop.cart.title')}
              hint={
                cartCount > 0
                  ? t('shop.shortcut.cartHint', { count: cartCount })
                  : t('shop.cart.empty')
              }
              badge={cartCount}
            />
            <Shortcut
              id="home-shortcut-orders"
              href="/orders"
              icon="solar:bill-list-bold-duotone"
              tone="teal"
              title={t('shop.orders.title')}
              hint={t('shop.shortcut.ordersHint')}
            />
          </Stack>
        </Card>

        <Card
          component="form"
          noValidate
          sx={{ overflow: 'visible' }}
          onSubmit={form.handleSubmit((data) =>
            handleAction({
              time: data.time,
              code: Number(data.code),
              msg: status.find((item) => item.code === Number(data.code))?.msg ?? '',
            })()
          )}
        >
          <CardHeader title={t('home.testMessage.title')} />
          <Stack p={3} spacing={3}>
            <Stack direction="row" alignItems="center" gap={2}>
              <Typography sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
                {t('home.testMessage.timeout')}
              </Typography>
              <Controller
                control={form.control}
                name="time"
                defaultValue={1}
                render={({ field }) => (
                  <Slider
                    valueLabelDisplay="auto"
                    sx={{ height: 12 }}
                    min={0}
                    max={10}
                    step={1}
                    {...field}
                  />
                )}
              />
            </Stack>
            <Controller
              control={form.control}
              name="code"
              defaultValue={200}
              // Xoá trống ô thì code thành 0, server trả 500 RangeError. Chặn ngay ở form.
              rules={{ required: t('home.testMessage.statusCodeRequired') }}
              render={({ field, fieldState: { error } }) => (
                <Autocomplete id="home-status-code"
                  options={status}
                  getOptionLabel={(option) => `${option.code} - ${option.msg}`}
                  value={status.find((s) => s.code === field.value) || null}
                  onChange={(_, newValue) => field.onChange(newValue?.code ?? '')}
                  renderOption={({ key, ...props }, option) => (
                    <li key={key} {...props}>
                      <Avatar
                        sx={{ bgcolor: option.color, color: 'white', mr: 1, width: 24, height: 24 }}
                      >
                        <Iconify width={16} icon={Icon[Math.floor(option.code / 100)]} />
                      </Avatar>
                      <strong style={{ marginRight: '0.5rem' }}>{option.code}</strong> {option.msg}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('home.testMessage.statusCode')}
                      variant="outlined"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              )}
            />
            <Button id="home-test-message-submit" type="submit" size="large" variant="contained" color="secondary" sx={{ alignSelf: 'flex-end' }}>
              {t('common.actions.submit')}
            </Button>
          </Stack>
        </Card>
      </Stack>
    </DashboardContent>
  );
}
