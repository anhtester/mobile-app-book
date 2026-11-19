import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { varAlpha } from 'minimal-shared/utils';

import { Box, Stack, Checkbox, MenuItem, TextField, IconButton, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { NoData } from './not-data';
import { usePopupAction } from '../store/use-popover';

import type { UseTableReturn } from '../hook/use-table';

// ----------------------------------------------------------------------

type TableCardListProps<T> = {
  columns: Columns<T>[];
  config: UseTableReturn<T>;
  data: T[];
  keyName: keyof T;
  renderAction?: ((row: T) => React.ReactNode) | false;
  onClickRow?: (row: T, index: number) => void;
  select?: {
    selected: T[];
    setSelected: (row: T[]) => void;
  };
};

/**
 * Bảng dạng thẻ cho điện thoại (at-table--stack của AT UI kit): mỗi dòng là một thẻ,
 * cột đầu là tiêu đề, các cột còn lại hiện "nhãn: giá trị", nút ⋮ luôn nằm trong màn hình.
 * Sắp xếp dùng ô chọn + nút chiều (thay cho tiêu đề cột bấm được của bảng).
 * Locator test: `data-testid="table-card-<key>"`, nút ⋮ `data-testid="table-card-action-<key>"`.
 */
export function TableCardList<T>({
  columns,
  config,
  data,
  keyName,
  renderAction,
  onClickRow,
  select,
}: TableCardListProps<T>) {
  const { t } = useTranslation();
  const { setAnchorEl, setRow, setOpen } = usePopupAction();
  const [head, ...rest] = columns;

  const sortable = useMemo(() => columns.filter((c) => c.sort), [columns]);

  const selectedKeys = useMemo(
    () => new Set((select?.selected ?? []).map((r) => r[keyName])),
    [keyName, select?.selected]
  );
  const isAllSelected = data.length > 0 && data.every((r) => selectedKeys.has(r[keyName]));
  const isSomeSelected = data.some((r) => selectedKeys.has(r[keyName]));

  const toggleRow = (row: T) => {
    if (!select) return;
    if (selectedKeys.has(row[keyName])) {
      select.setSelected(select.selected.filter((r) => r[keyName] !== row[keyName]));
    } else {
      select.setSelected([...select.selected, row]);
    }
  };

  const toggleAll = () => {
    if (!select) return;
    if (isAllSelected) {
      select.setSelected(select.selected.filter((r) => !data.some((d) => d[keyName] === r[keyName])));
    } else {
      select.setSelected([
        ...select.selected,
        ...data.filter((r) => !selectedKeys.has(r[keyName])),
      ]);
    }
  };

  return (
    <Box>
      {(sortable.length > 0 || select) && (
        <Stack
          direction="row"
          alignItems="center"
          gap={1}
          sx={{ px: 2, py: 1.5, borderTop: (theme) => `1px solid ${theme.vars.palette.divider}` }}
        >
          {select && (
            <Checkbox
              data-testid="table-card-select-all"
              inputProps={{ 'aria-label': t('common.selectAll') }}
              checked={isAllSelected}
              indeterminate={isSomeSelected && !isAllSelected}
              onChange={toggleAll}
              sx={{ ml: -1 }}
            />
          )}
          {sortable.length > 0 && (
            <>
              <TextField
                select
                size="small"
                label={t('common.sortBy')}
                value={(config.order as string) ?? ''}
                onChange={(e) => config.changeSort(e.target.value as keyof T)}
                sx={{ flex: 1, minWidth: 0 }}
                slotProps={{ htmlInput: { 'data-testid': 'table-card-sort' } }}
              >
                {sortable.map((c) => (
                  <MenuItem key={String(c.sort)} value={String(c.sort)}>
                    {c.label}
                  </MenuItem>
                ))}
              </TextField>
              <IconButton
                data-testid="table-card-sort-direction"
                aria-label={config.orderBy === 'desc' ? t('common.descending') : t('common.ascending')}
                disabled={!config.order}
                onClick={() => config.order && config.changeSort(config.order)}
                sx={(theme) => ({
                  border: `1.5px solid ${theme.vars.palette.divider}`,
                  borderRadius: 1.25,
                  width: 40,
                  height: 40,
                })}
              >
                <Iconify
                  icon={config.orderBy === 'desc' ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-upward-fill'}
                />
              </IconButton>
            </>
          )}
        </Stack>
      )}

      {data.length === 0 ? (
        <Box sx={{ p: 2 }}>
          <NoData sx={{ py: 3, height: 'auto' }} />
        </Box>
      ) : (
        data.map((row, index) => {
          const key = String(row[keyName] ?? index);
          const isSelected = selectedKeys.has(row[keyName]);
          return (
            <Box
              key={key}
              data-testid={`table-card-${key}`}
              onClick={() => onClickRow?.(row, index)}
              sx={(theme) => ({
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1,
                px: 2,
                py: 1.75,
                borderTop: `1px solid ${theme.vars.palette.divider}`,
                cursor: onClickRow ? 'pointer' : 'default',
                transition: 'background-color .22s ease, box-shadow .22s ease',
                ...(isSelected && {
                  bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.06),
                  boxShadow: `inset 3px 0 0 ${theme.vars.palette.primary.main}`,
                }),
                '&:active': {
                  bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.06),
                },
              })}
            >
              {select && (
                <Checkbox
                  checked={isSelected}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggleRow(row)}
                  sx={{ ml: -1, mt: -0.5 }}
                />
              )}

              <Box sx={{ flex: 1, minWidth: 0 }}>
                {head && <Box sx={{ minWidth: 0 }}>{head.render(row)}</Box>}

                {rest.length > 0 && (
                  <Box
                    component="dl"
                    sx={{
                      m: 0,
                      mt: 1.25,
                      display: 'grid',
                      gridTemplateColumns: 'minmax(84px, max-content) 1fr',
                      columnGap: 1.5,
                      rowGap: 0.75,
                      alignItems: 'center',
                    }}
                  >
                    {rest.map((column) => (
                      <Box
                        key={column.label}
                        sx={{
                          display: 'contents',
                          // Trường không có giá trị (vd. user chưa có số điện thoại) thì ẩn cả nhãn
                          '&:has(> dd:empty), &:has(> dd > :only-child:empty)': { display: 'none' },
                        }}
                      >
                        <Typography
                          component="dt"
                          variant="overline"
                          sx={{ color: 'text.secondary', lineHeight: 1.4 }}
                        >
                          {column.label}
                        </Typography>
                        <Box
                          component="dd"
                          sx={{ m: 0, minWidth: 0, overflowWrap: 'break-word', typography: 'body2' }}
                        >
                          {column.render(row)}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              {renderAction && (
                <IconButton
                  data-testid={`table-card-action-${key}`}
                  aria-label={t('common.more')}
                  onClick={(e) => {
                    e.stopPropagation();
                    setAnchorEl(e.currentTarget);
                    setRow(row);
                    setOpen(true);
                  }}
                  sx={{ mr: -1, mt: -0.5 }}
                >
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
              )}
            </Box>
          );
        })
      )}
    </Box>
  );
}
