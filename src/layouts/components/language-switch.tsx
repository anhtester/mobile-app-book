import { useTranslation } from 'react-i18next';

import { Button } from '@mui/material';

import { setLanguage, currentLanguage } from 'src/locales';

// ----------------------------------------------------------------------

/**
 * Nút đổi ngôn ngữ vi ⇄ en trên thanh đầu trang (rule 9).
 * Hiện mã ngôn ngữ đang dùng; bấm là chuyển sang ngôn ngữ còn lại.
 * Locator cố định cho test: `id="language-switch"`, `data-language` = ngôn ngữ hiện tại.
 */
export function LanguageSwitch() {
  const { t } = useTranslation();
  const lang = currentLanguage();
  const next = lang === 'vi' ? 'en' : 'vi';

  return (
    <Button
      id="language-switch"
      data-language={lang}
      size="small"
      variant="outlined"
      color="inherit"
      aria-label={`${t('language.switchTo')}: ${t(`language.${next}`)}`}
      onClick={() => setLanguage(next)}
      sx={{ minWidth: 44, minHeight: 34, px: 1.25, fontWeight: 700, letterSpacing: '.04em' }}
    >
      {lang.toUpperCase()}
    </Button>
  );
}
