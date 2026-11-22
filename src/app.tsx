import 'src/global.css';
// Khởi tạo i18n (vi/en) + locale của dayjs theo ngôn ngữ đã chọn
import 'src/locales';

import { Toaster } from 'sonner';
import { lazy, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { usePathname } from 'src/routes/hooks';

const ThemeProvider = lazy(() => import('src/theme/theme-provider'));

const ConfigDialog = lazy(() => import('./components/dialog-confirm/confirm-dialog'));

import { createPaletteChannel } from 'minimal-shared/utils';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { useAndroidBackButton } from './hooks/use-android-back-button';
import { useThemeData, generateColorPalette } from './hooks/use-theme-data';
// ----------------------------------------------------------------------

/** Xanh logo AnhTester (stop sáng / stop tối của gradient AT UI kit). */
const BRAND_GREEN = '#42BC40';
const BRAND_COLORS = ['#42BC40', '#268A24'];

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  useScrollToTop();
  useAndroidBackButton();
  const { primary = BRAND_GREEN } = useThemeData();
  const { i18n } = useTranslation();

  // Màu mặc định (xanh logo) dùng đúng palette của AT UI kit trong theme. Chỉ khi người dùng
  // tự chọn màu khác ở Setting > Select color thì mới sinh palette từ màu đó.
  const customPrimary = BRAND_COLORS.includes(primary.toUpperCase())
    ? undefined
    : createPaletteChannel(generateColorPalette(primary));

  return (
    <ThemeProvider
      themeOverrides={
        customPrimary
          ? {
              colorSchemes: {
                dark: { palette: { primary: customPrimary } },
                light: { palette: { primary: customPrimary } },
              },
            }
          : {}
      }
    >
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language}>
        {children}
      </LocalizationProvider>
      <ConfigDialog />
      {/* Toast ở trên cùng, ngay dưới thanh đầu trang: không che nút thêm mới (FAB) và thanh tab đáy */}
      <Toaster
        position="top-center"
        offset={{ top: 'calc(env(safe-area-inset-top, 0px) + 64px)' }}
        mobileOffset={{ top: 'calc(env(safe-area-inset-top, 0px) + 64px)' }}
      />
    </ThemeProvider>
  );
}

// ----------------------------------------------------------------------

function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
