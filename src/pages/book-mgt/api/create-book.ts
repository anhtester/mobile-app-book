import i18n from 'src/locales';
import { axios } from 'src/api/axios';

import { toast } from 'src/components/toast';

import { setError } from '../stores/form-add';

export const slugify = (s: string) =>
  s
    .replace(/[Đđ]/g, 'd')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

// Upload can take long on mobile networks (up to 20 files x 5MB)
export const UPLOAD_TIMEOUT = 60000;

/** Delete uploaded files one by one (never the folder, it may belong to another book). */
export const deleteFiles = (paths: string[]) =>
  Promise.allSettled(
    paths.filter(Boolean).map((path) => axios.delete('/file', { params: { path } }))
  );

// Backend field name -> form field name
const FIELD_MAP: Record<string, keyof BookForm> = {
  name: 'name',
  slug: 'slug',
  description: 'description',
  status: 'status',
  pictures: 'picture',
  categories: 'categories',
  price: 'price',
  promotions: 'promotions',
};

/** Set backend 422 `{ fields }` errors on the book form, ignoring unknown keys. */
export const setFieldErrors = (fields?: Record<string, string[]>) => {
  if (!fields || typeof fields !== 'object') return;
  for (const [key, value] of Object.entries(fields)) {
    const name = FIELD_MAP[key.split('/')[0]];
    const message = Array.isArray(value) ? value[0] : undefined;
    if (name && message) {
      setError(name, { type: 'manual', message });
    }
  }
};

export const handleCreateBook = async (book: BookForm) => {
  const id = 'create-book';
  let paths: string[] = [];
  try {
    toast.custom(i18n.t('book.toast.uploadingImage'), 'loading', { hiddenCloseButton: true, id });
    const form = new FormData();
    book.picture?.forEach((f) => {
      if (f instanceof File) {
        const randomId = Math.random().toString(36).substring(2, 6);
        const newFileName = `${f.name.split('.').slice(0, -1).join('.')}_${randomId}.${f.name.split('.').pop()}`;
        const newFile = new File([f], newFileName, { type: f.type });
        form.append('files', newFile);
      }
    });
    form.append('path', `/$book-image/${book.slug}`);
    paths = await axios
      .post('/file', form, { timeout: UPLOAD_TIMEOUT })
      .then((res) => res.data.paths ?? []);
    // upload book
    toast.custom(i18n.t('book.toast.uploadingBook'), 'loading', { hiddenCloseButton: true, id });
    const res = await axios.post('/book', {
      name: book.name,
      description: book.description,
      status: book.status,
      categories: book.categories,
      slug: book.slug,
      price: Number(book.price),
      pictures: paths,
      promotions: (book.promotions ?? []).map((x) => x.id),
    });
    toast.success(res.data.msg, { id, duration: 3000 });
    return res;
  } catch (err: any) {
    // rollback only the files just uploaded
    if (paths.length > 0) deleteFiles(paths);
    if (err?.response?.status === 422) {
      setFieldErrors(err.response.data?.fields);
    }
    toast.error(err?.response?.data?.msg || i18n.t('book.toast.createError'), { id, duration: 3000 });
    throw err;
  }
};
