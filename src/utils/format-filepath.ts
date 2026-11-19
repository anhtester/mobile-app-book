import { URLBASE } from "src/api/axios";

export function formatFilePath(path?: string) {
  // Encode để tên file/thư mục chứa `+`, `#`, `&`, `%`, dấu cách... không làm vỡ query string.
  return path ? `${URLBASE}/api/file?path=${encodeURIComponent(path)}` : '';
}
