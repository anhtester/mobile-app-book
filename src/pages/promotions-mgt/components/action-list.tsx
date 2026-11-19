import { Stack, MenuItem } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { dialog } from 'src/components/dialog-confirm/confirm';

import { deletePromotion } from '../api/delete-promotion';

export function ActionList({ row, request }: { row: PromotionType; request: () => Promise<void> }) {
  const router = useRouter();

  return (
    <Stack>
      <MenuItem onClick={() => router.push(`/promotion-book-management/handle?id=${row.id}`)}>
        <Iconify icon="solar:pen-bold" />
        Edit
      </MenuItem>

      <MenuItem
        sx={{ color: 'error.main' }}
        onClick={() =>
          dialog.delete(`Confirm you want to delete promotion "${row.name}".`, async () => {
            if (await deletePromotion(row.id)) await request();
          })
        }
      >
        <Iconify icon="solar:trash-bin-trash-bold" />
        Delete
      </MenuItem>
    </Stack>
  );
}
