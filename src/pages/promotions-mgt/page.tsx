import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Card, Typography } from '@mui/material';

import { useRequest } from 'src/hooks/use-request';
import { useDebounce } from 'src/hooks/use-debound';

import { useAuth } from 'src/store/auth';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import Title from 'src/components/title';
import { Iconify } from 'src/components/iconify';
import { PageAction } from 'src/components/page-action';
import { useTable } from 'src/components/grid-view/hook/use-table';
import { TableView } from 'src/components/grid-view/components/table-view';
import { TableFilterView } from 'src/components/grid-view/components/table-filter-view';
import { TablePaginationView } from 'src/components/grid-view/components/table-pagination-view';

import { getPromotion } from './api/get-promotion';
import { ActionList } from './components/action-list';
import { fields, columns } from './hooks/columns-main';

export default function Page() {
  const { auth } = useAuth();
  const { t } = useTranslation();

  const config = useTable<PromotionType>({
    order: 'createdAt',
    orderBy: 'desc',
    rowsPerPage: 5,
  });

  const filter = useDebounce(config.filter, 500);

  const {
    data: { list, pagination: { total } } = {
      list: [],
      pagination: { total: 0 },
    },
    request,
  } = useRequest(
    useCallback(
      () =>
        getPromotion({
          limit: config.rowsPerPage,
          page: config.page,
          search: filter,
          sortBy: config.orderBy,
          sort: config.order,
        }),
      [config.order, config.orderBy, config.page, config.rowsPerPage, filter]
    )
  );

  return (
    <DashboardContent>
      <Title>Promotion Management - {CONFIG.appName}</Title>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Promotion Management
        </Typography>
        {auth && (
          <PageAction
            id="page-action-new-promotion"
            startIcon={<Iconify icon="mingcute:add-line" />}
            href="/promotion-book-management/handle?name=create-new-promotion"
          >
            {t('fab.newPromotion')}
          </PageAction>
        )}
      </Box>
      <Card>
        <TableFilterView config={config} filter={fields} />
        <TableView
          config={config}
          columns={columns()}
          data={list}
          filter={fields}
          keyName="id"
          renderAction={
            auth ? (row) => row && <ActionList request={request} row={row} /> : undefined
          }
        />
        <TablePaginationView total={total} config={config} rowsPerPageList={[5, 10, 15, 20, 25]} />
      </Card>
    </DashboardContent>
  );
}
