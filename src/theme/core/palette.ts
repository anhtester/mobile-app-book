import type { PaletteColor, ColorSystemOptions, PaletteColorChannel } from '@mui/material/styles';

import { varAlpha, createPaletteChannel } from 'minimal-shared/utils';

import { themeConfig } from '../theme-config';

import type { ThemeColorScheme } from '../types';

// ----------------------------------------------------------------------

/**
 * TypeScript (type definition and extension)
 * @to {@link file://./../extend-theme-types.d.ts}
 */

// Keys for the palette colors
export type PaletteColorKey = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

// Palette color without additional channels
export type PaletteColorNoChannels = Omit<PaletteColor, 'lighterChannel' | 'darkerChannel'>;

// Palette color with additional channels
export type PaletteColorWithChannels = PaletteColor & PaletteColorChannel;

// Extended common colors
export type CommonColorsExtend = {
  whiteChannel: string;
  blackChannel: string;
};

// Extended text colors
export type TypeTextExtend = {
  disabledChannel: string;
};

// Extended background colors
export type TypeBackgroundExtend = {
  neutral: string;
  neutralChannel: string;
};

// Extended palette colors
export type PaletteColorExtend = {
  lighter: string;
  darker: string;
  lighterChannel: string;
  darkerChannel: string;
};

// Extended grey channels
export type GreyExtend = {
  '50Channel': string;
  '100Channel': string;
  '200Channel': string;
  '300Channel': string;
  '400Channel': string;
  '500Channel': string;
  '600Channel': string;
  '700Channel': string;
  '800Channel': string;
  '900Channel': string;
};

// ----------------------------------------------------------------------

// Primary color
export const primary = createPaletteChannel(themeConfig.palette.primary);

// Secondary color
export const secondary = createPaletteChannel(themeConfig.palette.secondary);

// Info color
export const info = createPaletteChannel(themeConfig.palette.info);

// Success color
export const success = createPaletteChannel(themeConfig.palette.success);

// Warning color
export const warning = createPaletteChannel(themeConfig.palette.warning);

// Error color
export const error = createPaletteChannel(themeConfig.palette.error);

// Common color
export const common = createPaletteChannel(themeConfig.palette.common);

// Grey color
export const grey = createPaletteChannel(themeConfig.palette.grey);

// Text color
// Theo AT UI kit: --at-ink / --at-muted (sáng) và bản html.dark-mode (tối)
export const text = {
  light: createPaletteChannel({
    primary: '#0F172A',
    secondary: '#64748B',
    disabled: '#94A3B8',
  }),
  dark: createPaletteChannel({
    primary: '#E6EAF2',
    secondary: '#94A3B8',
    disabled: '#64748B',
  }),
};

// Theo AT UI kit: paper = --at-surface, default = --at-sunken, neutral = --at-gray-bg
export const background = {
  light: createPaletteChannel({
    paper: '#FFFFFF',
    default: '#F3F5F8',
    neutral: '#F1F5F9',
  }),
  dark: createPaletteChannel({
    paper: '#161B26',
    default: '#0F131B',
    neutral: '#1E2533',
  }),
};

// Đường kẻ: --at-line
export const divider = {
  light: '#E5E9F0',
  dark: '#273042',
};

// Base action color
export const baseAction = {
  hover: varAlpha(grey['500Channel'], 0.08),
  selected: varAlpha(grey['500Channel'], 0.16),
  focus: varAlpha(grey['500Channel'], 0.24),
  disabled: varAlpha(grey['500Channel'], 0.8),
  disabledBackground: varAlpha(grey['500Channel'], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
};

// Action color
export const action = {
  light: { ...baseAction, active: grey[600] },
  dark: { ...baseAction, active: '#FFFFFF' },
};

// ----------------------------------------------------------------------

// Base palette
export const basePalette = {
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  common,
  grey,
};

export const palette: Partial<Record<ThemeColorScheme, ColorSystemOptions['palette']>> = {
  light: {
    ...basePalette,
    divider: divider.light,
    text: text.light,
    background: background.light,
    action: action.light,
  },
  dark: {
    ...basePalette,
    // Dark mode của kit: brand sáng hơn (#62D160) để nổi trên nền tối
    primary: createPaletteChannel({ ...themeConfig.palette.primary, light: '#62D160' }),
    divider: divider.dark,
    text: text.dark,
    background: background.dark,
    action: action.dark,
  },
};
