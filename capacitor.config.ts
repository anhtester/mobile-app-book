import type { CapacitorConfig } from '@capacitor/cli';

// Live reload: chỉ bật khi chạy `cap sync` có biến CAP_LIVE_URL (script `sync:android:live`).
// App trên thiết bị sẽ mở thẳng web dev (`bun run dev`), `/api` đi qua proxy Vite sang backend local.
// `build:android` không đặt biến này nên sync lại cấu hình gốc: app đóng gói từ dist, gọi production.
const liveUrl = process.env.CAP_LIVE_URL;

const config: CapacitorConfig = {
  appId: 'com.anhtester.book',
  appName: 'Book Anhtester',
  webDir: 'dist',
  ...(liveUrl && { server: { url: liveUrl, cleartext: true } }),
};

export default config;
