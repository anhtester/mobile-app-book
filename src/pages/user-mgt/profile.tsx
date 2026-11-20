import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormState } from 'react-hook-form';

import { Box, Card, Link, Button, Typography, Breadcrumbs } from '@mui/material';

import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { axios } from 'src/api/axios';
import { useAuth } from 'src/store/auth';
import { CONFIG } from 'src/config-global';
import { hanldeLogout } from 'src/api/logout';
import { DashboardContent } from 'src/layouts/dashboard';

import Title from 'src/components/title';
import { toast } from 'src/components/toast';
import { Iconify } from 'src/components/iconify';
import { PageHeader } from 'src/components/page-header/page-header';

import { formControl } from './store/form';
import { ContentUser } from './components/content-user';
import { handleUpdateProfileUser } from './api/profile';

export default function Profile() {
  const { auth, setAuth } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const { isDirty, isSubmitSuccessful, isSubmitting } = useFormState({
    control: formControl.control,
  });
  useEffect(() => {
    if (auth) {
      formControl.reset({
        ...auth,
        avatar: {
          path: auth.avatarUrl,
        } as FileItem,
      });
    } else {
      toast.error(t('user.toast.loginFirst'), { id: 'msg' });
      router.push('/sign-in');
    }
  }, [auth, router, t]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      const value = formControl.getValues();
      if (auth?.email !== value.email || value.password) {
        formControl.reset();
        hanldeLogout().then(()=>{
          setAuth(null);
          router.push('/sign-in');
        })
      } else {
        axios.get('/me').then((res) => {
          setAuth(res.data);
          formControl.reset(res.data);
        });
      }
    }
  }, [auth?.email, isSubmitSuccessful, router, setAuth]);

  return (
    <DashboardContent>
      <Title>{`${t('user.profile.pageTitle')} - ${CONFIG.appName}`}</Title>
      <PageHeader icon="solar:user-rounded-bold" tone="blue" title={t('user.profile.title')}>
        <Breadcrumbs sx={{ mt: 0.5 }}>
          <Link component={RouterLink} href="/user-management" color="textPrimary" variant="body2">
            {t('user.breadcrumb.userManagement')}
          </Link>
          <Typography variant="body2">{t('user.profile.breadcrumb')}</Typography>
        </Breadcrumbs>
      </PageHeader>
      <Card sx={{ p: 3, pt: 4, display: 'flex', flexDirection: 'column' }}>
        <ContentUser isActive={false} oldPassword />
        <Box display="flex" justifyContent="end" mt={3} gap={2}>
          <Button id="profile-reset"
            size="large"
            color="inherit"
            disabled={!isDirty}
            onClick={() => formControl.reset()}
          >
            {t('user.profile.reset')}
          </Button>
          <Button id="profile-save"
            size="large"
            color="secondary"
            variant="contained"
            loading={isSubmitting}
            startIcon={<Iconify icon="solar:diskette-bold" />}
            onClick={formControl.handleSubmit(handleUpdateProfileUser)}
            disabled={!isDirty}
          >
            {t('user.profile.save')}
          </Button>
        </Box>
      </Card>
    </DashboardContent>
  );
}
