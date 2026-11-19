import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Style, StatusBar } from '@capacitor/status-bar';

import { useColorScheme } from '@mui/material';

import { useThemeData } from 'src/hooks/use-theme-data';

import { axios } from 'src/api/axios';
import { useAuth } from 'src/store/auth';

import { useRouter } from '../hooks';

export async function checkStatusBarStyle(mode: 'light' | 'dark' | 'system') {
  if (!Capacitor.isNativePlatform()) {
    console.log('Chỉ chạy trên thiết bị Android/iOS');
    return;
  }

  if (mode === 'light') {
    StatusBar.setStyle({ style: Style.Light });
  }

  if (mode === 'dark') {
    StatusBar.setStyle({ style: Style.Dark });
  }

  if (mode === 'system') {
    StatusBar.setStyle({ style: Style.Default });
  }
}

export function CheckAuth({
  children,
  fallback,
}: React.PropsWithChildren & {
  fallback: React.ReactNode;
}) {
  const { setAuth, setAuthChecked } = useAuth();
  const router = useRouter();
  const { setMode } = useColorScheme();
  const { setPrimary } = useThemeData();

  useEffect(() => {
    axios
      .get('/me')
      .then((res) => {
        setAuth(res.data);
        setMode(res.data.config?.theme || 'system');
        setPrimary(res.data.config?.mainColor || '#42BC40');
        checkStatusBarStyle(res.data.config?.theme || 'system');
      })
      .catch(() => setAuth(null))
      .finally(() => setAuthChecked(true));

    // Vùng an toàn (status bar, tai thỏ, thanh điều hướng) giờ lấy từ CSS env(safe-area-inset-*)
    // trong layout, đo đúng theo từng máy. Trước đây gán cứng Android 40px/16px, iOS 48px/24px:
    // cộng thêm env() thì bị đệm hai lần, và sai lệch với máy có inset khác.
  }, [router, setAuth, setAuthChecked, setMode, setPrimary]);

  return children;
}
