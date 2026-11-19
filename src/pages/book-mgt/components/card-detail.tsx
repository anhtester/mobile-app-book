import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWatch, Controller } from 'react-hook-form';

import {
  Box,
  Card,
  Stack,
  Button,
  Divider,
  Collapse,
  Checkbox,
  TextField,
  CardHeader,
  IconButton,
  Typography,
  InputAdornment,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { accepImg, UploadField } from 'src/components/fields/upload-field';

import { slugify } from '../api/create-book';
import { control, setValue } from '../stores/form-add';

export function CardDetail() {
  const { t } = useTranslation();
  const [expen, setExpen] = useState(true);
  const [isChangeSlug, setIsChangeSlug] = useState(false);
  const [bookId] = useWatch({ control, name: ['id'] });
  const [pictureDel = []] = useWatch({ control, name: ['pictureDel', 'picture'] });
  const setPictureDel = (value: FileItem[]) => setValue('pictureDel', value);

  return (
    <Card>
      <CardHeader
        title={t('book.detail.title')}
        subheader={t('book.detail.subheader')}
        action={
          <IconButton onClick={() => setExpen(!expen)}>
            <Iconify
              sx={{ transition: 'all .1s ease-in-out' }}
              style={{ rotate: !expen ? '0deg' : '90deg' }}
              icon="eva:arrow-ios-forward-fill"
            />
          </IconButton>
        }
        sx={{ mb: 3 }}
      />
      <Collapse in={expen}>
        <Divider />
        <Stack spacing={3} p={3}>
          <Controller
            control={control}
            name="name"
            defaultValue=""
            rules={{
              required: t('book.validation.nameRequired'),
              maxLength: {
                value: 100,
                message: t('book.validation.nameMaxLength'),
              },
              deps: ['slug'],
            }}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField
                fullWidth
                label={t('book.detail.name')}
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  // only regenerate slug when the user edits the name
                  if (!isChangeSlug) setValue('slug', slugify(e.target.value || ''));
                }}
                error={invalid}
                helperText={error?.message}
                required
              />
            )}
          />
          <Controller
            name="slug"
            control={control}
            defaultValue=""
            rules={{
              // edit mode: empty slug is not sent, backend keeps the current one
              required: bookId ? false : t('book.validation.slugRequired'),
              maxLength: {
                value: 100,
                message: t('book.validation.slugMaxLength'),
              },
            }}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField
                disabled={!isChangeSlug}
                sx={{ flex: 1 }}
                label={t('book.detail.slug')}
                error={invalid}
                helperText={error?.message}
                {...field}
                required
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          variant="outlined"
                          color="inherit"
                          size="small"
                          onClick={() => setIsChangeSlug(!isChangeSlug)}
                          startIcon={
                            <Checkbox checked={isChangeSlug} color="inherit" sx={{ p: 0 }} />
                          }
                        >
                          {t('book.detail.changeSlug')}
                        </Button>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="description"
            defaultValue=""
            rules={{
              maxLength: {
                value: 500,
                message: t('book.validation.descriptionMaxLength'),
              },
            }}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField
                multiline
                minRows={5}
                fullWidth
                label={t('common.fields.description')}
                {...field}
                error={invalid}
                helperText={error?.message}
              />
            )}
          />
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">
              {t('book.detail.picture')}{' '}
              <Box component="span" sx={{ color: 'primary.main' }}>
                *
              </Box>
            </Typography>
            <Controller
              control={control}
              name="picture"
              defaultValue={[]}
              rules={{
                validate: {
                  maxFileSize: (files) =>
                    files.every((file) => file.size < 1024 * 1024 * 5) ||
                    t('book.validation.fileSize'),
                  maxLength: (files) => files.length <= 30 || t('book.validation.maxFiles'),
                  minLength: (files) => files.length >= 1 || t('book.validation.minFiles'),
                },
              }}
              render={({ field, fieldState: { invalid, error } }) => (
                <>
                  <UploadField
                    viewMode="grid"
                    showMode
                    {...field}
                    delFiles={pictureDel}
                    setDelFiles={setPictureDel}
                    error={invalid}
                    helperText={error?.message}
                    opt={{
                      multiple: true,
                      accept: accepImg,
                    }}
                  />
                  {field.value.length > 0 && (
                    <Button
                      size="small"
                      color="inherit"
                      variant="outlined"
                      sx={{ mt: 1, alignSelf: 'flex-end' }}
                      onClick={() => {
                        // keep old pictures so they are deleted on save
                        const oldPictures = field.value.filter(
                          (f): f is FileItem => !(f instanceof File)
                        );
                        if (oldPictures.length > 0) setPictureDel([...pictureDel, ...oldPictures]);
                        field.onChange([]);
                      }}
                    >
                      {t('book.detail.removeAll')}
                    </Button>
                  )}
                </>
              )}
            />
          </Stack>
        </Stack>
      </Collapse>
    </Card>
  );
}
