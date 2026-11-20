import 'dayjs/locale/vi';
import 'dayjs/locale/en';

import dayjs from 'dayjs';
import i18n from 'i18next';
import { useMemo, useSyncExternalStore } from 'react';
import { useTranslation, initReactI18next } from 'react-i18next';

import { en } from './en';
import { vi } from './vi';

import type { Leaves } from './types';

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

/** Lắng nghe đổi ngôn ngữ (dùng cho useSyncExternalStore) */
function subscribeLanguage(onChange: () => void) {
  i18n.on('languageChanged', onChange);
  return () => i18n.off('languageChanged', onChange);
}

/**
 * Ngôn ngữ đang dùng, tự render lại khi đổi. Trong component phải dùng hook này thay cho
 * `currentLanguage()`: project bật React Compiler, lời gọi hàm thường không có tham số reactive
 * bị nhớ kết quả lần đầu, nên nút đổi ngôn ngữ từng kẹt (bấm lần hai không chuyển lại).
 */
export function useLanguage(): Language {
  return useSyncExternalStore(subscribeLanguage, currentLanguage);
}

// ----------------------------------------------------------------------
// Lớp tương thích với API i18n của bản web (`useTranslate`, `translate`, `TKey`) để chép file web
// sang gần như nguyên bản (2026-11-21). Bên dưới vẫn là i18next; chuỗi dùng `{{x}}` như mọi khoá khác.
// ----------------------------------------------------------------------

/** Mọi khoá dịch hợp lệ, dạng 'book.title' (TypeScript báo khoá sai) */
export type TKey = Leaves<typeof en>;
export type TParams = Record<string, string | number>;
/** Hàm dịch truyền vào hàm tạo cột / bộ lọc (tránh bẫy React Compiler) */
export type TFn = (key: TKey, params?: TParams) => string;

/** Dịch ngoài component (file api, hàm tiện ích) */
export const translate = (key: TKey, params?: TParams): string => i18n.t(key, params ?? {});

/**
 * Hook dịch giống bản web. `t` đổi danh tính khi đổi ngôn ngữ nên React Compiler không giữ chữ cũ
 * (xem bẫy React Compiler ở memory/notes/i18n.md).
 */
export function useTranslate() {
  const { t } = useTranslation();
  const lang = useLanguage();
  return useMemo(
    () => ({
      lang,
      setLang: setLanguage,
      t: (key: TKey, params?: TParams) => t(key, { ...params, lng: lang }),
    }),
    [lang, t]
  );
}

export default i18n;
