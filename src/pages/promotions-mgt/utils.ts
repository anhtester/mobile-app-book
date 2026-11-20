// Nhận cả `t` của useTranslation() lẫn của useTranslate()
type TFunction = (...args: any[]) => any;
import type { LabelColor } from 'src/components/label';

import dayjs from 'dayjs';

// ----------------------------------------------------------------------
// Chép từ bản web (../book.anhtester.com/frontend/src/pages/promotions-mgt/utils.ts).
// Khác web: formatPromotionValue nhận `t` của useTranslation() để React Compiler tính lại khi
// đổi ngôn ngữ (xem memory/notes/i18n.md mục "Bẫy React Compiler").

export type PromotionStatus = 'disabled' | 'scheduled' | 'running' | 'expired';

/**
 * Trạng thái hiển thị của khuyến mãi:
 * tắt (`isActive = false`) → Đã tắt; chưa tới ngày bắt đầu → Sắp chạy;
 * đã qua ngày kết thúc → Hết hạn; còn lại → Đang chạy.
 */
export function getPromotionStatus(
  p: Pick<PromotionType, 'isActive' | 'startDate' | 'endDate'>,
  now = dayjs()
): PromotionStatus {
  if (!p.isActive) return 'disabled';
  if (now.isBefore(dayjs(p.startDate))) return 'scheduled';
  if (now.isAfter(dayjs(p.endDate))) return 'expired';
  return 'running';
}

export const PROMOTION_STATUS_COLOR: Record<PromotionStatus, LabelColor> = {
  disabled: 'default',
  scheduled: 'info',
  running: 'success',
  expired: 'error',
};

const vnd = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

/** `20%` · `50.000 ₫` · `Free shipping` / `Miễn phí ship` */
export function formatPromotionValue(
  t: TFunction,
  p: Pick<PromotionType, 'type' | 'value'>
): string {
  switch (p.type) {
    case 'PERCENTAGE':
      return `${p.value}%`;
    case 'FIXED_AMOUNT':
      return vnd(p.value ?? 0);
    case 'FREE_SHIPPING':
      return t('promotion.value.freeShipping');
    default:
      return String(p.value);
  }
}
