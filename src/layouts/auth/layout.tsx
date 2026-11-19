import type { CSSObject, Breakpoint } from '@mui/material/styles';

import { merge } from 'es-toolkit';
import { useTranslation } from 'react-i18next';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';

import { AuthContent } from './content';
import { MainSection } from '../core/main-section';
import { useLayoutPadding } from '../mobile-layout';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import { LanguageDropdown } from '../components/language-dropdown';

import type { AuthContentProps } from './content';
import type { MainSectionProps } from '../core/main-section';
import type { HeaderSectionProps } from '../core/header-section';
import type { LayoutSectionProps } from '../core/layout-section';

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type AuthLayoutProps = LayoutBaseProps & {
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    main?: MainSectionProps;
    content?: AuthContentProps;
  };
};

export function AuthLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = 'md',
}: AuthLayoutProps) {
  const { top } = useLayoutPadding();
  const { t } = useTranslation();
  const renderHeader = () => {
    const headerSlotProps: HeaderSectionProps['slotProps'] = { container: { maxWidth: false } };

    const headerSlots: HeaderSectionProps['slots'] = {
      topArea: (
        <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      leftArea: <Logo />,
      // Dropdown đổi ngôn ngữ (link "Need help?" cũ trỏ `#`, đã bỏ)
      rightArea: <LanguageDropdown />,
    };

    return (
      <HeaderSection
        disableElevation
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={[
          (theme) => ({
            position: { [layoutQuery]: 'fixed' },
            pt: `calc(${theme.spacing(top)} + env(safe-area-inset-top, 0px))`,
          }),
          ...(Array.isArray(slotProps?.header?.sx)
            ? (slotProps?.header?.sx ?? [])
            : [slotProps?.header?.sx]),
        ]}
      />
    );
  };

  const renderFooter = () => null;

  const renderMain = () => (
    <MainSection
      {...slotProps?.main}
      sx={[
        (theme) => ({
          alignItems: 'center',
          p: theme.spacing(10, 2, 10, 2),
        }),
        ...(Array.isArray(slotProps?.main?.sx)
          ? (slotProps?.main?.sx ?? [])
          : [slotProps?.main?.sx]),
      ]}
    >
      <AuthContent {...slotProps?.content}>{children}</AuthContent>
      {/* Khách xem được danh sách mà không cần đăng nhập, nên luôn có đường quay về trang chủ */}
      <Button
        id="auth-back-home"
        component={RouterLink}
        href="/"
        variant="outlined"
        color="inherit"
        startIcon={<Iconify icon="solar:arrow-left-linear" />}
        sx={{ mt: 3, zIndex: 2, minHeight: 44, bgcolor: 'background.paper' }}
      >
        {t('auth.backToHome')}
      </Button>
    </MainSection>
  );

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      headerSection={renderHeader()}
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={{ '--layout-auth-content-width': '420px', ...cssVars }}
      sx={[
        (theme) => ({
          position: 'relative',
          '&::before': backgroundStyles(),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {renderMain()}
    </LayoutSection>
  );
}

// ----------------------------------------------------------------------

const backgroundStyles = (): CSSObject => ({
  zIndex: 1,
  opacity: 0.24,
  width: '100%',
  height: '100%',
  content: "''",
  position: 'absolute',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center',
  backgroundImage: 'url(/assets/background/overlay.jpg)',
});
