import dayjs from 'dayjs';

import { axios } from 'src/api/axios';

import type { PromotionForm } from '../hooks/form-control';

export const getPromotion = (
  params: {
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
    sortBy?: string;
  } = {}
) =>
  axios
    .get('/promotion-book', { params })
    .then((t) => t.data as { list: PromotionType[]; pagination: { total: number } });

// GET /promotion-book/:id trả `picture` của sách dạng chuỗi JSON thô (danh sách sách thì đã parse sẵn).
const parsePictures = (picture: unknown): string[] => {
  if (Array.isArray(picture)) return picture;
  if (typeof picture !== 'string' || !picture) return [];
  try {
    const parsed = JSON.parse(picture);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/** Lấy một khuyến mãi và chuyển sang giá trị form. */
export const getPromotionForm = (id: string) =>
  axios.get(`/promotion-book/${id}`).then(({ data }): PromotionForm => ({
    name: data.name ?? '',
    code: data.code ?? '',
    description: data.description ?? '',
    type: data.type,
    value: data.value ?? 0,
    startDate: dayjs(data.startDate),
    endDate: dayjs(data.endDate),
    isActive: Boolean(data.isActive),
    books: (data.books ?? []).map((b: any) => ({ ...b, picture: parsePictures(b.picture) })),
  }));
