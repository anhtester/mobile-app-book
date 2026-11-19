import { axios } from 'src/api/axios';

import { toast } from 'src/components/toast';

import { setError, type PromotionForm } from '../hooks/form-control';

const FIELDS: (keyof PromotionForm)[] = [
  'name',
  'code',
  'description',
  'type',
  'value',
  'startDate',
  'endDate',
  'isActive',
  'books',
];

const toBody = (promotion: PromotionForm) => ({
  name: promotion.name.trim(),
  code: promotion.code.trim().toUpperCase(),
  description: promotion.description ?? '',
  type: promotion.type,
  value: promotion.type === 'FREE_SHIPPING' ? 0 : Number(promotion.value || 0),
  startDate: promotion.startDate,
  endDate: promotion.endDate,
  isActive: Boolean(promotion.isActive),
  books: (promotion.books ?? []).map((x) => x.id),
});

/** Tạo mới (không có id) hoặc cập nhật (có id) khuyến mãi. */
export const savePromotion = async (promotion: PromotionForm, id?: string | null) => {
  try {
    const body = toBody(promotion);
    const res = id
      ? await axios.patch(`/promotion-book/${id}`, body)
      : await axios.post('/promotion-book', body);
    toast.success(res.data?.msg ?? 'Saved');
    return res;
  } catch (err: any) {
    const data = err?.response?.data;
    toast.error(data?.msg ?? 'Network error');
    if (data?.fields && typeof data.fields === 'object') {
      for (const [key, value] of Object.entries(data.fields)) {
        const name = key.split('/')[0] as keyof PromotionForm;
        const message = Array.isArray(value) ? value[0] : undefined;
        if (FIELDS.includes(name) && message) {
          setError(name, { type: 'manual', message });
        }
      }
    }
    throw err;
  }
};
