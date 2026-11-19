import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  /**
   * Màn đang ẩn: không hiện trên thanh tab đáy và không có route (mở URL ra trang 404).
   * Bỏ đường dẫn khỏi danh sách là bật lại (code của màn vẫn giữ nguyên). Giống bản web.
   */
  hiddenPaths: string[];
};

export const CONFIG: ConfigValue = {
  appName: 'Book UI for api-book.anhtester.com',
  appVersion: packageJson.version,
  hiddenPaths: ['/file-management'],
};

/** Đường dẫn (có hoặc không có `/` đầu) có thuộc màn đang ẩn không */
export const isHiddenPath = (path?: string) => {
  if (!path) return false;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return CONFIG.hiddenPaths.some((p) => normalized === p || normalized.startsWith(`${p}/`));
};
