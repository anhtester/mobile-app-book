import { toast } from 'src/components/toast';

import { axios } from './axios';

export const hanldeLogout = () =>
  axios
    .delete('/logout', { withCredentials: true })
    .then((res) => {
      toast.success(res.data.msg, { id: 'msg' });
      return res;
    })
    .catch((err) => toast.error(err.response?.data?.msg ?? 'Network error', { id: 'msg' }))
    .finally(() => localStorage.removeItem('accessToken'));
