import type { TFn, TKey } from 'src/locales';
import type { RowComponentProps } from 'react-window';

import { create } from 'zustand';
import { List as VirtualList } from 'react-window';
import React, { useRef, useState, useEffect, useDeferredValue } from 'react';

import {
  Box,
  Tab,
  Tabs,
  Stack,
  Button,
  Dialog,
  Divider,
  Collapse,
  TextField,
  IconButton,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';

import { useRequest } from 'src/hooks/use-request';

import { useAuth } from 'src/store/auth';
import { translate, useTranslate } from 'src/locales';

import { Label } from 'src/components/label';
import { toast } from 'src/components/toast';
import { Iconify } from 'src/components/iconify';
import { SearchField } from 'src/components/fields/search-filed';
import { FromToField } from 'src/components/fields/from-to-field';
import { ButtonDelete } from 'src/components/buttons/button-delete';

import { BookSort } from './book-sort';
import { Category } from '../api/categorys';
import { slugify } from '../api/create-book';
import { mappingSort, type ReturnUseFileterBook } from '../stores/filter';

// Giá trị sort (key của mappingSort) đi lên URL nên giữ nguyên, chỉ dịch nhãn hiển thị
const SORT_LABEL: Record<keyof typeof mappingSort, TKey> = {
  Feature: 'book.sort.feature',
  Newest: 'book.sort.newest',
  'Price: Low to High': 'book.sort.priceLowToHigh',
  'Price: High to Low': 'book.sort.priceHighToLow',
};

function formatNumber(t: TFn, from: number | null) {
  if (!from) return t('book.filter.unset');
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(from);
}

const priceOptions = [10_000, 100_000, 1_000_000, 10_000_000];
// Nhận `t` để nhãn đổi theo ngôn ngữ (bẫy React Compiler, xem memory/notes/i18n.md)
function getPriceLabel(t: TFn, price: { from?: number | null; to?: number | null }): string {
  const { from, to } = price;

  if (from != null && to != null)
    return t('book.filter.priceBetween', {
      from: formatNumber(t, from),
      to: formatNumber(t, to),
    });

  if (from != null) return t('book.filter.priceFrom', { from: formatNumber(t, from) });

  if (to != null) return t('book.filter.priceTo', { to: formatNumber(t, to) });

  return t('book.filter.priceNotSpecified');
}

export function FilterBook({
  config,
  listLoading,
}: {
  config: ReturnUseFileterBook;
  /** Danh sách sách đang tải: tải xong mà tab thể loại còn lỗi thì gọi lại */
  listLoading?: boolean;
}) {
  const {
    isFilter,
    setIsFilter,
    setSearchName,
    setCategory,
    setPrice,
    sort,
    setSort,
    searchName,
    price,
    category,
  } = config;

  const { t } = useTranslate();
  const { auth } = useAuth();
  const { setId, id } = useEdit();
  // Category.get là hàm cố định. Từng viết `() => Category.get()`: React Compiler bỏ qua component
  // này thì mỗi lần render gọi /category-book lại ⇒ vòng lặp hàng nghìn request (2026-11-25)
  const { data = [], request, setData, error } = useRequest(Category.get);

  // Lỗi lúc mở trang (backend khởi động, mất mạng) thì hàng tab kẹt ở "All": gọi lại khi danh sách tải xong
  useEffect(() => {
    if (listLoading === false && error) request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listLoading]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const categories = useDeferredValue(data.filter((c) => c.name.includes(search)));
  const selectedTabRef = useRef<HTMLDivElement>(null);

  // Tab category tải sau khi trang mở (vd đi từ link số sách ở trang Category sang),
  // nên tự cuộn tab đang chọn vào tầm nhìn khi danh sách hoặc category đổi
  // (chờ một nhịp: MUI hiện nút cuộn của Tabs sau lần đo đầu nên tự cuộn thiếu)
  useEffect(() => {
    const timer = setTimeout(
      () => selectedTabRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' }),
      300
    );
    return () => clearTimeout(timer);
  }, [data, category]);

  return (
    <>
      <Box
        display="flex"
        justifyContent="end"
        mb={3}
        alignItems="center"
        gap={2}
        flexWrap="wrap-reverse"
      >
        <Button id="book-filter-toggle"
          color="inherit"
          startIcon={<Iconify icon="ic:round-filter-list" />}
          endIcon={
            <Iconify
              icon={isFilter ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            />
          }
          onClick={() => setIsFilter(!isFilter)}
        >
          {t('book.filter.button')}
        </Button>
        <BookSort
          options={(Object.keys(mappingSort) as (keyof typeof mappingSort)[]).map((item) => ({
            value: item,
            label: t(SORT_LABEL[item]),
          }))}
          sortBy={sort}
          onSort={(s) => setSort(s as any)}
        />
      </Box>

      <Collapse in={isFilter}>
        <Box
          ml="auto"
          mb={3}
          gap={2}
          width={1}
          sx={{
            display: 'flex',
            flexDirection: {
              xs: 'column',
              md: 'row-reverse',
            },
          }}
        >
          <Stack flex={1}>
            <SearchField
              color="inherit"
              value={searchName}
              onChange={setSearchName}
              placeholder={t('book.filter.searchPlaceholder')}
              sx={{ maxWidth: 'unset' }}
            />
          </Stack>
          <Stack flex={1}>
            <FromToField value={price} onChange={setPrice} options={priceOptions} />
            <FormHelperText sx={{ textAlign: 'right' }}>{getPriceLabel(t, price)}</FormHelperText>
          </Stack>
        </Box>
      </Collapse>

      <Stack direction="row" alignItems="center">
        <Tabs
          textColor="inherit"
          variant="scrollable"
          scrollButtons="auto"
          indicatorColor="primary"
          // Tab thể loại dạng pill theo AT UI kit: tab đang chọn tô gradient xanh lá
          sx={(theme) => ({
            flex: 1,
            // Thiếu minWidth: 0 thì Tabs không co lại trong hàng flex, tab cuối chui dưới nút ⚙ (mobile 2026-11-21)
            minWidth: 0,
            minHeight: 44,
            ml: -1.5,
            '& .MuiTabs-indicator': { display: 'none' },
            // Đệm cho quầng sáng của tab đang chọn, không bị khung cuộn ngang xén thành khối chữ nhật
            '& .MuiTabs-list': { gap: 1, pt: 0.75, pb: 1.75, px: 1.5 },
            '& .MuiTab-root': {
              minHeight: 38,
              px: 2,
              mr: '0 !important',
              borderRadius: 999,
              fontWeight: 600,
              color: 'text.secondary',
              bgcolor: 'var(--at-sunken)',
              boxShadow: 'inset 0 0 0 1px var(--at-line)',
              transition: 'all .15s',
              '&:hover': { color: 'text.primary' },
              '& .MuiChip-root, & .label': { transition: 'none' },
              // Điện thoại: pill gọn hơn (cao 34, chữ 13) — bản 38/15 chiếm quá nhiều chỗ (2026-11-25)
              [theme.breakpoints.down('sm')]: {
                minHeight: 34,
                minWidth: 0,
                py: 0.5,
                px: 1.5,
                fontSize: theme.typography.pxToRem(13),
                '& span[class*="label"], & .MuiBox-root > span:last-of-type': {
                  height: 20,
                  minWidth: 20,
                  px: 0.75,
                  fontSize: theme.typography.pxToRem(11),
                },
              },
            },
            '& .MuiTab-root.Mui-selected': {
              color: '#fff',
              backgroundImage: 'var(--at-grad-green)',
              boxShadow: 'var(--at-glow-green)',
              '& span[class*="label"], & .MuiBox-root > span:last-of-type': {
                color: 'inherit',
                bgcolor: 'rgba(255,255,255,.22)',
              },
            },
          })}
          // Chưa tải xong / category không tồn tại thì không chọn tab nào (tránh cảnh báo MUI)
          value={!category || data.some((c) => c.name === category) ? category : false}
          onChange={(_, value) => setCategory(value)}
        >
          <Tab id="book-tab-all" value="" label={t('book.filter.all')} />
          {data
            // Ẩn category đã tắt / chưa có sách, trừ category đang chọn (link từ trang Category)
            .filter((c) => (c.bookCount > 0 && c.isActive) || c.name === category)
            .map((item) => (
              <Tab id={`book-tab-${slugify(item.name)}`}
                key={item.name}
                value={item.name}
                ref={item.name === category ? selectedTabRef : undefined}
                label={
                  <Box display="flex" gap={0.5} alignItems="center">
                    {item.name} <Label>{item.bookCount}</Label>
                  </Box>
                }
              />
            ))}
        </Tabs>
        {auth && (
          <IconButton
            id="setting-category"
            aria-label={t('book.category.title')}
            onClick={() => setOpen(true)}
            sx={{ ml: 0.5, flexShrink: 0 }}
          >
            <Iconify icon="solar:settings-bold-duotone" />
          </IconButton>
        )}
      </Stack>

      <Divider sx={{ mt: 1, mb: 2, borderStyle: 'dashed' }} />

      <Dialog
        open={open}
        fullWidth
        maxWidth="xs"
        onClose={(_, reason) => reason === 'escapeKeyDown' && setOpen(false)}
      >
        <DialogTitle>
          {t('book.category.title')} <Label>{data.length}</Label>
        </DialogTitle>
        <DialogContent dividers sx={{ borderStyle: 'dashed none' }}>
          <OutlinedInput
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (id) setId('');
            }}
            fullWidth
            placeholder={t('book.category.addPlaceholder')}
          />
          <Stack sx={{ height: 52 * 6, mt: 1 }}>
            {search && (
              <Box textAlign="center" mt={1}>
                <Button id="book-category-add"
                  onClick={() => {
                    toast.loading(() => Category.create(search), {
                      loading: t('book.category.saving'),
                      success: async (res) => {
                        await request();
                        setSearch('');
                        return res.data.msg;
                      },
                      error: (err) => err?.response?.data?.msg ?? translate('common.somethingWrong'),
                    });
                  }}
                  color="inherit"
                >
                  {t('book.category.addToList', { name: search })}
                </Button>
              </Box>
            )}
            <VirtualList
              className="hidden-scrollbar"
              style={{ scrollSnapType: 'y mandatory' }}
              rowComponent={Row}
              rowCount={categories.length}
              rowHeight={52}
              rowProps={{ list: categories, request, setData }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button id="book-category-dialog-close" color="inherit" onClick={() => setOpen(false)}>
            {t('common.actions.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const useEdit = create<{
  id: string;
  setId: (id: string) => void;
  newName: string;
  setNewName: (name: string) => void;
}>((set) => ({
  id: '',
  setId: (id: string) => set({ id, newName: id }),
  newName: '',
  setNewName: (name: string) => set({ newName: name }),
}));

const saveChange = (name: string, newName: string, success: () => void, error: () => void) =>
  toast.loading(() => Category.update(name, newName), {
    loading: translate('book.category.savingChanges'),
    success: async (res) => {
      success();
      return res.data.msg;
    },
    error: (err) => {
      error();
      return err?.response?.data?.msg ?? translate('common.somethingWrong');
    },
  });

const Row = ({
  list,
  setData,
  index,
  style,
  request,
}: RowComponentProps<{
  list: Categories[];
  setData: React.Dispatch<React.SetStateAction<Categories[] | undefined>>;
  request: () => Promise<void>;
}>) => {
  const { id, setId, newName, setNewName } = useEdit();
  const item = list[index];
  if (!item) return <div />;
  return (
    <Box
      key={item.name}
      style={style}
      sx={{ gap: 1, scrollSnapAlign: 'start', display: 'flex', alignItems: 'center' }}
    >
      {id !== item.name ? (
        <>
          <Typography pl={1.5} noWrap>
            {item.name}
          </Typography>
          <Label sx={{ mr: 'auto' }}>{item.bookCount}</Label>
        </>
      ) : (
        <TextField
          sx={{ flex: 1 }}
          size="small"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          name={`edit-${item.name}`}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              if (newName === item.name) {
                setId('');
                return;
              }
              setData((d) => d?.map((c) => (c.name === item.name ? { ...c, name: newName } : c)));
              saveChange(
                id,
                newName,
                () => setId(''),
                () => request()
              );
            }
          }}
          onBlur={() => {
            if (newName === item.name) {
              setId('');
              return;
            }
            setData((d) => d?.map((c) => (c.name === item.name ? { ...c, name: newName } : c)));
            saveChange(
              id,
              newName,
              () => setId(''),
              () => request()
            );
          }}
        />
      )}

      <Button
        id={`edit-${item.name}`}
        onClick={() => setId(id !== item.name ? item.name : '')}
        color="inherit"
        sx={{ minWidth: 'unset' }}
      >
        <Iconify icon={id !== item.name ? 'solar:pen-bold' : 'mingcute:close-line'} />
      </Button>
      <ButtonDelete
        id={`del-${item.name}`}
        onDelete={() =>
          toast.loading(() => Category.delete(item.name), {
            loading: translate('book.category.deleting'),
            success: async (res) => {
              await request();
              return res.data.msg;
            },
            error: (err) => err?.response?.data?.msg ?? translate('common.somethingWrong'),
          })
        }
      />
    </Box>
  );
};
