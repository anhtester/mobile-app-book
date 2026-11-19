import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWatch, Controller, useFormState } from 'react-hook-form';

import {
  Box,
  Link,
  Stack,
  Button,
  Switch,
  Divider,
  Container,
  Typography,
  Breadcrumbs,
  LinearProgress,
  FormControlLabel,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { useAuthCheck } from 'src/routes/hooks/use-auth-check';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import Title from 'src/components/title';
import { toast } from 'src/components/toast';
import { Iconify } from 'src/components/iconify';
import { dialog } from 'src/components/dialog-confirm/confirm';

import { CardBook } from './components/card-book';
import { CardDetail } from './components/card-detail';
import { CardStatus } from './components/card-status';
import { savePromotion } from './api/create-promotion';
import { getPromotionForm } from './api/get-promotion';
import { deletePromotion } from './api/delete-promotion';
import {
  reset,
  control,
  setFocus,
  handleSubmit,
  emptyPromotion,
  type PromotionForm,
} from './hooks/form-control';

const LIST_URL = '/promotion-book-management';

export default function Handle() {
  const [s] = useSearchParams();
  const id = s.get('id');
  const router = useRouter();
  const [loading, setLoading] = useState(!!id);
  const [initial, setInitial] = useState<PromotionForm>(emptyPromotion);
  const [endDate] = useWatch({ control, name: ['endDate'] });
  const { isSubmitted, isSubmitting, errors, submitCount } = useFormState({ control });
  useAuthCheck();

  // Form là store dùng chung: luôn nạp lại giá trị khi đổi giữa tạo mới / sửa.
  useEffect(() => {
    let alive = true;
    if (!id) {
      const empty = emptyPromotion();
      setInitial(empty);
      reset(empty);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    getPromotionForm(id)
      .then((values) => {
        if (!alive) return;
        setInitial(values);
        reset(values);
      })
      .catch((err) => {
        if (!alive) return;
        toast.error(err?.response?.data?.msg ?? 'Promotion not found');
        router.replace(LIST_URL);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id, router]);

  useEffect(() => {
    if (isSubmitted) {
      const err = Object.keys(errors)[0];
      if (err) {
        setFocus(err as any);
        document
          .querySelector(`[name="${err}"]`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }
    }
  }, [errors, isSubmitted, submitCount]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await savePromotion(values, id);
      reset(emptyPromotion());
      router.back(LIST_URL);
    } catch {
      // toast + lỗi từng ô đã được set trong savePromotion
    }
  });

  const title = id ? 'Modify promotion' : 'Create a new promotion';

  return (
    <DashboardContent>
      <Title>{`${title} - ${CONFIG.appName}`}</Title>
      <Stack spacing={2} mb={5}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link component={RouterLink} href={LIST_URL} color="textPrimary" variant="body2">
            Promotion management
          </Link>
          <Typography variant="body2">{title}</Typography>
        </Breadcrumbs>
      </Stack>
      {loading ? (
        <LinearProgress />
      ) : (
        <Container maxWidth="md">
          <Stack spacing={4} component="form" noValidate onSubmit={onSubmit}>
            <CardDetail originalCode={id ? initial.code : undefined} />
            <CardStatus />
            <CardBook />
            <Box display="flex" flexWrap="wrap" gap={2}>
              {endDate && dayjs(endDate).isAfter(dayjs()) && (
                <Controller
                  control={control}
                  name="isActive"
                  render={({ field }) => (
                    <FormControlLabel
                      checked={!!field.value}
                      onChange={(_, c) => field.onChange(c)}
                      control={<Switch />}
                      label={field.value ? 'Active' : 'Inactive'}
                      sx={{ ml: 2 }}
                    />
                  )}
                />
              )}

              <Button
                sx={{ ml: 'auto' }}
                size="large"
                color="inherit"
                disabled={isSubmitting}
                onClick={() => reset(initial)}
              >
                Reset
              </Button>
              <Button
                size="large"
                loading={isSubmitting}
                variant="contained"
                color="secondary"
                type="submit"
              >
                {id ? 'Save changes' : 'Create promotion'}
              </Button>
            </Box>
            {id && (
              <Stack>
                <Divider sx={{ borderStyle: 'dashed', mb: 2 }} />
                <Typography variant="body2" color="textSecondary" mb={2}>
                  Deleting this promotion removes it from every book it applies to and recalculates
                  their prices.
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ alignSelf: 'end' }}
                  startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                  color="error"
                  onClick={() =>
                    dialog.delete(
                      <>
                        Do you want delete promotion <b>{initial.name}</b>, after delete you
                        can&apos;t undo
                      </>,
                      async () => {
                        if (await deletePromotion(id)) {
                          reset(emptyPromotion());
                          router.replace(LIST_URL);
                        }
                      }
                    )
                  }
                >
                  Delete
                </Button>
              </Stack>
            )}
          </Stack>
        </Container>
      )}
    </DashboardContent>
  );
}
