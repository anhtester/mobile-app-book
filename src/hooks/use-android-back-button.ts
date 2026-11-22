import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

// ----------------------------------------------------------------------

/**
 * Nút Back (cứng / cử chỉ) của Android.
 *
 * Mặc định Capacitor chỉ lùi lịch sử WebView, nên khi menu ☰, hộp thoại, menu ⋮, xem ảnh,
 * đọc thử… đang mở thì bấm Back lại đổi trang phía sau còn lớp phủ vẫn mở (2026-11-23).
 * Thứ tự xử lý như app native:
 * 1. Có lớp phủ MUI (Drawer / Dialog / Menu / Popover) đang mở → đóng lớp trên cùng
 *    (gửi phím Escape, MUI tự gọi `onClose` và tôn trọng `disableEscapeKeyDown`).
 * 2. Có trang trước → lùi lịch sử.
 * 3. Không còn trang trước → thoát app.
 */
export function useAndroidBackButton() {
  useEffect(() => {
    if (Capacitor.getPlatform() !== 'android') return undefined;

    const listener = App.addListener('backButton', ({ canGoBack }) => {
      const overlays = document.querySelectorAll<HTMLElement>('.MuiModal-root:not(.MuiModal-hidden)');
      const top = overlays[overlays.length - 1];

      if (top) {
        top.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        return;
      }

      if (canGoBack) {
        window.history.back();
      } else {
        App.exitApp();
      }
    });

    return () => {
      listener.then((handle) => handle.remove());
    };
  }, []);
}
