import { useTranslation } from 'react-i18next';

import {
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';

import { useDialog } from './store';

export function DialogMessage({ message }: { message: string }) {
  const { t } = useTranslation();
  const { setOpen } = useDialog();
  return (
    <>
      <DialogTitle>{t('dialog.messageTitle')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={() => setOpen(false)}>
          {t('common.close')}
        </Button>
      </DialogActions>
    </>
  );
}
