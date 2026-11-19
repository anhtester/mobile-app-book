import { AxiosError } from 'axios';

import i18n from 'src/locales';
import { axios } from 'src/api/axios';

import { toast } from 'src/components/toast';

import { setFieldErrors } from './field-errors';

import type { UserForm } from '../store/form';

export const handleUpdateProfileUser = async (user: Partial<UserForm>) => {
  // Path of the avatar uploaded by this request (never the user's current avatar)
  let uploadedPath: string | undefined;
  try {
    // upload Avatar
    if (user.avatar && user.avatar instanceof File) {
      toast.custom(i18n.t('user.toast.uploadAvatar'), 'loading', { id: 'msg', duration: Infinity });
      const form = new FormData();
      const f = user.avatar;
      const randomId = Math.random().toString(36).substring(2, 6);
      const newFileName = `${f.name.split('.').slice(0, -1).join('.')}_${randomId}.${f.name.split('.').pop()}`;
      const newFile = new File([f], newFileName, { type: f.type });
      form.append('files', newFile);
      form.append('path', `/$avatar-image/${user.email}`);

      await axios.post('/file', form, { timeout: 60000 }).then((res) => {
        uploadedPath = res.data.paths[0];
        user.avatarUrl = res.data.paths[0];
      });
    }
    toast.custom(i18n.t('user.toast.uploadProfile'), 'loading', { id: 'msg', duration: Infinity });
    await axios
      .patch(`/profile`, {
        name: user.name,
        email: user.email,
        password_old: user.oldPassword,
        password: user.password,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        address: user.address,
        isActive: user.isActive,
      })
      .then((res) => {
        toast.success(res.data.msg, { id: 'msg' });
        return res;
      });
  } catch (err) {
    if (uploadedPath) {
      try {
        await axios.delete('/file', { params: { path: uploadedPath } });
      } catch {
        // ignore rollback error, the original error is reported below
      }
    }
    const msg = err instanceof AxiosError ? err.response?.data?.msg : undefined;
    toast.error(msg || i18n.t('user.toast.updateProfileFailed'), { id: 'msg' });
    if (err instanceof AxiosError && err.response?.status === 422) {
      setFieldErrors(err.response.data?.fields);
    }
    throw err;
  }
};
