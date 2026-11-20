import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useRef, useState, useCallback } from 'react';

import {
  Box,
  Card,
  Chip,
  Stack,
  Avatar,
  Divider,
  Collapse,
  CardHeader,
  IconButton,
} from '@mui/material';

import { useRequest } from 'src/hooks/use-request';
import { useDebounce } from 'src/hooks/use-debound';

import { formatFilePath } from 'src/utils/format-filepath';

import { getBooks } from 'src/pages/book-mgt/api/get-books';

import { Iconify } from 'src/components/iconify';
import { useTable } from 'src/components/grid-view/hook/use-table';
import { TableView } from 'src/components/grid-view/components/table-view';
import { TableFilterView } from 'src/components/grid-view/components/table-filter-view';
import { TablePaginationView } from 'src/components/grid-view/components/table-pagination-view';

import { columns, getFilter } from '../hooks/columns';
import { control, setValue, getValues } from '../hooks/form-control';

export function CardBook() {
  const [expen, setExpen] = useState(true);
  const { t } = useTranslation();
  const filter = getFilter(t);

  const config = useTable<BookView>({
    order: 'createdAt',
    orderBy: 'desc',
    rowsPerPage: 5,
  });
  const flag = useRef<boolean>(false);
  const [selected = []] = useWatch({ control, name: ['books'] });
  const setSelected: React.Dispatch<React.SetStateAction<BookView[]>> = useCallback((v) => {
    if (typeof v === 'function') {
      setValue('books', v(getValues('books') || []));
    } else {
      setValue('books', v);
    }
    flag.current = true;
  }, []);

  const search = useDebounce(config.filter, 500);

  const { data: { list, pagination: { total } } = { list: [], pagination: { total: 0 } } } =
    useRequest(
      useCallback(
        () =>
          getBooks({
            sort: config.order!,
            sortBy: config.orderBy!,
            page: config.page,
            limit: config.rowsPerPage,
            search,
          }),
        [search, config.order, config.orderBy, config.page, config.rowsPerPage]
      )
    );

  return (
    <Card>
      <CardHeader
        title={t('promotion.books.title')}
        subheader={t('promotion.books.subheader')}
        action={
          <IconButton id="promotion-form-toggle-books" onClick={() => setExpen(!expen)}>
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
        <Stack>
          <TableFilterView config={config} filter={filter} />
          <TableView
            filter={filter}
            config={config}
            columns={columns(t)}
            data={list}
            select={{
              selected,
              setSelected,
            }}
          />
          <TablePaginationView
            rowsPerPageList={[5, 10, 15, 20, 25]}
            config={config}
            total={total}
          />

          {selected.length > 0 && <>
            <Divider />
            {/* Sách đã chọn: chip tự xuống hàng, tên dài cắt "…" (giống web 2026-11-21-05).
                Trước đây `flexWrap="unset"` nên chọn nhiều sách là dải chip tràn ngang khỏi màn hình. */}
            <Box
              p={2}
              display="flex"
              flexWrap="wrap"
              gap={1}
              data-testid="selected-books"
              sx={{ maxHeight: 220, overflowY: 'auto' }}
            >
              {selected.map((item) => (
                <Chip
                  title={item.name}
                  sx={{ maxWidth: 1 }}
                  avatar={
                    <Avatar src={item.picture?.[0] ? formatFilePath(item.picture[0]) : undefined}>
                      <Iconify width={0.6} icon="solar:album-outline" />
                    </Avatar>
                  }
                  key={item.id}
                  label={item.name}
                  onDelete={() => setSelected((s) => s.filter((i) => i.id !== item.id))}
                />
              ))}
              {selected.length > 1 && (
                <Chip
                  onClick={() => setSelected([])}
                  variant="outlined"
                  label={t('promotion.books.removeAll', { count: selected.length })}
                  sx={{ fontWeight: 'bold' }}
                />
              )}
            </Box>
          </>}
        </Stack>
      </Collapse>
    </Card>
  );
}
