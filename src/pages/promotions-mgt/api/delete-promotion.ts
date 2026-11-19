import { axios } from 'src/api/axios';

import { toast } from 'src/components/toast';

export const deletePromotion = (id: string) =>
  axios
    .delete(`/promotion-book/${id}`)
    .then((res) => {
      toast.success(res.data?.msg ?? 'Deleted');
      return true;
    })
    .catch((err) => {
      toast.error(err?.response?.data?.msg ?? 'Network error');
      return false;
    });
