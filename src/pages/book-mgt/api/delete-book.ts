

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
            toast.error(err?.response?.data?.msg || 'Error in delete book');
            throw err;
        });
