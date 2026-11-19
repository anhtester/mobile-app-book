import { axios } from 'src/api/axios';

import { toast } from 'src/components/toast';

// Tối đa 30 file x 5MB, mạng điện thoại chậm thì 10 giây mặc định không đủ.
const UPLOAD_TIMEOUT = 60000;

export const uploadFile = (formData: FormData) =>
  axios
    .post('/file', formData, { timeout: UPLOAD_TIMEOUT })
    .then((res) => toast.success(res.data.msg))
    .catch((err) => {
      toast.error(err.response?.data?.msg ?? 'Something went wrong.');
      throw err;
    });
