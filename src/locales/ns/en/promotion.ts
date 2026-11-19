// Chép từ ../book.anhtester.com/frontend/src/locales/en/promotion.ts (bản web), đổi {x} thành {{x}} cho i18next.
// Namespace 'promotion'. Khoá tiếng Anh là nguồn: thêm khoá ở đây trước, rồi thêm bản dịch ở vi/promotion.ts.
export const promotion = {
  status: {
    label: 'Status',
    disabled: 'Disabled',
    scheduled: 'Scheduled',
    running: 'Running',
    expired: 'Expired',
  },
  type: {
    PERCENTAGE: 'Percentage',
    FIXED_AMOUNT: 'Fixed amount',
    FREE_SHIPPING: 'Free shipping',
  },
  value: {
    freeShipping: 'Free shipping',
  },
  // Trang danh sách
  title: 'Promotion Management',
  newPromotion: 'New Promotion',
  columns: {
    code: 'CODE',
    name: 'Name',
    type: 'Type',
    value: 'Value',
    start: 'Start',
    end: 'End',
    created: 'Created',
  },
  fields: {
    name: 'Name',
    code: 'Code',
    type: 'Type',
    value: 'Value',
    startDate: 'Start Date',
    endDate: 'End Date',
  },
  confirmDelete: 'Confirm you want to delete promotion "{{name}}".',
  // Form thêm / sửa
  handle: {
    createTitle: 'Create a new promotion',
    modifyTitle: 'Modify promotion',
    breadcrumb: 'Promotion management',
    active: 'Active',
    inactive: 'Inactive',
    reset: 'Reset',
    saveChanges: 'Save changes',
    create: 'Create promotion',
    deleteNote:
      'Deleting this promotion removes it from every book it applies to and recalculates their selling price.',
    deleteConfirmBefore: 'Do you want delete ',
    deleteConfirmAfter: ", after delete you can't undo",
    // Riêng mobile: toast khi mở sửa một khuyến mãi không còn tồn tại
    notFound: 'Promotion not found',
  },
  // Riêng mobile: chữ dự phòng khi server không trả `msg`
  toast: {
    saved: 'Saved',
    deleted: 'Deleted',
    networkError: 'Cannot connect to the server. Please try again.',
  },
  detail: {
    title: 'Detail',
    subheader: 'Name, code, description, type, value',
    name: 'Promotion name',
    code: 'Promotion code',
    description: 'Description',
    type: 'Type',
    value: 'Value',
    nameRequired: 'Name is required.',
    nameMax: 'Name must be less than 100 characters.',
    codeRequired: 'Code is required.',
    codeLength: 'Code must be 6 characters.',
    descriptionMax: 'Description must be less than 500 characters.',
    valueRequired: 'Value is required.',
    valuePercent: 'Percentage must be greater than 0 and at most 100.',
    valuePositive: 'Value must be greater than 0.',
    // Riêng mobile: gợi ý dưới ô Giá trị theo loại khuyến mãi
    valuePercentHint: 'Percent (1 - 100)',
    valueAmountHint: 'Amount in VND',
    // Chữ trong ô chọn loại, giữ nguyên chữ thường như bản cũ (CSS viết hoa chữ cái đầu)
    typeOption: {
      PERCENTAGE: 'percentage',
      FIXED_AMOUNT: 'fixed amount',
      FREE_SHIPPING: 'free shipping',
    },
  },
  statusCard: {
    subheader: 'Start date, end date, active',
    startDate: 'Start date',
    endDate: 'End date',
    startRequired: 'Start date is required.',
    endRequired: 'End date is required.',
    endFuture: 'End date must be after start date.',
  },
  books: {
    title: 'Select book',
    subheader: 'Select book apply promotion',
    removeAll: 'Remove {{count}} books',
    columns: {
      name: 'Name',
      price: 'Price',
      created: 'Created',
    },
    fields: {
      name: 'Name',
      description: 'Description',
      price: 'Price',
      created: 'Created',
    },
  },
};
