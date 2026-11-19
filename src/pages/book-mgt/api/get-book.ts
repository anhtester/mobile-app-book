import i18n from 'src/locales';
import { axios } from 'src/api/axios';

import { toast } from 'src/components/toast';

// GET /book/:id does not return slug, the list endpoint does
const getSlug = (id: string) =>
  axios
    .get('/book', { params: { search: JSON.stringify({ id }), limit: 1 } })
    .then((res) => (res.data?.list?.[0]?.slug as string | undefined) ?? '')
    .catch(() => '');

export const getBook = (id: string) =>
  Promise.all([axios.get(`/book/${id}`), getSlug(id)])
    .then(
      ([res, slug]) =>
        ({
          ...res.data,
          slug,
        }) as BookForm
    )
    .catch((err) => {
      toast.error(err?.response?.data?.msg || i18n.t('book.toast.getError'));

      return {} as BookForm;
    });
