

import { AxiosError } from "axios";

import i18n from "src/locales";
import { axios } from "src/api/axios";

import { toast } from "src/components/toast";

import { deleteFiles, UPLOAD_TIMEOUT, setFieldErrors } from "./create-book";


export const handleUpdateBook = async (idBook: string, book: BookForm) => {
    async function UpdateBook(paths: string[]) {
        return await axios.patch(`/book/${idBook}`, {
            name: book.name,
            description: book.description,
            status: book.status,
            categories: book.categories,
            // GET /book/:id does not return slug: only send it when it has a value
            slug: book.slug || undefined,
            price: Number(book.price),
            pictures: paths,
            promotions: (book.promotions ?? []).map(x => x.id),
        })
    }

    async function UpdateNewImage(image: File[]) {
        const form = new FormData();
        image.forEach((f) => {
            if (f instanceof File) {
                const randomId = Math.random().toString(36).substring(2, 6);
                const newFileName = `${f.name.split('.').slice(0, -1).join('.')}_${randomId}.${f.name.split('.').pop()}`;
                const newFile = new File([f], newFileName, { type: f.type });
                form.append('files', newFile);
            }
        });
        form.append('path', `/$book-image/${book.slug || idBook}`);
        return await axios
            .post('/file', form, { timeout: UPLOAD_TIMEOUT })
            .then((res) => (res.data.paths ?? []) as string[]);
    }

    const id = "update-book"
    toast.custom(i18n.t("book.toast.deleteOldImage"), "loading", { hiddenCloseButton: true, id, duration: Infinity });

    let paths: string[] = []
    try {
        // upload new image
        const files = book.picture.filter(f => (f instanceof File))
        if (files.length > 0) {
            toast.custom(i18n.t("book.toast.updateNewImage"), "loading", { hiddenCloseButton: true, id, duration: Infinity });
            paths = await UpdateNewImage(files);
        }
        // update book
        toast.custom(i18n.t("book.toast.updateBook"), "loading", { hiddenCloseButton: true, id, duration: Infinity });
        let count = 0;
        const pathImgs = book.picture.map(x => x instanceof File ? paths[count++] : x.path);
        const res = await UpdateBook(pathImgs);
        toast.success(res.data.msg ?? "", { id, duration: 3000 })
        // delete old image
        const pictureDel = book.pictureDel?.map(x => x.path).filter(x => x)
        if (pictureDel && pictureDel.length > 0) {
            toast.custom(i18n.t("book.toast.deleteOldImage"), "loading", { hiddenCloseButton: true, id, duration: Infinity });
            await deleteFiles(pictureDel);
            toast.success(res.data.msg ?? "", { id, duration: 3000 })
        }
        return res;
    } catch (err) {
        if (err instanceof AxiosError) {
            if (err.response?.status === 422) setFieldErrors(err.response.data?.fields);
            toast.error(err.response?.data?.msg || i18n.t("book.toast.updateError"), { id, duration: 3000 });
        } else {
            toast.error(i18n.t("book.toast.updateError"), { id, duration: 3000 });
        }
        // delete if error
        if (paths.length > 0) {
            await deleteFiles(paths)
        }
        throw err
    }

};
