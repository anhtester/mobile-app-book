import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWatch, Controller } from 'react-hook-form';

import {
  Card,
  Stack,
  Divider,
  Collapse,
  MenuItem,
  TextField,
  CardHeader,
  IconButton,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { control, TypePromotion } from '../hooks/form-control';

/** `originalCode`: mã hiện có khi sửa. Dữ liệu cũ có mã khác 6 ký tự, giữ nguyên thì không bắt lại. */
export function CardDetail({ originalCode }: { originalCode?: string }) {
  const [expen, setExpen] = useState(true);
  const { t, i18n } = useTranslation();
  // Chữ thường + CSS viết hoa từng từ chỉ hợp với tiếng Anh; tiếng Việt đã viết sẵn đúng hoa thường
  const typeTextTransform = i18n.language === 'en' ? 'capitalize' : 'none';
  const [type] = useWatch({
    control,
    name: ['type'],
  });

  return (
    <Card>
      <CardHeader
        title={t('promotion.detail.title')}
        subheader={t('promotion.detail.subheader')}
        action={
          <IconButton id="promotion-form-toggle-detail" onClick={() => setExpen(!expen)}>
            <Iconify
              sx={{ transition: 'all .1s ease-in-out' }}
              style={{ rotate: !expen ? '0deg' : '90deg' }}
              icon="eva:arrow-ios-forward-fill"
            />
          </IconButton>
        }
        sx={{ mb: 3 }}
      />
      <Collapse in={expen}>
        <Divider />
        <Stack spacing={3} p={3}>
          <Controller
            control={control}
            name="name"
            defaultValue=""
            rules={{
              required: t('promotion.detail.nameRequired'),
              maxLength: {
                value: 100,
                message: t('promotion.detail.nameMax'),
              },
            }}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField id="promotion-form-name"
                fullWidth
                label={t('promotion.detail.name')}
                {...field}
                error={invalid}
                helperText={error?.message}
                required
              />
            )}
          />
          <Controller
            name="code"
            control={control}
            defaultValue=""
            rules={{
              required: t('promotion.detail.codeRequired'),
              validate: (value) =>
                (!!originalCode && value === originalCode) ||
                value.trim().length === 6 ||
                t('promotion.detail.codeLength'),
            }}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField id="promotion-form-code"
                sx={{ flex: 1 }}
                label={t('promotion.detail.code')}
                error={invalid}
                helperText={error?.message}
                required
                {...field}
                // Server lưu đúng chuỗi gửi lên, nên chuyển chữ hoa ngay khi nhập (không chỉ hiển thị).
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                slotProps={{ htmlInput: { maxLength: 6, autoCapitalize: 'characters' } }}
              />
            )}
          />
          <Controller
            control={control}
            name="description"
            defaultValue=""
            rules={{
              maxLength: {
                value: 500,
                message: t('promotion.detail.descriptionMax'),
              },
            }}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField id="promotion-form-description"
                multiline
                minRows={5}
                fullWidth
                label={t('promotion.detail.description')}
                {...field}
                error={invalid}
                helperText={error?.message}
              />
            )}
          />
          <Stack gap={2} flexDirection={{ xs: 'column', md: 'row' }}>
            <Controller
              control={control}
              name="type"
              defaultValue="FIXED_AMOUNT"
              rules={{ deps: ['value'] }}
              render={({ field, fieldState: { invalid, error } }) => (
                <TextField id="promotion-form-type"
                  fullWidth
                  sx={{ textTransform: typeTextTransform }}
                  select
                  label={t('promotion.detail.type')}
                  required
                  {...field}
                  error={invalid}
                  helperText={error?.message}
                >
                  {TypePromotion.map((option) => (
                    <MenuItem key={option} value={option} sx={{ textTransform: typeTextTransform }}>
                      {t(`promotion.detail.typeOption.${option}`)}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              control={control}
              name="value"
              rules={{
                validate: (v, values) => {
                  if (values.type === 'FREE_SHIPPING') return true;
                  if (v === undefined || v === null || String(v) === '') return t('promotion.detail.valueRequired');
                  const n = Number(v);
                  if (!Number.isFinite(n) || n <= 0) return t('promotion.detail.valuePositive');
                  if (values.type === 'PERCENTAGE' && n > 100) return t('promotion.detail.valuePercent');
                  return true;
                },
              }}
              render={({ field, fieldState: { invalid, error } }) => (
                <TextField id="promotion-form-value"
                  disabled={type === 'FREE_SHIPPING'}
                  type="number"
                  label={t('promotion.detail.value')}
                  required={type !== 'FREE_SHIPPING'}
                  {...field}
                  error={invalid}
                  helperText={
                    error?.message ??
                    (type === 'PERCENTAGE'
                      ? t('promotion.detail.valuePercentHint')
                      : type === 'FIXED_AMOUNT'
                        ? t('promotion.detail.valueAmountHint')
                        : undefined)
                  }
                  slotProps={{ htmlInput: { min: 0, inputMode: 'decimal' } }}
                />
              )}
            />
          </Stack>
        </Stack>
      </Collapse>
    </Card>
  );
}
