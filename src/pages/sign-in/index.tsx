import { useTranslation } from 'react-i18next';

import { CONFIG } from 'src/config-global';

import Title from 'src/components/title';

import { ContentFieldsLogin } from './components/content-fields-login';

export default function SignInPage() {
  const { t } = useTranslation();

  return (
    <>
      <Title>{`${t('auth.signIn.title')} - ${CONFIG.appName}`}</Title>
      <ContentFieldsLogin />
    </>
  );
}
