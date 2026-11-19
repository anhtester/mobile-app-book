import { create } from 'zustand';
import { merge } from 'es-toolkit';
import { useCallback } from 'react';

import { Box, useTheme } from '@mui/material';

import { Logo } from 'src/components/logo';

import { Footer } from './footer';
import { _account } from '../nav-config-account';
import { LanguageSwitch } from '../components/language-switch';
import { AccountPopover } from '../components/account-popover';
import { MainSection, LayoutSection, HeaderSection } from '../core';

import type { HeaderSectionProps } from '../core';
import type { DashboardLayoutProps } from '../dashboard';

export const useLayoutPadding = create<{
  top: number;
  bottom: number;
  set: (top: number, bottom: number) => void;
}>((set) => ({
  top: 0,
  bottom: 0,
  set: (top, bottom) => set({ top, bottom }),
}));

export function MobileLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = 'lg',
}: DashboardLayoutProps) {
  const theme = useTheme();
  const { top, bottom } = useLayoutPadding();
  const renderHeader = useCallback(() => {
    const headerSlotProps: HeaderSectionProps['slotProps'] = {
      container: {
        maxWidth: false,
      },
    };

    const headerSlots: HeaderSectionProps['slots'] = {
      // Logo gọn (32px) để thanh đầu trang chỉ cao 56dp
      leftArea: <Logo height={32} />,
      rightArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LanguageSwitch />
          {/** @slot Account drawer */}
          <AccountPopover data={_account} />
        </Box>
      ),
    };

    return (
      <HeaderSection
        disableElevation
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={{
          ...slotProps?.header?.sx,
          top: theme.spacing(top),
          // Vùng an toàn: status bar / tai thỏ (cần viewport-fit=cover trong index.html)
          paddingTop: 'env(safe-area-inset-top, 0px)',
          bgcolor: theme.vars.palette.background.default,
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '100%',
            left: 0,
            width: 1,
            height: theme.spacing(top),
            bgcolor: theme.vars.palette.background.default,
          },
        }}
      />
    );
  }, [layoutQuery, slotProps?.header, theme, top]);

  return (
    <LayoutSection
      footerSection={<Footer />}
      headerSection={renderHeader()}
      sx={{
        ...sx,
        pt: theme.spacing(top),
        // Chừa chỗ cho thanh tab đáy (64dp) + vùng an toàn đáy + nút thêm mới (FAB)
        pb: `calc(${theme.spacing(bottom + 18)} + env(safe-area-inset-bottom, 0px))`,
      }}
    >
      <MainSection {...slotProps?.main}>{children}</MainSection>
    </LayoutSection>
  );
}
