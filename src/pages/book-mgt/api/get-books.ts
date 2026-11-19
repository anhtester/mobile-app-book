import i18n from 'src/locales';
import { axios } from 'src/api/axios';

import { toast } from 'src/components/toast';

export const getBooks = (params: {
  sortBy: string;
  sort: string;
  page: number;
  limit: number;
  search: string;
}) =>
  axios
    .get(`/book`, { params })
    .then(
      (res) =>
        res.data as {
          list: BookView[];
          pagination: {
            currentPage: number;
            lengthData: number;
            total: number;
            totalPage: number;
          };
        }
    )
    .catch((err) => {
      toast.error(err?.response?.data?.msg ?? i18n.t('book.toast.networkError'));
      throw err;
    });
