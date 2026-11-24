import type { Control, UseFormSetValue } from 'react-hook-form';

import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useWatch, Controller } from 'react-hook-form';

import {
  Box,
  Stack,
  Select,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  useMediaQuery,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { DatePickerField } from 'src/components/fields/date-picker-field';

import { TypeField, TypeFieldLabel } from '../config-type';

export function TableFilterItemView<T>({
  index,
  fields,
  control,
  remove,
  isOnly,
  setValue,
}: {
  index: number;
  fields: FieldType<T>[];
  control: Control<Fields, any, Fields>;
  remove: (index: number) => void;
  isOnly: boolean;
  setValue: UseFormSetValue<Fields>;
}) {
  const { t } = useTranslation();
  const isPhone = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const size: 'small' | 'medium' = isPhone ? 'small' : 'medium';
  const [key] = useWatch({
    control,
    name: [`fields.${index}.key`],
  });
  const opt = fields.find((f) => f.name === key);
  const { type, options = [] } = opt as FieldType<T>;
  const modeField = (
    <Controller
      control={control}
      name="mode"
      defaultValue="AND"
      render={({ field }) => (
        <Select
          size={size}
          disabled={index > 1}
          {...field}
          sx={{ minWidth: 80, opacity: index > 1 ? 0.4 : 1 }}
        >
          <MenuItem value="AND">{t('components.filter.and')}</MenuItem>
          <MenuItem value="OR">{t('components.filter.or')}</MenuItem>
        </Select>
      )}
    />
  );
  const keyField = (
    <Controller
      control={control}
      name={`fields.${index}.key`}
      defaultValue={fields[0].name as any}
      render={({ field }) => (
        <TextField
          size={size}
          {...field}
          onChange={(e) => {
            field.onChange(e);
            setValue(`fields.${index}.operator`, 'equals');
            setValue(`fields.${index}.value`, '');
          }}
          label={t('components.filter.field')}
          select
          sx={{ maxWidth: { sm: 150 }, minWidth: 0 }}
          fullWidth
        >
          {fields.map((f) => (
            <MenuItem key={f.name as any} value={f.name as any}>
              {f.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
  const operatorField = (
    <Controller
      control={control}
      name={`fields.${index}.operator`}
      render={({ field }) => (
        <TextField
          size={size}
          {...field}
          label={t('components.filter.operator')}
          select
          sx={{ maxWidth: { sm: 150 }, minWidth: 0 }}
          fullWidth
        >
          {TypeField[type ?? 'string']?.map((op) => (
            <MenuItem key={op} value={op}>
              {t(TypeFieldLabel[op as keyof typeof TypeFieldLabel])}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
  const valueField = (
    <>
    {type === 'date' && (
      <Controller
        key={`date-${index}`}
        control={control}
        name={`fields.${index}.value`}
        defaultValue={dayjs()}
        rules={{ required: true }}
        render={({ field, fieldState: { invalid } }) => (
          <DatePickerField
            size={size}
            error={invalid}
            {...field}
            label={t('components.filter.value')}
            value={dayjs.isDayjs(field.value) ? field.value : null}
            fullWidth
            onChange={(v) => field.onChange(v)}
          />
        )}
      />
    )}
    {type === 'enums' && (
      <Controller
        key={`enums-${index}`}
        control={control}
        name={`fields.${index}.value`}
        defaultValue={options[0]}
        rules={{ required: true }}
        render={({ field, fieldState: { invalid } }) => (
          <TextField size={size} {...field} label={t('components.filter.value')} error={invalid} select fullWidth>
            {options.map((o) => (
              <MenuItem key={o} value={o}>
                {o}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    )}
    {type === 'string' && (
      <Controller
        key={`string-${index}`}
        control={control}
        name={`fields.${index}.value`}
        defaultValue=""
        rules={{ required: true }}
        render={({ field, fieldState: { invalid } }) => (
          <TextField
            size={size}
            {...field}
            label={t('components.filter.value')}
            fullWidth
            error={invalid}
          />
        )}
      />
    )}
    {type === 'boolean' && (
      <Controller
        key={`boolean-${index}`}
        control={control}
        name={`fields.${index}.value`}
        defaultValue="_true"
        render={({ field, fieldState: { invalid, error } }) => (
          <TextField
            select
            size={size}
            {...field}
            label={t('components.filter.value')}
            error={invalid}
            fullWidth
            helperText={error?.message}
          >
            <MenuItem value="_true">{t('components.filter.true')}</MenuItem>
            <MenuItem value="_false">{t('components.filter.false')}</MenuItem>
          </TextField>
        )}
      />
    )}
    </>
  );

  // Điện thoại: mỗi điều kiện một khối, [Trường | Phép so sánh] rồi Giá trị cả dòng.
  // Bản hàng ngang (≥600dp) cần ~600px nên trên điện thoại phải cuộn ngang, ô bị cắt hai mép (2026-11-25)
  if (isPhone) {
    return (
      <Box
        data-testid={`table-filter-item-${index}`}
        sx={{
          p: 1.5,
          borderRadius: 1.5,
          bgcolor: 'var(--at-sunken)',
          boxShadow: 'inset 0 0 0 1px var(--at-line)',
          // Ô chọn ngày (MUI X) không lấy nền trắng như ô nhập thường, nằm trên nền khối xám thì lệch màu
          '& .MuiPickersInputBase-root': { bgcolor: 'background.paper' },
        }}
      >
        <Stack direction="row" alignItems="center" sx={{ mb: 1.5, minHeight: 40 }}>
          {index > 0 && !isOnly ? (
            modeField
          ) : (
            <Typography variant="subtitle2" color="text.secondary">
              {t('components.filter.condition', { n: index + 1 })}
            </Typography>
          )}
          <IconButton
            id="remove"
            size="small"
            aria-label={t('components.filter.removeCondition')}
            onClick={() => remove(index)}
            sx={{ ml: 'auto', mr: -0.5 }}
          >
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Stack>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1.5,
            // Ô nửa hàng (~145px): chữ 14 và bớt đệm phải của mũi tên để "Ngày bắt đầu" không bị cắt
            '& .MuiInputBase-root': { fontSize: 14 },
            '& .MuiSelect-select': { pl: 1.5, pr: '28px !important' },
            '& .MuiSelect-icon': { right: 4 },
          }}
        >
          {keyField}
          {operatorField}
          <Box sx={{ gridColumn: '1 / -1', display: 'flex' }}>{valueField}</Box>
        </Box>
      </Box>
    );
  }

  return (
    <Stack direction="row" spacing={2} alignItems="start">
      <IconButton
        id="remove"
        aria-label={t('components.filter.removeCondition')}
        onClick={() => remove(index)}
        sx={{ alignSelf: 'center' }}
      >
        <Iconify icon="mingcute:close-line" />
      </IconButton>
      {!isOnly && (index === 0 ? <Box minWidth={80} /> : modeField)}
      {keyField}
      {operatorField}
      {valueField}
    </Stack>
  );
}
