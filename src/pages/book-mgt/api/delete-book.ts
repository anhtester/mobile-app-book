

import i18n from "src/locales";
import { axios } from "src/api/axios";

import { toast } from "src/components/toast";

export const deleteBook = (id: string) =>
    axios
        .delete(`/book/${id}`)
        .then((res) => {
            toast.success(res.data.msg);
            return res;
        })
        .catch((err) => {
            toast.error(err?.response?.data?.msg || i18n.t('book.toast.deleteError'));
            throw err;
        });
