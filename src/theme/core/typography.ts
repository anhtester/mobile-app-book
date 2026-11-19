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

// Thang chữ theo AT UI kit (anhtester_lms at-ui.css), tối ưu cho màn điện thoại:
// tiêu đề trang 22/800 (at-page-head__title, 19 trên màn hẹp), tiêu đề khối 17/700,
// tiêu đề dòng 14-15/600 (at-row__title), nội dung 15 (body của site), phụ 13-14 (at-row__meta),
// nút 14/600 (at-btn), nhãn in hoa 12/700 (at-label), pill 12.5/600.
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
    fontSize: pxToRem(20),
    ...responsiveFontSizes({ sm: 22 }),
  },
  h5: {
    fontWeight: 700,
    lineHeight: 1.35,
    fontSize: pxToRem(19),
    ...responsiveFontSizes({ sm: 20 }),
  },
  // Tiêu đề khối, card, dialog
  h6: {
    fontWeight: 700,
    lineHeight: 1.4,
    fontSize: pxToRem(17),
  },
  // Tiêu đề dòng trong danh sách
  subtitle1: {
    fontWeight: 600,
    lineHeight: 1.4,
    fontSize: pxToRem(15),
  },
  subtitle2: {
    fontWeight: 600,
    lineHeight: 1.4,
    fontSize: pxToRem(14),
  },
  body1: {
    lineHeight: 1.55,
    fontSize: pxToRem(15),
  },
  body2: {
    lineHeight: 1.5,
    fontSize: pxToRem(14),
  },
  caption: {
    lineHeight: 1.45,
    fontSize: pxToRem(12.5),
  },
  // Nhãn nhóm in hoa (at-label)
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  button: {
    fontWeight: 600,
    lineHeight: 1.2,
    fontSize: pxToRem(14),
    textTransform: 'unset',
  },
};
