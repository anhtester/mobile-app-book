import { useTranslation } from 'react-i18next';

import { CONFIG } from 'src/config-global';

import Title from 'src/components/title';

import { BookView } from './page';

export default function BookPage() {
  const { t } = useTranslation();

  return (
    <>
      <Title>{`${t('book.title')} - ${CONFIG.appName}`}</Title>
      <BookView />
    </>
  );
}
