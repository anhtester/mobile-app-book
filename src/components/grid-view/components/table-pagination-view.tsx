import { useTranslation } from 'react-i18next';

import {
  Box,
  MenuItem,
  TextField,
  Pagination,
  useMediaQuery,
  TablePagination,
} from '@mui/material';

import { useKeepInView } from 'src/hooks/use-keep-in-view';

import type { UseTableReturn } from '../hook/use-table';

// Nhãn aria của nút chuyển trang (MUI mặc định: 'Go to <type> page')
const ARIA_KEYS: Record<string, string> = {
  first: 'components.table.goToFirst',
  last: 'components.table.goToLast',
  next: 'components.table.goToNext',
  previous: 'components.table.goToPrevious',
};

export function TablePaginationView<T>({
  config,
  total,
  rowsPerPageList,
  type = 'table',
  labelRowsPerPage
}: {
  config: UseTableReturn<T>;
  total: number;
  rowsPerPageList?: number[];
  type?: 'table' | 'grid';
  labelRowsPerPage?: string;
}) {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const { t } = useTranslation();
  // Chuyển trang / đổi số dòng: giữ thanh phân trang đứng yên, không để trang bị đẩy lên đầu (giống web 2026-11-21-05)
  const { ref, keep } = useKeepInView<HTMLDivElement>();
  const ariaLabel = (item: string) => (ARIA_KEYS[item] ? t(ARIA_KEYS[item]) : `Go to ${item} page`);

  if (type === 'table') {
    return (
      <TablePagination
        ref={ref}
        component="div"
        size={isMobile ? 'small' : 'medium'}
        count={total}
        color="primary"
        page={config.page - 1}
        onPageChange={(_, page) => {
          keep();
          config.setPage(page + 1);
        }}
        rowsPerPage={config.rowsPerPage}
        onRowsPerPageChange={(e) => {
          keep();
          config.setRowsPerPage(parseInt(e.target.value, 10));
        }}
        labelRowsPerPage={labelRowsPerPage ?? t('common.rowsPerPage')}
        labelDisplayedRows={({ from, to, count }) =>
          t('common.displayedRows', { from, to, count: count === -1 ? to : count })
        }
        getItemAriaLabel={ariaLabel}
        rowsPerPageOptions={rowsPerPageList}
        // Màn hẹp (< 600dp): một hàng "Rows per page · 1–5 of 40 · ‹ ›" dài hơn thẻ nên nút trang sau
        // bị cắt mép phải (lỗi ở form khuyến mãi). Cho thanh tự xuống hàng, căn phải, bớt khoảng cách.
        sx={(theme) => ({
          [theme.breakpoints.down('sm')]: {
            '& .MuiTablePagination-toolbar': {
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
              rowGap: 0.5,
              px: 1,
              py: 0.5,
            },
            '& .MuiTablePagination-spacer': { display: 'none' },
            '& .MuiTablePagination-input': { mr: 1.5, ml: 0.5 },
            '& .MuiTablePagination-actions': { ml: 1 },
          },
        })}
      />
    );
  }

  return (
    <Box
      ref={ref}
      p={1}
      display="flex"
      alignItems="center"
      sx={{
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
      }}
    >
      {rowsPerPageList && <TextField
        select
        size="small"
        color="inherit"
        value={config.rowsPerPage}
        onChange={(e) => {
          keep();
          config.setRowsPerPage(Number(e.target.value));
        }}
      >
        {rowsPerPageList.map((rowsPerPage) => (
          <MenuItem key={rowsPerPage} value={rowsPerPage}>
            {rowsPerPage}
          </MenuItem>
        ))}
      </TextField>}
      <Pagination
        size={isMobile ? 'small' : 'medium'}
        color="primary"
        page={config.page}
        count={Math.ceil(total / config.rowsPerPage)}
        onChange={(_, page) => {
          keep();
          config.setPage(page);
        }}
        getItemAriaLabel={(item, page, selected) => {
          if (item !== 'page') return ariaLabel(item);
          return selected
            ? t('components.table.page', { page: page ?? '' })
            : t('components.table.goToPage', { page: page ?? '' });
        }}
        sx={{ '& ul': { flexWrap: 'nowrap' } }}
      />
    </Box>
  );
}
