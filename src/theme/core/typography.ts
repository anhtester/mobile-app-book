import type { CSSObject, Breakpoint, TypographyVariantsOptions } from '@mui/material/styles';

import { pxToRem, setFont } from 'minimal-shared/utils';

import { createTheme as getTheme } from '@mui/material/styles';

import { themeConfig } from '../theme-config';

// ----------------------------------------------------------------------

/**
 * TypeScript (type definition and extension)
 * @to {@link file://./../extend-theme-types.d.ts}
 */
export type FontStyleExtend = {
  fontWeightSemiBold: CSSObject['fontWeight'];
  fontSecondaryFamily: CSSObject['fontFamily'];
};

export type ResponsiveFontSizesInput = Partial<Record<Breakpoint, number>>;
export type ResponsiveFontSizesResult = Record<string, { fontSize: string }>;

const defaultMuiTheme = getTheme();

function responsiveFontSizes(obj: ResponsiveFontSizesInput): ResponsiveFontSizesResult {
  const breakpoints: Breakpoint[] = defaultMuiTheme.breakpoints.keys;

  return breakpoints.reduce((acc, breakpoint) => {
    const value = obj[breakpoint];

    if (value !== undefined && value >= 0) {
      acc[defaultMuiTheme.breakpoints.up(breakpoint)] = {
        fontSize: pxToRem(value),
      };
    }

    return acc;
  }, {} as ResponsiveFontSizesResult);
}

// ----------------------------------------------------------------------

const primaryFont = setFont(themeConfig.fontFamily.primary);
const secondaryFont = setFont(themeConfig.fontFamily.secondary);

// Thang chữ theo AT UI kit (anhtester_lms at-ui.css), nâng ~1px cho màn điện thoại (2026-11-21:
// thang cũ 15/14/12.5 đo trên emulator đọc bị nhỏ). Tiêu đề trang 22/800, tiêu đề khối 18/700,
// tiêu đề dòng 16/600, nội dung 16/15, phụ 13.5, nút 15/600, nhãn in hoa 13/700, pill 13.5/600.
// Không xuống dưới 13px cho chữ người dùng phải đọc.
export const typography: TypographyVariantsOptions = {
  fontFamily: primaryFont,
  fontSecondaryFamily: secondaryFont,
  fontWeightLight: '300',
  fontWeightRegular: '400',
  fontWeightMedium: '500',
  fontWeightSemiBold: '600',
  fontWeightBold: '700',
  h1: {
    fontWeight: 800,
    lineHeight: 1.25,
    fontSize: pxToRem(30),
    ...responsiveFontSizes({ md: 40 }),
  },
  h2: {
    fontWeight: 800,
    lineHeight: 1.3,
    fontSize: pxToRem(26),
    ...responsiveFontSizes({ md: 32 }),
  },
  h3: {
    fontWeight: 800,
    lineHeight: 1.3,
    fontSize: pxToRem(24),
    ...responsiveFontSizes({ md: 28 }),
  },
  // Tiêu đề trang
  h4: {
    fontWeight: 800,
    lineHeight: 1.3,
    fontSize: pxToRem(22),
    ...responsiveFontSizes({ sm: 24 }),
  },
  h5: {
    fontWeight: 700,
    lineHeight: 1.35,
    fontSize: pxToRem(20),
    ...responsiveFontSizes({ sm: 21 }),
  },
  // Tiêu đề khối, card, dialog
  h6: {
    fontWeight: 700,
    lineHeight: 1.4,
    fontSize: pxToRem(18),
  },
  // Tiêu đề dòng trong danh sách
  subtitle1: {
    fontWeight: 600,
    lineHeight: 1.4,
    fontSize: pxToRem(16),
  },
  subtitle2: {
    fontWeight: 600,
    lineHeight: 1.4,
    fontSize: pxToRem(15),
  },
  body1: {
    lineHeight: 1.55,
    fontSize: pxToRem(16),
  },
  body2: {
    lineHeight: 1.5,
    fontSize: pxToRem(15),
  },
  caption: {
    lineHeight: 1.45,
    fontSize: pxToRem(13.5),
  },
  // Nhãn nhóm in hoa (at-label)
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(13),
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  button: {
    fontWeight: 600,
    lineHeight: 1.2,
    fontSize: pxToRem(15),
    textTransform: 'unset',
  },
};
