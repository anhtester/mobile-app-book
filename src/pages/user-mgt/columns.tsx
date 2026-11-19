import type { TFunction } from 'i18next';

import dayjs from 'dayjs';

import { Stack, Badge, Avatar, Typography } from '@mui/material';

import { formatFilePath } from 'src/utils/format-filepath';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// Nhận `t` của useTranslation(): đổi ngôn ngữ thì `t` đổi, React Compiler mới tính lại nhãn.
// (Gọi i18n.t trong hàm không tham số thì compiler nhớ kết quả lần đầu, nhãn kẹt ngôn ngữ cũ.)
export const columns: (
  t: TFunction,
  user: User | null,
  reload: () => void
) => Columns<User>[] = (
  t,
  user,
  reload
) => [
  {
    label: t('common.fields.name'),
    sort: 'name',
    render: ({ avatarUrl, name, email, isActive, id }) => (
      <Stack direction="row" spacing={1}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <Avatar
              sx={{
                width: 18,
                height: 18,
                bgcolor: isActive ? 'success.main' : 'error.main',
                boxShadow: (theme) => theme.customShadows.z8,
              }}
            >
              <Iconify
                width={0.6}
                icon={!isActive ? 'solar:lock-keyhole-bold' : 'solar:lock-keyhole-unlocked-bold'}
              />
            </Avatar>
          }
        >
          <Avatar src={formatFilePath(avatarUrl)} />
        </Badge>
        <Stack flex={1} overflow="hidden">
          <Typography variant="subtitle2" noWrap>
            {name} {id === user?.id && <Label>{t('user.you')}</Label>}
          </Typography>
          <Typography noWrap color="textSecondary" variant="caption">
            {email}
          </Typography>
        </Stack>
      </Stack>
    ),
  },
  {
    label: t('common.fields.phone'),
    sort: 'phone',
    render: (row) => <Typography variant="body2">{row.phone}</Typography>,
  },
  {
    label: t('common.fields.address'),
    sort: 'address',
    render: (row) => <Typography variant="body2">{row.address}</Typography>,
  },
  {
    label: t('user.columns.active'),
    sort: 'isActive',
    render: (row) =>
      row.isActive ? (
        <Label color="success">{t('user.status.active')}</Label>
      ) : (
        <Label color="error">{t('user.status.inactive')}</Label>
      ),
  },
  {
    label: t('common.fields.createdAt'),
    sort: 'createdAt',
    render: (row) => (
      <Stack>
        <Typography noWrap>{dayjs(row.createdAt).format('DD MMM YYYY')}</Typography>
        <Typography color="textSecondary" variant="caption">
          {dayjs(row.createdAt).format('hh:mm A')}
        </Typography>
      </Stack>
    ),
  },
  {
    label: t('common.fields.updatedAt'),
    sort: 'updatedAt',
    render: (row) => (
      <Stack>
        <Typography noWrap>{dayjs(row.updatedAt).format('DD MMM YYYY')}</Typography>
        <Typography color="textSecondary" variant="caption">
          {dayjs(row.updatedAt).format('hh:mm A')}
        </Typography>
      </Stack>
    ),
  },
];
/** Hàm, không phải hằng số: gọi lúc render để nhãn theo ngôn ngữ hiện tại. */
export const fieldOptions = (t: TFunction): FieldType<User>[] => [
  {
    name: 'name',
    label: t('common.fields.name'),
    type: 'string',
  },
  {
    name: 'email',
    label: t('common.fields.email'),
    type: 'string',
  },
  {
    name: 'phone',
    label: t('common.fields.phone'),
    type: 'string',
  },
  {
    name: 'address',
    label: t('common.fields.address'),
    type: 'string',
  },
  {
    name: 'isActive',
    label: t('user.filter.isActive'),
    type: 'boolean',
  },
  {
    name: 'createdAt',
    label: t('user.filter.createdAt'),
    type: 'date',
  },
  {
    name: 'updatedAt',
    label: t('user.filter.updatedAt'),
    type: 'date',
  },
];
