import { useTranslation } from 'react-i18next';

import { Box, Card, Typography } from '@mui/material';

import { useAuth } from 'src/store/auth';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { PageAction } from 'src/components/page-action';

import FileContentView from './file-content-view';
import { useDialogUpload } from '../store/use-dialog-upload';

export function FilePageView() {
  const { auth } = useAuth();
  const { t } = useTranslation();
  const { setOpen } = useDialogUpload();

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
          File management
        </Typography>
        {auth && (
          <PageAction
            id="page-action-upload-file"
            startIcon={<Iconify icon="solar:cloud-upload-bold" />}
            onClick={() => setOpen(true)}
          >
            {t('fab.uploadFile')}
          </PageAction>
        )}
      </Box>
      <Card>
        <FileContentView root="/" />
      </Card>
    </DashboardContent>
  );
}
