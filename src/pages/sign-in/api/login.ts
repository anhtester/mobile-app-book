import i18n from 'src/locales';
import { axios } from 'src/api/axios';

import { toast } from 'src/components/toast';

import { formControl } from '../store/store-fields-login';

export async function loginHanle(prop: { email: string; password: string }) {
  return axios
    .post('/login', prop, {
      withCredentials: true,
    })
    .then((res) => {
      localStorage.setItem('accessToken', res.data.accessToken);
      toast.success(res.data.msg);
    })
    .catch((err) => {
      toast.error(err.response?.data?.msg ?? i18n.t('auth.toast.networkError'));
      const fields = err.response?.data?.fields;
      if (fields) {
        for (const [key, value] of Object.entries(fields)) {
          formControl.setError(key as keyof SignInForm, {
            type: 'manual',
            message: (value as string[])[0],
          });
        }
      }
      throw err;
    });
}
