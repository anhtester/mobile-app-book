/**
 * Thu nhỏ + nén ảnh ngay trên máy trước khi upload.
 *
 * API `POST /api/file` chỉ nhận tổng ≤ 4MB mỗi lần, trong khi ảnh chụp điện thoại thường 3–8MB
 * ⇒ không nén thì người dùng điện thoại không đăng được ảnh sách / avatar (2026-11-23).
 *
 * - Chỉ nén JPEG / PNG / WebP / BMP lớn hơn `skipBelow`. GIF (có thể là ảnh động) và SVG giữ nguyên.
 * - Cạnh dài nhất ≤ `maxSide`, xuất JPEG (nền trắng nếu ảnh gốc trong suốt), giảm chất lượng dần
 *   tới khi ≤ `targetBytes` (thấp nhất 0.5). Ảnh đã nhỏ / nén không lợi hơn thì trả lại file gốc.
 * - Tên file đổi đuôi thành `.jpg` vì server kiểm nội dung khớp đuôi file.
 */

import i18n from 'src/locales';

import { toast } from 'src/components/toast';

const TOAST_ID = 'compress-image';

type CompressOptions = {
  maxSide?: number;
  targetBytes?: number;
  skipBelow?: number;
};

const COMPRESSIBLE = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];

const toJpeg = (canvas: HTMLCanvasElement, quality: number) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));

export async function compressImage(file: File, options: CompressOptions = {}): Promise<File> {
  const { maxSide = 1600, targetBytes = 500 * 1024, skipBelow = 500 * 1024 } = options;

  if (!COMPRESSIBLE.includes(file.type) || file.size <= skipBelow) return file;

  let bitmap: ImageBitmap;
  try {
    // `from-image`: xoay theo EXIF (ảnh chụp dọc trên điện thoại không bị nằm ngang)
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    return file; // trình duyệt không đọc được (VD HEIC) → để server / validation báo lỗi
  }

  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  let quality = 0.85;
  let blob = await toJpeg(canvas, quality);
  while (blob && blob.size > targetBytes && quality > 0.5) {
    quality -= 0.1;
    blob = await toJpeg(canvas, quality);
  }

  if (!blob || blob.size >= file.size) return file;

  const name = `${file.name.replace(/\.[^.]+$/, '')}.jpg`;
  return new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() });
}

/** Nén nhiều ảnh; có ảnh cần nén thì hiện toast "đang tối ưu ảnh" (mỗi ảnh lớn mất 1–3 giây trên điện thoại). */
export async function compressImages(files: File[], options: CompressOptions = {}) {
  const { skipBelow = 500 * 1024 } = options;
  const busy = files.some((f) => COMPRESSIBLE.includes(f.type) && f.size > skipBelow);
  if (busy) {
    toast.custom(i18n.t('components.upload.optimizing'), 'loading', {
      id: TOAST_ID,
      duration: Infinity,
    });
  }
  try {
    return await Promise.all(files.map((f) => compressImage(f, options)));
  } finally {
    if (busy) toast.dismiss(TOAST_ID);
  }
}
