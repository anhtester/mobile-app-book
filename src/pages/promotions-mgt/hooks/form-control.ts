import dayjs, { type Dayjs } from 'dayjs';
import { createFormControl } from 'react-hook-form';

export const formControl = createFormControl<PromotionForm>();
export const { control, getValues, reset, setValue, handleSubmit, setFocus, setError } =
  formControl;

export type PromotionForm = {
  name: string;
  code: string;
  description: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  value: number;
  startDate: Dayjs;
  endDate: Dayjs;
  isActive: boolean;
  books: BookView[];
};

/** Giá trị rỗng cho form tạo mới (form là store dùng chung nên phải reset tường minh). */
export const emptyPromotion = (): PromotionForm => ({
  name: '',
  code: '',
  description: '',
  type: 'FIXED_AMOUNT',
  value: 0,
  startDate: dayjs(),
  endDate: dayjs().add(7, 'day'),
  isActive: true,
  books: [],
});

export const TypePromotion = ['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING'] as const;
