import type { TFunction } from 'i18next';

import dayjs from 'dayjs';

import { Stack, Avatar, Typography } from '@mui/material';

import { formatFilePath } from 'src/utils/format-filepath';

import { Iconify } from 'src/components/iconify';

// Nhận `t` của useTranslation(): đổi ngôn ngữ thì `t` đổi, React Compiler mới tính lại nhãn.
// (Gọi i18n.t trong hàm không tham số thì compiler nhớ kết quả lần đầu, nhãn kẹt ngôn ngữ cũ.)
export const columns = (t: TFunction): Columns<BookView>[] => [
  {
    label: t('promotion.books.columns.name'),
    sort: 'name',
    render: ({ name, picture, description }) => (
      <Stack overflow="hidden" direction="row" gap={2}>
        <Avatar src={picture?.[0] ? formatFilePath(picture[0]) : undefined} variant="rounded">
          <Iconify icon="solar:album-outline" />
        </Avatar>
        <Stack flex={1} overflow="hidden">
          <Typography variant="body2" noWrap>
            {name}
          </Typography>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {description}
          </Typography>
        </Stack>
      </Stack>
    ),
  },
  {
    label: t('promotion.books.columns.price'),
    sort: 'price',
    render: ({ price }) => (
      <Typography variant="body2">
        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
      </Typography>
    ),
  },
  {
    label: t('promotion.books.columns.created'),
    sort: 'createdAt',
    render: ({ createdAt }) => (
      <Stack>
        <Typography variant="body2" noWrap>
          {dayjs(createdAt).format('DD MMM YYYY')}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {dayjs(createdAt).format('hh:mm A')}
        </Typography>
      </Stack>
    ),
  },
];

/** Gọi lúc render (không để hằng số cấp module) để nhãn theo ngôn ngữ hiện tại */
export const getFilter = (t: TFunction): FieldType<BookView>[] => [
  {
    name: 'name',
    type: 'string',
    label: t('promotion.books.fields.name'),
  },
  {
    name: 'description',
    type: 'string',
    label: t('promotion.books.fields.description'),
  },
  {
    name: 'price',
    type: 'number',
    label: t('promotion.books.fields.price'),
  },
  {
    name: 'createdAt',
    type: 'date',
    label: t('promotion.books.fields.created'),
  },
];
