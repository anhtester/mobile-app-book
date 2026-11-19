import type { TFunction } from 'i18next';

import dayjs from 'dayjs';

import { Stack, Typography } from '@mui/material';

import { MappingType } from 'src/pages/promotions-mgt/const-type';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { getPromotionStatus, formatPromotionValue, PROMOTION_STATUS_COLOR } from '../utils';

// Nhận `t` của useTranslation(): đổi ngôn ngữ thì `t` đổi, React Compiler mới tính lại nhãn.
// (Gọi i18n.t trong hàm không tham số thì compiler nhớ kết quả lần đầu, nhãn kẹt ngôn ngữ cũ.)
export const columns = (t: TFunction): Columns<PromotionType>[] => [
  {
    label: t('promotion.columns.code'),
    sort: 'code',
    render: (row) => (
      <Typography variant="body2" textTransform="uppercase" fontWeight="bold">
        {row?.code}
      </Typography>
    ),
  },
  {
    label: t('promotion.columns.name'),
    sort: 'name',
    render: ({ name, description }) => (
      <Stack overflow="hidden">
        <Typography variant="body2" noWrap>
          {name}
        </Typography>
        <Typography color="textSecondary" variant="caption">
          {description}
        </Typography>
      </Stack>
    ),
  },
  {
    label: t('promotion.columns.type'),
    sort: 'type',
    render: (row) => (
      <Label
        color={MappingType[row?.type]?.color}
        startIcon={<Iconify icon={MappingType[row?.type]?.icon} />}
        sx={{ mr: 1 }}
      >
        {t(`promotion.type.${row?.type}`)}
      </Label>
    ),
  },
  {
    // 4 trạng thái như bản web: Đã tắt / Sắp chạy / Đang chạy / Hết hạn (xem ../utils.ts)
    label: t('promotion.status.label'),
    sort: 'isActive',
    render: (row) => {
      const status = getPromotionStatus(row);
      return (
        <Label color={PROMOTION_STATUS_COLOR[status]} data-status={status}>
          {t(`promotion.status.${status}`)}
        </Label>
      );
    },
  },
  {
    label: t('promotion.columns.value'),
    sort: 'value',
    render: (row) => (
      <Label data-promotion-value={row?.value} sx={{ textTransform: 'none' }}>
        {formatPromotionValue(t, row)}
      </Label>
    ),
  },
  {
    label: t('promotion.columns.start'),
    sort: 'startDate',
    render: (row) => {
      const day = dayjs(row?.startDate);
      return (
        <Stack>
          <Typography
            color={
              day.isBefore(dayjs()) ? 'primary' : day.isAfter(dayjs()) ? 'error' : 'textSecondary'
            }
            variant="body2"
            noWrap
          >
            {day.format('DD MMM YYYY')}
          </Typography>
          <Typography color="textSecondary" variant="caption">
            {day.format('hh:mm A')}
          </Typography>
        </Stack>
      );
    },
  },
  {
    label: t('promotion.columns.end'),
    sort: 'endDate',
    render: (row) => {
      const day = dayjs(row?.endDate);
      return (
        <Stack>
          <Typography
            color={
              day.isBefore(dayjs()) ? 'error' : day.isAfter(dayjs()) ? 'primary' : 'textSecondary'
            }
            variant="body2"
            noWrap
          >
            {day.format('DD MMM YYYY')}
          </Typography>
          <Typography color="textSecondary" variant="caption">
            {day.format('hh:mm A')}
          </Typography>
        </Stack>
      );
    },
  },
  {
    label: t('promotion.columns.created'),
    sort: 'createdAt',
    render: (row) => {
      const day = dayjs(row?.createdAt);
      return (
        <Stack>
          <Typography variant="body2" noWrap>
            {day.format('DD MMM YYYY')}
          </Typography>
          <Typography color="textSecondary" variant="caption">
            {day.format('hh:mm A')}
          </Typography>
        </Stack>
      );
    },
  },
];

/** Gọi lúc render (không để hằng số cấp module) để nhãn theo ngôn ngữ hiện tại */
export const getFields = (t: TFunction): FieldType<PromotionType>[] => [
  {
    name: 'name',
    label: t('promotion.fields.name'),
    type: 'string',
  },
  {
    name: 'code',
    label: t('promotion.fields.code'),
    type: 'string',
  },
  {
    name: 'type',
    label: t('promotion.fields.type'),
    type: 'enums',
    options: ['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING'],
  },
  {
    name: 'value',
    label: t('promotion.fields.value'),
    type: 'number',
  },
  {
    name: 'startDate',
    label: t('promotion.fields.startDate'),
    type: 'date',
  },
  {
    name: 'endDate',
    label: t('promotion.fields.endDate'),
    type: 'date',
  },
];
