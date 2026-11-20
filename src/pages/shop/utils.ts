/** Định dạng tiền VND theo kiểu Việt Nam (VD 71.100 ₫), giống bản web. */
export const formatVnd = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
