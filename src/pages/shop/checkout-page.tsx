import type { IconifyName } from 'src/components/iconify';

import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { useMemo, useState, useEffect, useCallback } from 'react';

import {
  Box,
  Card,
  Step,
  Radio,
  Stack,
  Alert,
  Button,
  Stepper,
  StepLabel,
  TextField,
  Typography,
  Autocomplete,
} from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { useRequest } from 'src/hooks/use-request';

import { useCart } from 'src/store/cart';
import { useAuth } from 'src/store/auth';
import { CONFIG } from 'src/config-global';
import { atBg, atInk } from 'src/theme/at-tones';
import { DashboardContent } from 'src/layouts/dashboard';

import Title from 'src/components/title';
import { toast } from 'src/components/toast';
import { Iconify } from 'src/components/iconify';

import { formatVnd } from './utils';
import { EmptyCart } from './cart-page';
import { useQuote } from './hooks/use-quote';
import { CartLines } from './components/cart-lines';
import { OrderSummary } from './components/order-summary';
import { OrderApi, getAddressWards, getAddressProvinces } from './api/order';

import type { Order, PaymentMethod } from './api/order';

// ----------------------------------------------------------------------
// Thanh toán 4 bước, chép từ web (frontend/src/pages/shop/checkout-page.tsx, 2026-11-21) và đổi bố
// cục một cột cho điện thoại: nội dung bước → tóm tắt tiền → hàng nút (Quay lại | Tiếp tục / Đặt hàng).
// Locator giữ như web: checkout-stepper, checkout-step-*, checkout-<field>, checkout-payment-*,
// checkout-next, checkout-back, checkout-place-order, checkout-sign-in, checkout-success...
// ----------------------------------------------------------------------

type AddressForm = {
  recipientName: string;
  phone: string;
  province: string | null;
  ward: string | null;
  street: string;
  note: string;
  paymentMethod: PaymentMethod;
};

/** Cùng luật với backend (order-controller): số di động VN, cho phép khoảng trắng / dấu chấm / gạch. */
const PHONE_RE = /^(0|\+84)(3|5|7|8|9)\d{8}$/;
const normalizePhone = (v: string) => v.replace(/[\s.-]/g, '');

/**
 * Địa chỉ trong hồ sơ lưu dạng "<số nhà>, <phường>, <tỉnh>" nhưng có thể thiếu phần (VD chỉ có tỉnh).
 * Chỉ nhận tỉnh / phường khi đúng tiền tố loại đơn vị hành chính (giống web).
 */
function splitProfileAddress(address?: string | null) {
  const parts = (address ?? '')
    .split(', ')
    .map((p) => p.trim())
    .filter(Boolean);
  const province = /^(Thành phố|Tỉnh) /.test(parts[parts.length - 1] ?? '') ? parts.pop()! : null;
  const ward =
    province && /^(Phường|Xã|Đặc khu) /.test(parts[parts.length - 1] ?? '') ? parts.pop()! : null;
  return { province, ward, street: parts.join(', ') };
}

const STEP_KEYS = ['cart', 'address', 'confirm', 'done'] as const;

const PAYMENTS: { value: PaymentMethod; icon: IconifyName; tone: 'green' | 'blue' }[] = [
  { value: 'COD', icon: 'solar:wallet-money-bold', tone: 'green' },
  { value: 'BANK_TRANSFER', icon: 'solar:card-transfer-bold', tone: 'blue' },
];

const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

export default function CheckoutPage() {
  const { t } = useTranslation();
  const { auth, authChecked } = useAuth();
  const afterOrder = useCart((s) => s.afterOrder);
  const { items, quote, loading } = useQuote();
  const [step, setStepRaw] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState<Order>();
  const [cartError, setCartError] = useState(false);

  const setStep = (s: number) => {
    setStepRaw(s);
    scrollTop();
  };

  const form = useForm<AddressForm>({
    mode: 'onTouched',
    defaultValues: {
      recipientName: '',
      phone: '',
      province: null,
      ward: null,
      street: '',
      note: '',
      paymentMethod: 'COD',
    },
  });
  const { control, handleSubmit, watch, setValue, reset, setError, getValues } = form;
  const province = watch('province');

  // Điền sẵn từ hồ sơ khi đã đăng nhập
  useEffect(() => {
    if (!auth) return;
    const addr = splitProfileAddress(auth.address);
    reset((prev) => ({
      ...prev,
      recipientName: prev.recipientName || auth.name || '',
      phone: prev.phone || auth.phone || '',
      province: prev.province ?? addr.province,
      ward: prev.ward ?? addr.ward,
      street: prev.street || addr.street,
    }));
  }, [auth, reset]);

  const { data: provinces = [] } = useRequest(useCallback(() => getAddressProvinces(), []));
  const { data: wards = [] } = useRequest(
    useCallback(
      () => (province ? getAddressWards(province) : Promise.resolve([] as string[])),
      [province]
    )
  );

  const steps = useMemo(() => STEP_KEYS.map((k) => t(`shop.checkout.steps.${k}`)), [t]);

  const placeOrder = handleSubmit(async (values) => {
    setPlacing(true);
    setCartError(false);
    try {
      const res = await OrderApi.place({
        items: items.map((i) => ({ bookId: i.bookId, quantity: i.quantity })),
        recipientName: values.recipientName.trim(),
        phone: normalizePhone(values.phone),
        province: values.province ?? '',
        ward: values.ward ?? '',
        street: values.street.trim(),
        note: values.note.trim() || null,
        paymentMethod: values.paymentMethod,
      });
      setPlaced(res.order);
      // Server đã bỏ các sách vừa đặt khỏi giỏ (/api/cart); bản sao trên máy bỏ theo (web 2026-11-21-09)
      afterOrder(items.map((i) => i.bookId));
      setStep(3);
    } catch (err: any) {
      const data = err?.response?.data;
      const fields: Record<string, string[]> = data?.fields ?? {};
      if (fields.items) {
        setCartError(true);
        setStep(0);
      }
      (['recipientName', 'phone', 'province', 'ward', 'street', 'note'] as const).forEach((f) => {
        if (fields[f]?.length) setError(f, { message: fields[f].join(' ') });
      });
      if (Object.keys(fields).some((f) => f !== 'items')) setStep(1);
      toast.error(data?.msg ?? t('book.toast.networkError'));
    } finally {
      setPlacing(false);
    }
  });

  const stepper = (active: number, done = false) => (
    <Stepper
      activeStep={active}
      alternativeLabel
      data-testid="checkout-stepper"
      sx={{
        mb: 3,
        mx: -1,
        '& .MuiStepLabel-label': { mt: '6px !important', fontSize: 13, lineHeight: 1.3 },
      }}
    >
      {steps.map((label) => (
        <Step key={label} completed={done || undefined}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );

  // ---------------------------------------------------------------- Hoàn tất
  if (step === 3 && placed) {
    return (
      <DashboardContent>
        <Title>{`${t('shop.success.title')} - ${CONFIG.appName}`}</Title>
        {stepper(3, true)}
        <Card sx={{ p: 3, textAlign: 'center' }} data-testid="checkout-success">
          <Box
            sx={{
              mx: 'auto',
              mb: 2.5,
              width: 80,
              height: 80,
              display: 'grid',
              placeItems: 'center',
              borderRadius: '50%',
              color: '#fff',
              backgroundImage: 'var(--at-grad-green)',
              boxShadow: '0 12px 30px -8px rgba(38,138,36,.55)',
            }}
          >
            <Iconify icon="solar:check-circle-bold" width={48} />
          </Box>
          <Typography variant="h5" component="h1" sx={{ mb: 1 }}>
            {t('shop.success.title')}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2.5 }}>
            {t('shop.success.text', { name: placed.recipientName, code: placed.code })}
          </Typography>
          <Stack
            spacing={1.25}
            sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: 'var(--at-sunken)', textAlign: 'left' }}
          >
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">{t('shop.success.code')}</Typography>
              <Typography
                data-testid="success-order-code"
                sx={{ fontWeight: 800, letterSpacing: '.05em' }}
              >
                {placed.code}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">{t('shop.success.total')}</Typography>
              <Typography
                data-testid="success-order-total"
                sx={{ fontWeight: 800, color: atInk('orange') }}
              >
                {formatVnd(placed.total)}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Typography color="text.secondary">{t('shop.success.payment')}</Typography>
              <Typography sx={{ fontWeight: 600, textAlign: 'right' }}>
                {t(`shop.orders.paymentMethod.${placed.paymentMethod}`)}
              </Typography>
            </Stack>
          </Stack>
          <Stack spacing={1.5}>
            <Button id="success-view-order"
              variant="contained"
              color="primary"
              size="large"
              component={RouterLink}
              href={`/orders/${placed.code}`}
              data-testid="success-view-order"
            >
              {t('shop.success.viewOrder')}
            </Button>
            <Button id="success-continue-shopping"
              variant="outlined"
              color="inherit"
              size="large"
              component={RouterLink}
              href="/book-management"
            >
              {t('shop.success.continueShopping')}
            </Button>
          </Stack>
        </Card>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Title>{`${t('shop.checkout.title')} - ${CONFIG.appName}`}</Title>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        {t('shop.checkout.title')}
      </Typography>

      {stepper(step)}

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <Stack spacing={3}>
          {/* Bước 1: giỏ hàng */}
          {step === 0 && (
            <Card sx={{ px: 2, py: 0.5 }} data-testid="checkout-step-cart">
              {cartError && (
                <Alert severity="error" sx={{ mt: 1.5 }}>
                  {t('shop.checkout.cartChanged')}
                </Alert>
              )}
              <CartLines quote={quote} />
            </Card>
          )}

          {/* Bước 2: địa chỉ + thanh toán */}
          {step === 1 &&
            (!auth ? (
              <Card sx={{ p: 3, textAlign: 'center' }} data-testid="checkout-sign-in">
                <Iconify
                  icon="solar:lock-keyhole-bold"
                  width={44}
                  sx={{ color: 'text.disabled', mb: 1.5 }}
                />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {t('shop.checkout.signInTitle')}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  {t('shop.checkout.signInText')}
                </Typography>
                <Button id="checkout-sign-in"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={!authChecked}
                  component={RouterLink}
                  href="/sign-in?redirect=/checkout"
                >
                  {t('shop.checkout.signIn')}
                </Button>
              </Card>
            ) : (
              <Card sx={{ p: 2 }} data-testid="checkout-step-address">
                <Typography variant="h6" sx={{ mb: 2.5 }}>
                  {t('shop.checkout.steps.address')}
                </Typography>
                <Stack spacing={2.5}>
                  <Controller
                    control={control}
                    name="recipientName"
                    rules={{
                      validate: (v) => !!v.trim() || t('shop.checkout.validation.required'),
                      maxLength: {
                        value: 191,
                        message: t('shop.checkout.validation.maxLength', { max: 191 }),
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        required
                        id="checkout-recipient-name"
                        label={t('shop.checkout.recipientName')}
                        slotProps={{ htmlInput: { 'data-testid': 'checkout-recipient-name' } }}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="phone"
                    rules={{
                      validate: (v) =>
                        !v.trim()
                          ? t('shop.checkout.validation.required')
                          : PHONE_RE.test(normalizePhone(v)) ||
                            t('shop.checkout.validation.phone'),
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        required
                        id="checkout-phone"
                        type="tel"
                        label={t('shop.checkout.phone')}
                        slotProps={{ htmlInput: { 'data-testid': 'checkout-phone' } }}
                        error={!!error}
                        helperText={error?.message ?? t('shop.checkout.phoneHelper')}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="province"
                    rules={{ required: t('shop.checkout.validation.required') }}
                    render={({ field, fieldState: { error } }) => (
                      <Autocomplete
                        id="checkout-province"
                        options={provinces}
                        value={field.value}
                        onChange={(_, v) => {
                          field.onChange(v);
                          setValue('ward', null);
                        }}
                        onBlur={field.onBlur}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            required
                            label={t('shop.checkout.province')}
                            inputProps={{
                              ...params.inputProps,
                              'data-testid': 'checkout-province',
                            }}
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="ward"
                    rules={{ required: t('shop.checkout.validation.required') }}
                    render={({ field, fieldState: { error } }) => (
                      <Autocomplete
                        id="checkout-ward"
                        options={wards}
                        disabled={!province}
                        value={field.value}
                        onChange={(_, v) => field.onChange(v)}
                        onBlur={field.onBlur}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            required
                            label={t('shop.checkout.ward')}
                            inputProps={{
                              ...params.inputProps,
                              'data-testid': 'checkout-ward',
                            }}
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="street"
                    rules={{
                      validate: (v) => !!v.trim() || t('shop.checkout.validation.required'),
                      maxLength: {
                        value: 255,
                        message: t('shop.checkout.validation.maxLength', { max: 255 }),
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        required
                        id="checkout-street"
                        label={t('shop.checkout.street')}
                        slotProps={{ htmlInput: { 'data-testid': 'checkout-street' } }}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="note"
                    rules={{
                      maxLength: {
                        value: 1000,
                        message: t('shop.checkout.validation.maxLength', { max: 1000 }),
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        minRows={2}
                        id="checkout-note"
                        label={t('shop.checkout.note')}
                        slotProps={{ htmlInput: { 'data-testid': 'checkout-note' } }}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Stack>

                <Typography variant="h6" sx={{ mt: 3.5, mb: 2 }}>
                  {t('shop.checkout.payment')}
                </Typography>
                <Controller
                  control={control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <Stack spacing={1.5} role="radiogroup">
                      {PAYMENTS.map((p) => {
                        const active = field.value === p.value;
                        return (
                          <Box
                            key={p.value}
                            component="label"
                            id={`checkout-payment-${p.value}`}
                            data-testid={`checkout-payment-${p.value}`}
                            sx={{
                              p: 1.5,
                              gap: 1.5,
                              display: 'flex',
                              alignItems: 'flex-start',
                              borderRadius: 2,
                              border: '1.5px solid',
                              borderColor: active ? 'primary.light' : 'var(--at-line)',
                              bgcolor: active ? atBg('green') : 'background.paper',
                              boxShadow: active ? '0 0 0 3px rgba(66,188,64,.16)' : 'none',
                              transition: 'all .15s',
                            }}
                          >
                            <Radio
                              checked={active}
                              onChange={() => field.onChange(p.value)}
                              value={p.value}
                              sx={{ p: 0, mt: 0.25 }}
                            />
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                flexShrink: 0,
                                display: 'grid',
                                placeItems: 'center',
                                borderRadius: 1.5,
                                color: atInk(p.tone),
                                bgcolor: atBg(p.tone),
                              }}
                            >
                              <Iconify icon={p.icon} width={22} />
                            </Box>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography sx={{ fontWeight: 700 }}>
                                {p.value === 'COD'
                                  ? t('shop.checkout.cod')
                                  : t('shop.checkout.bank')}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {p.value === 'COD'
                                  ? t('shop.checkout.codHint')
                                  : t('shop.checkout.bankHint')}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Stack>
                  )}
                />
              </Card>
            ))}

          {/* Bước 3: xác nhận */}
          {step === 2 && (
            <Stack spacing={2} data-testid="checkout-step-confirm">
              <Card sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
                  <Iconify
                    icon="solar:map-point-bold"
                    width={22}
                    sx={{ color: atInk('red'), mr: 1 }}
                  />
                  <Typography variant="h6" sx={{ flex: 1 }}>
                    {t('shop.checkout.shipTo')}
                  </Typography>
                  <Button size="small" id="checkout-edit-address" onClick={() => setStep(1)}>
                    {t('shop.checkout.edit')}
                  </Button>
                </Stack>
                <Typography sx={{ fontWeight: 700 }} data-testid="confirm-recipient">
                  {getValues('recipientName')} · {normalizePhone(getValues('phone'))}
                </Typography>
                <Typography color="text.secondary" data-testid="confirm-address">
                  {[getValues('street'), getValues('ward'), getValues('province')]
                    .filter(Boolean)
                    .join(', ')}
                </Typography>
                {getValues('note') && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, fontStyle: 'italic' }}
                  >
                    “{getValues('note')}”
                  </Typography>
                )}
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1.5 }}>
                  <Iconify
                    icon="solar:wallet-money-bold"
                    width={20}
                    sx={{ color: 'text.disabled' }}
                  />
                  <Typography variant="body2" data-testid="confirm-payment">
                    {getValues('paymentMethod') === 'COD'
                      ? t('shop.checkout.cod')
                      : t('shop.checkout.bank')}
                  </Typography>
                </Stack>
              </Card>
              <Card sx={{ px: 2, py: 0.5 }}>
                <Stack direction="row" alignItems="center" sx={{ pt: 1.5 }}>
                  <Typography variant="h6" sx={{ flex: 1 }}>
                    {t('shop.checkout.items')}
                  </Typography>
                  <Button size="small" id="checkout-edit-items" onClick={() => setStep(0)}>
                    {t('shop.checkout.edit')}
                  </Button>
                </Stack>
                <CartLines quote={quote} readOnly />
              </Card>
              <Alert severity="info" icon={<Iconify icon="solar:info-circle-bold" />}>
                {t('shop.checkout.agree')}
              </Alert>
            </Stack>
          )}

          <OrderSummary
            subtotal={quote?.subtotal ?? 0}
            discount={quote?.discount ?? 0}
            shippingFee={quote?.shippingFee ?? 0}
            total={quote?.total ?? 0}
            freeShipThreshold={step === 2 ? undefined : quote?.freeShipThreshold}
            freeShipping={quote?.freeShipping}
            loading={loading}
          />

          {/* Điều hướng giữa các bước */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            {step === 0 ? (
              <Button
                color="inherit"
                id="checkout-back-cart"
                component={RouterLink}
                href="/cart"
                startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
              >
                {t('shop.cart.title')}
              </Button>
            ) : (
              <Button
                color="inherit"
                data-testid="checkout-back"
                id="checkout-back"
                onClick={() => setStep(step - 1)}
                startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
              >
                {t('shop.checkout.back')}
              </Button>
            )}
            <Box sx={{ flex: 1 }} />
            {step === 0 && (
              <Button
                variant="contained"
                color="primary"
                size="large"
                id="checkout-next"
                data-testid="checkout-next"
                disabled={!quote?.canCheckout || loading}
                onClick={() => setStep(1)}
                endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
              >
                {t('shop.checkout.next')}
              </Button>
            )}
            {step === 1 && auth && (
              <Button
                variant="contained"
                color="primary"
                size="large"
                id="checkout-next"
                data-testid="checkout-next"
                onClick={() => form.trigger().then((ok) => ok && setStep(2))}
                endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
              >
                {t('shop.checkout.next')}
              </Button>
            )}
            {step === 2 && (
              <Button
                size="large"
                variant="contained"
                color="secondary"
                id="checkout-place-order"
                data-testid="checkout-place-order"
                disabled={placing || loading || !quote?.canCheckout}
                onClick={placeOrder}
                startIcon={<Iconify icon="solar:bag-check-bold-duotone" />}
              >
                {placing ? t('shop.checkout.placing') : t('shop.checkout.placeOrder')}
              </Button>
            )}
          </Stack>
        </Stack>
      )}
    </DashboardContent>
  );
}
