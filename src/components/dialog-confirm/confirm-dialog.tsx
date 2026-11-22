import { useState, useEffect } from 'react';

import { Dialog } from '@mui/material';

import { useDialog } from './store';
import { confirmEvent } from './confirm';

import type { DialogProps, ContentConfirm } from './confirm';

export default function ConfigDialog() {
  const [content, setContent] = useState<ContentConfirm>();
  const [config, setConfig] = useState<DialogProps>();
  const { open, setOpen } = useDialog();

  useEffect(() => {
    const handle = (event: CustomEvent<ContentConfirm>) => {
      setContent(event.detail);
      setConfig(event.detail.props);
      setOpen(true);
    };
    confirmEvent.addEventListener('show', handle as any);
    return () => {
      confirmEvent.removeEventListener('show', handle as any);
    };
  }, [setOpen]);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      // Nút Back của Android gửi Escape (use-android-back-button). Bấm ra ngoài vẫn không đóng
      // để không mất dữ liệu đang nhập trong form.
      onClose={(_, reason) => reason === 'escapeKeyDown' && setOpen(false)}
      {...config}
    >
      {content && content.content()}
    </Dialog>
  );
}
