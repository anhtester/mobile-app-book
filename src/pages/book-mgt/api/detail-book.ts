import i18n from "src/locales";
import { axios } from "src/api/axios";

import { toast } from "src/components/toast";

export const getDetailBook = (id: string) =>
    axios
        .get(`/book/${id}`, { params: { view: 'true' } })
        .then((res) => res.data as BookForm)
        .catch((err) => {
            toast.error(err?.response?.data?.msg ?? i18n.t('book.toast.networkError'));
            throw err;
        });