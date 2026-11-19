import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';

import { Box, Card, Stack, MenuItem, Typography } from '@mui/material';

import { useDebounce } from 'src/hooks/use-debound';

import { axios } from 'src/api/axios';
import { useAuth } from 'src/store/auth';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { PageAction } from 'src/components/page-action';
import { dialog } from 'src/components/dialog-confirm/confirm';
import { useTable } from 'src/components/grid-view/hook/use-table';
import { TableView } from 'src/components/grid-view/components/table-view';
import { TableFilterView } from 'src/components/grid-view/components/table-filter-view';
import { TablePaginationView } from 'src/components/grid-view/components/table-pagination-view';

import { formControl } from '../store/form';
import { handleDelete } from '../api/delete';
import { columns, fieldOptions } from '../columns';
import { AddUserDialog } from '../add-user-dialog';

export function ViewUser() {
  const config = useTable<User>({
    order: 'updatedAt',
    orderBy: 'desc',
    rowsPerPage: 5,
  });

  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const { auth } = useAuth();
  const { t } = useTranslation();
  const { orderBy, order, page, rowsPerPage, filter, setPage } = config;

  const search = useDebounce(filter, 650);

  const loadUsers = useCallback(
    () =>
      axios
        .get('/user', {
          params: {
            sortBy: orderBy,
            sort: order,
            page,
            limit: rowsPerPage,
            search,
          },
        })
        .then((res) => {
          // Page no longer exists (e.g. deleted the last row of the last page): go back
          if (res.data.list.length === 0 && page > 1) {
            setPage(Math.max(1, res.data.pagination.totalPage));
            return;
          }
          setUsers(res.data.list);
          setTotal(res.data.pagination.total);
        }),
    [orderBy, order, page, rowsPerPage, search, setPage]
  );

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {t('user.title')}
        </Typography>
        {auth && (
          <PageAction
            id="page-action-new-user"
            startIcon={<Iconify icon="solar:user-plus-bold" />}
            onClick={() => {
              formControl.reset({
                id: '',
              });
              dialog.custom(() => <AddUserDialog callback={loadUsers} />, { maxWidth: 'md' });
            }}
          >
            {t('fab.newUser')}
          </PageAction>
        )}
      </Box>
      <Card>
        <TableFilterView
          placeholder={t('user.searchPlaceholder')}
          filter={fieldOptions(t)}
          config={config}
        />
        <TableView
          filter={fieldOptions(t)}
          sticky={{
            isStickyAction: true,
          }}
          columns={columns(t, auth, loadUsers)}
          data={users}
          config={config}
          sx={{
            '& tbody tr td': {
              borderBottomWidth: 1,
              borderBottomColor: 'divider',
              borderBottomStyle: 'dashed',
            },
          }}
          renderAction={
            auth
              ? (row) =>
                  row && (
                    <Stack>
                      <MenuItem
                        disabled={row?.id === auth?.id}
                        onClick={() => {
                          formControl.reset({
                            ...row,
                            avatar: {
                              path: row.avatarUrl,
                            } as FileItem,
                          });
                          dialog.custom(() => <AddUserDialog callback={loadUsers} />, {
                            maxWidth: 'md',
                          });
                        }}
                      >
                        <Iconify icon="solar:pen-bold" />
                        {t('common.actions.edit')}
                      </MenuItem>

                      <MenuItem
                        sx={{ color: 'error.main' }}
                        disabled={row?.id === auth?.id}
                        onClick={() =>
                          dialog.delete(t('user.deleteConfirm', { name: row.name }), async () => {
                            await handleDelete(row.id);
                            loadUsers();
                          })
                        }
                      >
                        <Iconify icon="solar:trash-bin-trash-bold" />
                        {t('common.actions.delete')}
                      </MenuItem>
                    </Stack>
                  )
              : undefined
          }
        />
        <TablePaginationView
          rowsPerPageList={[5, 10, 15, 20, 25, 50, 100]}
          type="grid"
          total={total}
          config={config}
        />
      </Card>
    </DashboardContent>
  );
}
