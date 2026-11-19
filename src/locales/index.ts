import 'dayjs/locale/vi';
import 'dayjs/locale/en';

import dayjs from 'dayjs';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from './en';
import { vi } from './vi';

// ----------------------------------------------------------------------
// Đa ngôn ngữ vi/en (rule 9 trong CLAUDE.md).
// - Mọi chữ hiển thị mới dùng `t('...')` từ `useTranslation()`, có đủ bản trong vi.ts và en.ts.
// - Locator cho test (`id`, `name`, `data-testid`) KHÔNG dịch.
// - Mặc định tiếng Anh để test case hiện có (locator theo chữ tiếng Anh) vẫn chạy; người dùng
//   đổi ở nút ngôn ngữ trên thanh đầu trang, lựa chọn được nhớ trong localStorage.
// ----------------------------------------------------------------------

export const LANGUAGES = ['en', 'vi'] as const;
export type Language = (typeof LANGUAGES)[number];

const STORAGE_KEY = 'app-language';
const DEFAULT_LANGUAGE: Language = 'en';

function readStoredLanguage(): Language {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return LANGUAGES.includes(value as Language) ? (value as Language) : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

function applySideEffects(lng: Language) {
  dayjs.locale(lng);
  document.documentElement.lang = lng;
}

const initial = readStoredLanguage();
applySideEffects(initial);

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, vi: { translation: vi } },
  lng: initial,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: [...LANGUAGES],
  interpolation: { escapeValue: false },
  returnNull: false,
});

/** Đổi ngôn ngữ: cập nhật i18next, dayjs, thuộc tính `lang` của trang và nhớ lựa chọn. */
export function setLanguage(lng: Language) {
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    // Không lưu được (chế độ riêng tư...) thì vẫn đổi trong phiên này
  }
  applySideEffects(lng);
  return i18n.changeLanguage(lng);
}

export function currentLanguage(): Language {
  return (LANGUAGES.includes(i18n.language as Language) ? i18n.language : DEFAULT_LANGUAGE) as Language;
}

export default i18n;
