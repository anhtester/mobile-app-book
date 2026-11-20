import { useMemo, useState } from 'react';

import {
  Box,
  Card,
  Link,
  Stack,
  Switch,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { useRequest } from 'src/hooks/use-request';

import { useAuth } from 'src/store/auth';
import { useTranslate } from 'src/locales';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import Title from 'src/components/title';
import { Label } from 'src/components/label';
import { toast } from 'src/components/toast';
import { Iconify } from 'src/components/iconify';
import { PageAction } from 'src/components/page-action';
import { dialog } from 'src/components/dialog-confirm/confirm';
import { PageHeader } from 'src/components/page-header/page-header';
import { NoData } from 'src/components/grid-view/components/not-data';
import { searchInputProps } from 'src/components/fields/search-input-props';

import { Category } from '../book-mgt/api/categorys';
import { slugify } from '../book-mgt/api/create-book';

// ----------------------------------------------------------------------
// Màn Category, theo web (frontend/src/pages/category-mgt/page.tsx; mục 2026-11-20-01 và 2026-11-20-13
// của plans/mobile-sync.md). Web là bảng 4 cột; điện thoại hiện mỗi category một dòng thẻ:
// tên + số sách (bấm mở trang Book đã lọc) | công tắc trạng thái | đổi tên / xoá.
// Locator giữ như web: #btn-new-category (điện thoại là nút nổi FAB), #search-category, #sort-category, #category-summary, [data-category="<tên>"],
// [data-active], #status-<tên>, [data-action="view-books|rename|delete"].
// ----------------------------------------------------------------------

// Cùng giới hạn với ô Category trong form sách (card-property.tsx)
const MAX_LENGTH = 24;

type SortKey = 'name' | 'isActive' | 'bookCount';
type SortValue = `${SortKey}-${'asc' | 'desc'}`;

const SORTS: { value: SortValue; tKey: 'category.columns.name' | 'category.columns.status' | 'category.columns.books'; dir: '↑' | '↓' }[] = [
  { value: 'name-asc', tKey: 'category.columns.name', dir: '↑' },
  { value: 'name-desc', tKey: 'category.columns.name', dir: '↓' },
  { value: 'bookCount-desc', tKey: 'category.columns.books', dir: '↓' },
  { value: 'bookCount-asc', tKey: 'category.columns.books', dir: '↑' },
  { value: 'isActive-desc', tKey: 'category.columns.status', dir: '↓' },
  { value: 'isActive-asc', tKey: 'category.columns.status', dir: '↑' },
];

/** Trang Book lọc theo category qua query `category` (xem book-mgt/stores/filter.ts) */
const bookLink = (name: string) => `/book-management?category=${encodeURIComponent(name)}`;

export default function CategoryMgt() {
  const { auth } = useAuth();
  const { t, lang } = useTranslate();
  // Message lỗi từ backend giữ nguyên (tiếng Anh), chỉ dịch câu dự phòng
  const errorMsg = (err: any) => err?.response?.data?.msg ?? t('common.somethingWrong');
  const { data = [], loading, request, setData } = useRequest(Category.get);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortValue>('name-asc');

  const rows = useMemo(() => {
    const [key, dir] = sort.split('-') as [SortKey, 'asc' | 'desc'];
    const keyword = search.trim().toLowerCase();
    const filtered = keyword ? data.filter((c) => c.name.toLowerCase().includes(keyword)) : data;
    const factor = dir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      if (key === 'name') return a.name.localeCompare(b.name, lang) * factor;
      if (key === 'isActive') return (Number(a.isActive) - Number(b.isActive)) * factor;
      return (a.bookCount - b.bookCount) * factor;
    });
  }, [data, search, sort, lang]);

  const totalBooks = useMemo(() => data.reduce((sum, c) => sum + c.bookCount, 0), [data]);
  const shownBooks = useMemo(() => rows.reduce((sum, c) => sum + c.bookCount, 0), [rows]);

  const nameRules = (current?: string) => ({
    required: t('category.validation.required'),
    maxLength: {
      value: MAX_LENGTH,
      message: t('category.validation.maxLength', { max: MAX_LENGTH }),
    },
    validate: {
      notBlank: (val: string) => val.trim().length > 0 || t('category.validation.required'),
      noSlash: (val: string) => !val.includes('/') || t('category.validation.noSlash'),
      noChange: (val: string) => val.trim() !== current || t('category.validation.noChange'),
      unique: (val: string) =>
        !data.some(
          (c) => c.name !== current && c.name.toLowerCase() === val.trim().toLowerCase()
        ) || t('category.validation.exists'),
    },
  });

  const openCreate = () =>
    dialog.form({
      title: t('category.newCategory'),
      body: {
        name: {
          type: 'text',
          label: t('category.form.name'),
          defaultValue: '',
          rules: nameRules(),
          props: { autoFocus: true, inputProps: { id: 'category-name' } },
        },
      },
      action: {
        children: t('common.actions.create'),
        startIcon: <Iconify icon="mingcute:add-line" />,
        onAction: (d) =>
          Category.create(d.name.trim())
            .then((res) => {
              toast.success(res.data.msg);
              request();
            })
            .catch((err) => {
              toast.error(errorMsg(err));
              throw err;
            }),
      },
    });

  const openRename = (row: Categories) =>
    dialog.form({
      title: t('category.form.renameTitle', { name: row.name }),
      body: {
        name: {
          type: 'text',
          label: t('category.form.newName'),
          defaultValue: row.name,
          rules: nameRules(row.name),
          props: { autoFocus: true, inputProps: { id: 'category-new-name' } },
        },
      },
      action: {
        children: t('common.actions.save'),
        startIcon: <Iconify icon="solar:pen-bold" />,
        onAction: (d) =>
          Category.update(row.name, d.name.trim())
            .then((res) => {
              toast.success(res.data.msg);
              request();
            })
            .catch((err) => {
              toast.error(errorMsg(err));
              throw err;
            }),
      },
    });

  const toggleStatus = (row: Categories) => {
    const isActive = !row.isActive;
    // Đổi ngay trên UI, lỗi thì tải lại danh sách để về trạng thái thật
    setData((list) => list?.map((c) => (c.name === row.name ? { ...c, isActive } : c)));
    Category.setStatus(row.name, isActive)
      .then(() =>
        toast.success(
          t('category.statusChanged', {
            name: row.name,
            status: t(isActive ? 'category.status.active' : 'category.status.inactive'),
          })
        )
      )
      .catch((err) => {
        toast.error(errorMsg(err));
        request();
      });
  };

  const openDelete = (row: Categories) =>
    dialog.delete(
      <>
        {t('category.deleteConfirm', { name: row.name })}
        {row.bookCount > 0 && (
          <>
            <br />
            {t('category.deleteWarning', { count: row.bookCount })}
          </>
        )}
      </>,
      () =>
        Category.delete(row.name)
          .then((res) => {
            toast.success(res.data.msg);
            request();
          })
          .catch((err) => {
            toast.error(errorMsg(err));
          })
    );

  return (
    <DashboardContent>
      <Title>{`${t('category.title')} - ${CONFIG.appName}`}</Title>
      <PageHeader
        icon="solar:widget-4-bold-duotone"
        tone="purple"
        title={t('category.title')}
        subtitle={t('category.subtitle')}
        action={
          auth && (
            <PageAction
              id="btn-new-category"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={openCreate}
            >
              {t('category.newCategory')}
            </PageAction>
          )
        }
      />

      <Stack direction="row" spacing={1.5} sx={{ mb: 1.5 }}>
        <TextField
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('category.searchPlaceholder')}
          sx={{ flex: 1, minWidth: 0 }}
          slotProps={{
            htmlInput: { ...searchInputProps, id: 'search-category' },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          select
          size="small"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortValue)}
          aria-label={t('common.sortBy')}
          slotProps={{ htmlInput: { id: 'sort-category' } }}
          sx={{ width: 132, flexShrink: 0 }}
        >
          {SORTS.map((s) => (
            <MenuItem key={s.value} value={s.value}>
              {t(s.tKey)} {s.dir}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Typography variant="body2" color="text.secondary" id="category-summary" sx={{ mb: 2 }}>
        {search.trim()
          ? t('category.summaryFiltered', {
              shown: rows.length,
              count: data.length,
              links: shownBooks,
              totalLinks: totalBooks,
            })
          : t('category.summary', { count: data.length, links: totalBooks })}
      </Typography>

      <Card id="table-category">
        <Stack divider={<Box sx={{ borderTop: '1px solid var(--at-line)' }} />}>
          {rows.map((row) => (
            <Stack
              key={row.name}
              direction="row"
              alignItems="center"
              spacing={1}
              data-category={row.name}
              data-active={row.isActive}
              sx={{ pl: 2, pr: 1, py: 1.25, minHeight: 64 }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle1"
                  noWrap
                  title={row.name}
                  sx={{ color: row.isActive ? 'text.primary' : 'text.disabled' }}
                >
                  {row.name}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.25 }}>
                  <Link
                    component={RouterLink}
                    href={bookLink(row.name)}
                    data-action="view-books"
                    aria-label={t('category.viewBooks', { count: row.bookCount, name: row.name })}
                    underline="none"
                  >
                    <Label color={row.bookCount ? 'info' : 'default'} sx={{ cursor: 'pointer' }}>
                      {row.bookCount} {t('category.columns.books').toLowerCase()}
                    </Label>
                  </Link>
                  {!auth && (
                    <Label color={row.isActive ? 'success' : 'default'}>
                      {t(row.isActive ? 'category.status.active' : 'category.status.inactive')}
                    </Label>
                  )}
                </Stack>
              </Box>

              {auth && (
                <>
                  <Switch
                    checked={row.isActive}
                    onChange={() => toggleStatus(row)}
                    slotProps={{
                      input: {
                        id: `status-${row.name}`,
                        role: 'switch',
                        'aria-label': t('category.statusToggle', { name: row.name }),
                      },
                    }}
                  />
                  <IconButton id={`category-rename-${slugify(row.name)}`}
                    data-action="rename"
                    aria-label={`${t('common.actions.rename')} ${row.name}`}
                    onClick={() => openRename(row)}
                  >
                    <Iconify icon="solar:pen-bold" />
                  </IconButton>
                  <IconButton id={`category-delete-${slugify(row.name)}`}
                    data-action="delete"
                    aria-label={`${t('common.actions.delete')} ${row.name}`}
                    color="error"
                    onClick={() => openDelete(row)}
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </>
              )}
            </Stack>
          ))}
          {!loading && rows.length === 0 && <NoData sx={{ py: 6 }} />}
        </Stack>
      </Card>
    </DashboardContent>
  );
}
