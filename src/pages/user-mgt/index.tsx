import { useTranslation } from 'react-i18next';

import { CONFIG } from 'src/config-global';

import Title from 'src/components/title';

import { ViewUser } from './components/view-user';

export default function UserMgt() {
  const { t } = useTranslation();
  return (
    <>
      <Title>{`${t('user.title')} - ${CONFIG.appName}`}</Title>
      <ViewUser />
    </>
  );
}
