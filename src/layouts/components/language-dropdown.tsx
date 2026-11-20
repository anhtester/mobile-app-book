import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, Popover, MenuItem, MenuList } from '@mui/material';

import { LANGUAGES, setLanguage, useLanguage } from 'src/locales';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

/**
 * Dropdown chọn ngôn ngữ vi/en (rule 9), dùng ở header màn đăng nhập/đăng ký.
 * Locator cố định cho test (không dịch):
 * - nút mở: `id="language-dropdown"`, `data-language` = ngôn ngữ đang dùng
 * - menu: `id="language-menu"`, mỗi mục `data-testid="language-option-<vi|en>"`
 */
export function LanguageDropdown() {
  const { t } = useTranslation();
  const lang = useLanguage();
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);

  return (
    <>
      <Button
        id="language-dropdown"
        data-language={lang}
        size="small"
        variant="outlined"
        color="inherit"
        aria-label={`${t('language.label')}: ${t(`language.${lang}`)}`}
        aria-haspopup="menu"
        aria-expanded={!!anchor}
        aria-controls={anchor ? 'language-menu' : undefined}
        onClick={(e) => setAnchor(e.currentTarget)}
        endIcon={<Iconify icon="eva:arrow-ios-downward-fill" width={16} />}
        sx={{
          minWidth: 0,
          minHeight: 36,
          px: 1.25,
          fontWeight: 700,
          letterSpacing: '.04em',
          '& .MuiButton-endIcon': { ml: 0.5 },
        }}
      >
        {lang.toUpperCase()}
      </Button>

      <Popover
        open={!!anchor}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { mt: 0.5 } } }}
      >
        <MenuList id="language-menu" aria-label={t('language.label')} sx={{ p: 0.5, minWidth: 168 }}>
          {LANGUAGES.map((option) => (
            <MenuItem id={`language-option-${option}`}
              key={option}
              data-testid={`language-option-${option}`}
              selected={option === lang}
              onClick={() => {
                setLanguage(option);
                setAnchor(null);
              }}
              sx={{ gap: 1.5, minHeight: 44, borderRadius: 0.75 }}
            >
              {/* Bề rộng cố định để tên ngôn ngữ thẳng cột (EN và VI rộng khác nhau) */}
              <Box component="b" sx={{ width: 24, flexShrink: 0 }}>
                {option.toUpperCase()}
              </Box>
              {t(`language.${option}`)}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </>
  );
}
