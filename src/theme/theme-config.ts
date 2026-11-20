import type { CommonColors } from '@mui/material/styles';

import type { ThemeCssVariables } from './types';
import type { PaletteColorNoChannels } from './core/palette';

// ----------------------------------------------------------------------

type ThemeConfig = {
  classesPrefix: string;
  cssVariables: ThemeCssVariables;
  fontFamily: Record<'primary' | 'secondary', string>;
  palette: Record<
    'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error',
    PaletteColorNoChannels
  > & {
    common: Pick<CommonColors, 'black' | 'white'>;
    grey: Record<
      '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
      string
    >;
  };
};

export const themeConfig: ThemeConfig = {
  /** **************************************
   * Base
   *************************************** */
  classesPrefix: 'minimal',
  /** **************************************
   * Typography
   *************************************** */
  fontFamily: {
    primary: 'Inter Variable',
    // Font phụ như web (2026-11-21-02): tên sách, tiêu đề lớn, trình đọc thử
    secondary: 'Merriweather Variable',
  },
  /** **************************************
   * Palette
   *************************************** */
  // Bảng màu theo AT UI kit (anhtester_lms: public/build/css/at-ui.css, biến --at-*).
  // main = stop tối của gradient (đủ tương phản chữ trắng), light = stop sáng, lighter = nền nhạt (pill/soft).
  palette: {
    // Xanh lá logo: hành động phụ, lọc, đang chọn (--at-green-1/-2, --at-brand-soft)
    primary: {
      lighter: '#EBF7EA',
      light: '#42BC40',
      main: '#268A24',
      dark: '#1F6E1D',
      darker: '#14501A',
      contrastText: '#FFFFFF',
    },
    // Cam logo: hành động chính, 1 nút/màn (--at-orange-1/-2, --at-orange-bg/-ink)
    secondary: {
      lighter: '#FFEDD5',
      light: '#FB8A2E',
      main: '#E06004',
      dark: '#C2410C',
      darker: '#7C2D12',
      contrastText: '#FFFFFF',
    },
    // Xanh dương: thông tin, xem trước (--at-blue-*)
    info: {
      lighter: '#DBEAFE',
      light: '#3B8FE8',
      main: '#1570CD',
      dark: '#1D4ED8',
      darker: '#1E3A8A',
      contrastText: '#FFFFFF',
    },
    // Xanh lá trạng thái (--at-green-bg/-ink)
    success: {
      lighter: '#DCFCE7',
      light: '#4ADE80',
      main: '#16A34A',
      dark: '#15803D',
      darker: '#14532D',
      contrastText: '#FFFFFF',
    },
    // Hổ phách (--at-amber-*, nút at-btn--amber #FBBF24 → #D97706)
    warning: {
      lighter: '#FEF3C7',
      light: '#FBBF24',
      main: '#D97706',
      dark: '#B45309',
      darker: '#78350F',
      contrastText: '#FFFFFF',
    },
    // Đỏ: xoá, huỷ (--at-red-*)
    error: {
      lighter: '#FEE2E2',
      light: '#F0605D',
      main: '#C9302C',
      dark: '#B91C1C',
      darker: '#7F1D1D',
      contrastText: '#FFFFFF',
    },
    // Thang xám slate: 900 = --at-ink, 500 = --at-muted, 100 = --at-gray-bg
    grey: {
      '50': '#F8FAFC',
      '100': '#F1F5F9',
      '200': '#E5E9F0',
      '300': '#CBD5E1',
      '400': '#94A3B8',
      '500': '#64748B',
      '600': '#475569',
      '700': '#334155',
      '800': '#1E293B',
      '900': '#0F172A',
    },
    common: { black: '#000000', white: '#FFFFFF' },
  },
  /** **************************************
   * Css variables
   *************************************** */
  cssVariables: {
    cssVarPrefix: '',
    colorSchemeSelector: 'data-color-scheme',
  },
};
