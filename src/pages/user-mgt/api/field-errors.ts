import { formControl } from '../store/form';

import type { UserForm } from '../store/form';

// Backend field name -> form field name
const FIELD_MAP: Record<string, keyof UserForm> = {
  name: 'name',
  email: 'email',
  phone: 'phone',
  address: 'address',
  password: 'password',
  password_old: 'oldPassword',
  avatarUrl: 'avatar',
  isActive: 'isActive',
};

/** Set backend `{ fields }` errors on the user form, ignoring keys the form does not have. */
export const setFieldErrors = (fields?: Record<string, string[]>) => {
  if (!fields || typeof fields !== 'object') return;
  for (const [key, value] of Object.entries(fields)) {
    const name = FIELD_MAP[key];
    const message = Array.isArray(value) ? value[0] : undefined;
    if (name && message) {
      formControl.setError(name, { type: 'manual', message });
    }
  }
};
