import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';

import { useDialog } from './store';

type DialogConfirm = {
  onConfirm: () => Promise<void>;
  message: string;
};

export function DialogConfirm({ onConfirm, message }: DialogConfirm) {
  const { t } = useTranslation();
  const [isConfirm, setIsConfirm] = useState(false);
  const { setOpen } = useDialog();
  const handleConfirm = async () => {
    try {
      setIsConfirm(true);
      await onConfirm();
    } catch {
      setIsConfirm(false);
    } finally {
      setOpen(false);
    }
  };
  return (
    <>
      <DialogTitle>{t('dialog.confirmTitle')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          id="dialog-confirm-cancel"
          disabled={isConfirm}
          color="inherit"
          onClick={() => setOpen(false)}
        >
          {t('common.cancel')}
        </Button>
        <Button
          id="dialog-confirm-action"
          loading={isConfirm}
          variant="contained"
          onClick={handleConfirm}
        >
          {t('common.confirm')}
        </Button>
      </DialogActions>
    </>
  );
}
