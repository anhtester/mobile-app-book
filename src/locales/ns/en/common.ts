// Chép từ ../book.anhtester.com/frontend/src/locales/en/common.ts (bản web), đổi {x} thành {{x}} cho i18next.
// Chuỗi dùng chung nhiều màn. Chuỗi riêng của màn nào thì để ở namespace của màn đó.
export const common = {
  appName: 'Book UI for api-book.anhtester.com',
  language: 'Language',
  actions: {
    add: 'Add',
    create: 'Create',
    edit: 'Edit',
    save: 'Save',
    update: 'Update',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    back: 'Back',
    reload: 'Reload',
    search: 'Search',
    rename: 'Rename',
    submit: 'Submit',
    upload: 'Upload',
    download: 'Download',
  },
  status: {
    active: 'Active',
    inactive: 'Inactive',
    yes: 'Yes',
    no: 'No',
  },
  fields: {
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    description: 'Description',
    createdAt: 'Created',
    updatedAt: 'Updated',
  },
  noData: 'No Data',
  somethingWrong: 'Something went wrong.',
  // Riêng mobile: tiêu đề trang lỗi của router (routes/components/error-boundary.tsx)
  errorBoundary: {
    unexpected: 'Unexpected Application Error!',
    unknown: 'Unknown Error',
  },
};
