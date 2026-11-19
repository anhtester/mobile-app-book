import type { Theme, Components, CSSProperties } from '@mui/material/styles';

import { varAlpha } from 'minimal-shared/utils';

import SvgIcon from '@mui/material/SvgIcon';

import { Iconify } from 'src/components/iconify';

import { atKit } from '../at-kit';

// ----------------------------------------------------------------------

const MuiBackdrop: Components<Theme>['MuiBackdrop'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundColor: varAlpha(theme.vars.palette.grey['900Channel'], 0.8),
    }),
    invisible: {
      background: 'transparent',
    },
  },
};

type GradientColor = 'primary' | 'secondary' | 'info' | 'error' | 'warning' | 'success';

/** Nút gradient của AT UI kit: stop sáng (light) → stop tối (main), glow cùng màu, viền sáng trên. */
const gradientButton = (theme: Theme, color: GradientColor) => {
  const c = theme.vars.palette[color];
  return {
    color: c.contrastText,
    backgroundImage: `linear-gradient(135deg, ${c.light}, ${c.main})`,
    boxShadow: `0 4px 12px ${varAlpha(c.mainChannel, 0.28)}, ${atKit.gloss}`,
    ...(color === 'secondary' && { textShadow: '0 1px 1px rgba(120, 45, 0, .25)' }),
    '&:hover': {
      color: c.contrastText,
      backgroundColor: c.main,
      filter: 'brightness(1.06) saturate(1.05)',
      boxShadow: `0 6px 16px ${varAlpha(c.mainChannel, 0.36)}, ${atKit.gloss}`,
    },
    '&.Mui-disabled': {
      backgroundImage: 'none',
      boxShadow: 'none',
      textShadow: 'none',
    },
  };
};

const MuiButton: Components<Theme>['MuiButton'] = {
  defaultProps: {
    disableElevation: true,
  },
  styleOverrides: {
    root: ({ theme, ownerState: { variant, color = 'primary' } }) => ({
      borderRadius: atKit.radius.btn,
      fontWeight: theme.typography.fontWeightSemiBold,
      transition: `background-color ${atKit.ease}, color ${atKit.ease}, border-color ${atKit.ease}, box-shadow ${atKit.ease}, filter ${atKit.ease}, transform .08s ease`,
      // Nhấn là thấy: nhún nhẹ khi bấm (at-btn:active)
      '&:active:not(.Mui-disabled)': { transform: 'translateY(1px) scale(.97)' },
      '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
      ...(variant === 'contained' &&
        color !== 'inherit' &&
        gradientButton(theme, color as GradientColor)),
      // Không còn nút đen: "inherit" đặc = slate gradient (nút trung tính tối của kit)
      ...(variant === 'contained' &&
        color === 'inherit' && {
          color: theme.vars.palette.common.white,
          backgroundImage: atKit.grad.slate,
          boxShadow: `${atKit.glow.slate}, ${atKit.gloss}`,
          '&:hover': {
            color: theme.vars.palette.common.white,
            filter: 'brightness(1.06)',
            boxShadow: `${atKit.glowHover.slate}, ${atKit.gloss}`,
          },
          '&.Mui-disabled': { backgroundImage: 'none', boxShadow: 'none' },
        }),
      // Viền màu, hover đổ gradient (at-btn--outline-green / --outline-orange)
      ...(variant === 'outlined' &&
        color !== 'inherit' && {
          borderWidth: 1.5,
          borderColor: varAlpha(theme.vars.palette[color as GradientColor].mainChannel, 0.32),
          backgroundColor: theme.vars.palette.background.paper,
          '&:hover': {
            borderColor: 'transparent',
            color: theme.vars.palette[color as GradientColor].contrastText,
            backgroundImage: `linear-gradient(135deg, ${theme.vars.palette[color as GradientColor].light}, ${theme.vars.palette[color as GradientColor].main})`,
          },
        }),
    }),
    // Trung tính (at-btn--ghost): nền trắng, viền --at-line, chữ muted
    outlinedInherit: ({ theme }) => ({
      color: theme.vars.palette.text.secondary,
      backgroundColor: theme.vars.palette.background.paper,
      border: `1.5px solid ${theme.vars.palette.divider}`,
      '&:hover': {
        color: theme.vars.palette.text.primary,
        backgroundColor: theme.vars.palette.background.default,
        border: `1.5px solid ${theme.vars.palette.divider}`,
      },
    }),
    sizeSmall: { minHeight: atKit.btnHeight.small, fontSize: 13, borderRadius: atKit.radius.sm },
    sizeMedium: { minHeight: atKit.btnHeight.medium, paddingLeft: 18, paddingRight: 18 },
    sizeLarge: {
      minHeight: atKit.btnHeight.large,
      fontSize: 14.5,
      paddingLeft: 22,
      paddingRight: 22,
      borderRadius: atKit.radius.md,
    },
  },
};

// Panel của kit: bo 16, viền --at-line, bóng nhẹ
const MuiCard: Components<Theme>['MuiCard'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      zIndex: 0,
      position: 'relative',
      border: `1px solid ${theme.vars.palette.divider}`,
      boxShadow: atKit.shadow.light,
      borderRadius: atKit.radius.lg,
      ...theme.applyStyles('dark', { boxShadow: atKit.shadow.dark }),
    }),
  },
};

const MuiCardHeader: Components<Theme>['MuiCardHeader'] = {
  defaultProps: {
    titleTypographyProps: { variant: 'h6' },
    subheaderTypographyProps: { variant: 'body2' },
  },
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(3, 3, 0),
    }),
  },
};

// Ô nhập theo .at-input: viền 1.5px --at-line, bo 11, focus viền brand + vòng sáng
const MuiOutlinedInput: Components<Theme>['MuiOutlinedInput'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: atKit.radius.input,
      backgroundColor: theme.vars.palette.background.paper,
      transition: `box-shadow ${atKit.ease}`,
      [`&:hover:not(.Mui-disabled):not(.Mui-error) .MuiOutlinedInput-notchedOutline`]: {
        borderColor: varAlpha(theme.vars.palette.primary.mainChannel, 0.4),
      },
      '&.Mui-focused:not(.Mui-error)': {
        boxShadow: `0 0 0 3px ${varAlpha(theme.vars.palette.primary.lightChannel, 0.2)}`,
      },
      '&.Mui-focused:not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
        borderWidth: 1.5,
        borderColor: theme.vars.palette.primary.main,
      },
      // Disabled theo kit (`.at-form .form-control:disabled`): nền --at-sunken, chữ --at-muted,
      // viền giữ --at-line. Mặc định MUI tô viền `action.disabled` nên ô khoá trông đậm hơn ô thường.
      '&.Mui-disabled': {
        backgroundColor: theme.vars.palette.background.default,
        color: theme.vars.palette.text.secondary,
      },
      '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.vars.palette.divider,
      },
    }),
    notchedOutline: ({ theme }) => ({
      borderWidth: 1.5,
      borderColor: theme.vars.palette.divider,
    }),
    // Trên điện thoại chữ trong ô 16px: nhỏ hơn thì trình duyệt tự zoom khi focus
    input: ({ theme }) => ({
      [theme.breakpoints.down('sm')]: { fontSize: theme.typography.pxToRem(16) },
    }),
  },
};

const MuiPaper: Components<Theme>['MuiPaper'] = {
  defaultProps: { elevation: 0 },
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundImage: 'none',
      boxShadow: theme.vars.customShadows.z4,
      '& ul': {
        padding: theme.spacing(0.5),
        overflowY: 'auto',
        scrollbarWidth: 'none', // Firefox
        '-ms-overflow-style': 'none', // IE/Edge
        '&::-webkit-scrollbar': {
          display: 'none', // Chrome, Safari
        },
        '& li + li': {
          marginTop: theme.spacing(0.5),
        },
        '& li': {
          borderRadius: theme.spacing(1),
        },
      },
    }),
    outlined: ({ theme }) => ({
      borderColor: theme.vars.palette.divider,
    }),
  },
};

const MuiTableCell: Components<Theme>['MuiTableCell'] = {
  styleOverrides: {
    head: ({ theme }) => ({
      fontSize: theme.typography.pxToRem(14),
      color: theme.vars.palette.text.secondary,
      fontWeight: theme.typography.fontWeightSemiBold,
      backgroundColor: theme.vars.palette.background.neutral,
    }),
  },
};

const MuiMenuItem: Components<Theme>['MuiMenuItem'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      ...theme.typography.body2,
    }),
  },
};

const MuiLink: Components<Theme>['MuiLink'] = {
  defaultProps: { underline: 'hover' },
};

const MuiFormControlLabel: Components<Theme>['MuiFormControlLabel'] = {
  styleOverrides: {
    label: ({ theme }) => ({
      ...theme.typography.body2,
    }),
  },
};

const MuiCheckbox: Components<Theme>['MuiCheckbox'] = {
  defaultProps: {
    size: 'small',
    icon: (
      <SvgIcon>
        <path d="M17.9 2.318A5 5 0 0 1 22.895 7.1l.005.217v10a5 5 0 0 1-4.783 4.995l-.217.005h-10a5 5 0 0 1-4.995-4.783l-.005-.217v-10a5 5 0 0 1 4.783-4.996l.217-.004h10Zm-.5 1.5h-9a4 4 0 0 0-4 4v9a4 4 0 0 0 4 4h9a4 4 0 0 0 4-4v-9a4 4 0 0 0-4-4Z" />
      </SvgIcon>
    ),
    checkedIcon: (
      <SvgIcon>
        <path d="M17 2a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm-1.625 7.255-4.13 4.13-1.75-1.75a.881.881 0 0 0-1.24 0c-.34.34-.34.89 0 1.24l2.38 2.37c.17.17.39.25.61.25.23 0 .45-.08.62-.25l4.75-4.75c.34-.34.34-.89 0-1.24a.881.881 0 0 0-1.24 0Z" />
      </SvgIcon>
    ),
    indeterminateIcon: (
      <SvgIcon>
        <path d="M17,2 C19.7614,2 22,4.23858 22,7 L22,7 L22,17 C22,19.7614 19.7614,22 17,22 L17,22 L7,22 C4.23858,22 2,19.7614 2,17 L2,17 L2,7 C2,4.23858 4.23858,2 7,2 L7,2 Z M15,11 L9,11 C8.44772,11 8,11.4477 8,12 C8,12.5523 8.44772,13 9,13 L15,13 C15.5523,13 16,12.5523 16,12 C16,11.4477 15.5523,11 15,11 Z" />
      </SvgIcon>
    ),
  },
};

const MuiRadio: Components<Theme>['MuiRadio'] = {
  defaultProps: {
    size: 'small',
    icon: (
      <SvgIcon>
        <path
          d="M12 2C13.9778 2 15.9112 2.58649 17.5557 3.6853C19.2002 4.78412 20.4819 6.3459 21.2388 8.17317C21.9957 10.0004 22.1937 12.0111 21.8079 13.9509C21.422 15.8907 20.4696 17.6725 19.0711 19.0711C17.6725 20.4696 15.8907 21.422 13.9509 21.8079C12.0111 22.1937 10.0004 21.9957 8.17317 21.2388C6.3459 20.4819 4.78412 19.2002 3.6853 17.5557C2.58649 15.9112 2 13.9778 2 12C2 6.477 6.477 2 12 2ZM12 3.5C9.74566 3.5 7.58365 4.39553 5.98959 5.98959C4.39553 7.58365 3.5 9.74566 3.5 12C3.5 14.2543 4.39553 16.4163 5.98959 18.0104C7.58365 19.6045 9.74566 20.5 12 20.5C14.2543 20.5 16.4163 19.6045 18.0104 18.0104C19.6045 16.4163 20.5 14.2543 20.5 12C20.5 9.74566 19.6045 7.58365 18.0104 5.98959C16.4163 4.39553 14.2543 3.5 12 3.5Z"
          fill="currentColor"
        />
      </SvgIcon>
    ),
    checkedIcon: (
      <SvgIcon>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM12 8C10.9391 8 9.92172 8.42143 9.17157 9.17157C8.42143 9.92172 8 10.9391 8 12C8 13.0609 8.42143 14.0783 9.17157 14.8284C9.92172 15.5786 10.9391 16 12 16C13.0609 16 14.0783 15.5786 14.8284 14.8284C15.5786 14.0783 16 13.0609 16 12C16 10.9391 15.5786 9.92172 14.8284 9.17157C14.0783 8.42143 13.0609 8 12 8Z"
          fill="currentColor"
        />
      </SvgIcon>
    ),
  },
};

const MuiAlert: Components<Theme>['MuiAlert'] = {
  defaultProps: {
    iconMapping: {
      info: <Iconify width={22} icon="solar:info-circle-bold" />,
      error: <Iconify width={22} icon="solar:danger-bold" />,
      warning: <Iconify width={22} icon="solar:danger-triangle-bold" />,
      success: <Iconify width={22} icon="solar:check-circle-bold" />,
    },
  },
};

const MuiAvatar: Components<Theme>['MuiAvatar'] = {
  defaultProps: {
    children: (
      <SvgIcon width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="6" r="4" fill="currentColor" />
        <path
          fill="currentColor"
          d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5"
          opacity="0.5"
        />
      </SvgIcon>
    ),
  },
};

const MuiSwitch: Components<Theme>['MuiSwitch'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      padding: 8,
      '& .MuiSwitch-track': {
        borderRadius: 22 / 2,
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          width: 16,
          height: 16,
        },
      },
      '& .MuiSwitch-thumb': {
        boxShadow: 'none',
        width: 16,
        height: 16,
        margin: 2,
      },
      '& .MuiSwitch-switchBase': {
        '&.Mui-checked': {
          color: '#fff !important',
          '& + .MuiSwitch-track': {
            backgroundColor: theme.palette.primary.main,
            opacity: 1,
            border: 0,
          },
          '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.5,
          },
        },
      },
    }),
  },
};

import '@mui/material/Tabs';
import '@mui/material/Checkbox';
import '@mui/material/TextField';
import '@mui/material/InputBase';

declare module '@mui/material/Tabs' {
  interface TabsOwnProps {
    type?: 'button' | 'default';
  }
}

import { toggleButtonGroupClasses } from '@mui/material';

declare module '@mui/material/TextField' {
  interface TextFieldPropsColorOverrides {
    inherit: true;
  }
}

declare module '@mui/material/Checkbox' {
  interface CheckboxPropsColorOverrides {
    inherit: true;
  }
}

declare module '@mui/material/InputBase' {
  interface InputBasePropsColorOverrides {
    inherit: true;
  }
}

const MuiInputBase: Components<Theme>['MuiInputBase'] = {
  defaultProps: {
    inputProps: {
      autoComplete: 'new-password',
    },
  },
};

const MuiTextField: Components<Theme>['MuiTextField'] = {
  defaultProps: {
    // Focus dùng màu brand (xanh lá logo) theo kit, không còn viền đen
    color: 'primary',
  },
  styleOverrides: {
    root: ({ theme }) => ({
      '& .MuiFormLabel-asterisk': {
        color: `${theme.palette.primary.main} !important`,
      },
    }),
  },
};

const IconSelect = (p: { style?: CSSProperties; sx?: Sx; className?: string }) => (
  <Iconify {...p} style={{marginTop: -4}} icon="eva:arrow-ios-downward-fill" />
);

const MuiAutocomplete: Components<Theme>['MuiAutocomplete'] = {
  defaultProps: {
    popupIcon: <IconSelect />,
    slotProps: {
      popper: {
        disablePortal: false,
      },
    },
  },
};

const MuiTabs: Components<Theme>['MuiTabs'] = {
  styleOverrides: {
    root: ({ theme, ownerState: { type } }) =>
      type === 'button' && {
        backgroundColor: theme.vars.palette.background.neutral,
        minHeight: 52,
        '& .MuiTabs-list': {
          color: 'inherit',
          zIndex: 2,
          position: 'relative',
          padding: theme.spacing(0, 1),
          '& .MuiTouchRipple-root': {
            display: 'none',
          },
          '& button': {
            minHeight: 52,
          },
          '& button.Mui-selected ': {
            color: theme.vars.palette.text.primary,
          },
        },
        '& .MuiTabs-indicator': {
          background: 'transparent',
          display: 'flex',
          height: '100%',
          zIndex: 1,
          padding: theme.spacing(1, 0),
          '&::before': {
            backgroundColor: theme.vars.palette.background.paper,
            display: 'block',
            height: '100%',
            width: '100%',
            content: '""',
            borderRadius: theme.spacing(1),
          },
        } as React.CSSProperties,
      },
  },
};

const MuiToggleButtonGroup: Components<Theme>['MuiToggleButtonGroup'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      background: theme.vars.palette.background.paper,
      [`& .${toggleButtonGroupClasses.grouped}`]: {
        margin: theme.spacing(0.5),
        border: 0,
        borderRadius: Number(theme.shape.borderRadius),
        [`&.${toggleButtonGroupClasses.disabled}`]: {
          border: 0,
        },
      },
      [`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]: {
        marginLeft: -1,
        borderLeft: '1px solid transparent',
      },
    }),
  },
};

const MuiSelect: Components<Theme>['MuiSelect'] = {
  defaultProps: {
    IconComponent: (props: any) => <IconSelect {...props} />,
  },
};

// ----------------------------------------------------------------------

export const components = {
  MuiCard,
  MuiLink,
  MuiAlert,
  MuiPaper,
  MuiRadio,
  MuiButton,
  MuiBackdrop,
  MuiMenuItem,
  MuiCheckbox,
  MuiTableCell,
  MuiCardHeader,
  MuiOutlinedInput,
  MuiFormControlLabel,
  MuiAvatar,
  MuiSwitch,
  MuiTextField,
  MuiAutocomplete,
  MuiInputBase,
  MuiToggleButtonGroup,
  MuiTabs,
  MuiSelect,
};
