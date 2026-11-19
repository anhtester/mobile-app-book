/**
 * Token của AT UI kit (AnhTester LMS) dùng trong theme MUI.
 *
 * Nguồn: repo `C:\wamp64\www\anhtester_lms`, file `public/build/css/at-ui.css` (biến `--at-*`).
 * Kit đổi thì sửa ở đây. Quy ước màu nút:
 *   - cam (secondary): hành động chính, mỗi màn chỉ 1 nút;
 *   - xanh lá logo (primary): hành động phụ, lọc, đang chọn;
 *   - xanh dương (info), đỏ (error), slate (inherit) theo nghĩa.
 */
export const atKit = {
  grad: {
    orange: 'linear-gradient(135deg, #FB8A2E, #E06004)',
    green: 'linear-gradient(135deg, #42BC40, #268A24)',
    blue: 'linear-gradient(135deg, #3B8FE8, #1570CD)',
    red: 'linear-gradient(135deg, #F0605D, #C9302C)',
    amber: 'linear-gradient(135deg, #FBBF24, #D97706)',
    slate: 'linear-gradient(135deg, #475569, #1E293B)',
  },
  glow: {
    orange: '0 4px 12px rgba(224, 96, 4, .30)',
    green: '0 4px 12px rgba(38, 138, 36, .28)',
    blue: '0 4px 12px rgba(21, 112, 205, .28)',
    red: '0 4px 12px rgba(201, 48, 44, .28)',
    amber: '0 4px 12px rgba(217, 119, 6, .30)',
    slate: '0 4px 12px rgba(15, 23, 42, .25)',
  },
  glowHover: {
    orange: '0 6px 16px rgba(224, 96, 4, .38)',
    green: '0 6px 16px rgba(38, 138, 36, .34)',
    blue: '0 6px 16px rgba(21, 112, 205, .34)',
    red: '0 6px 16px rgba(201, 48, 44, .34)',
    amber: '0 6px 16px rgba(217, 119, 6, .38)',
    slate: '0 6px 16px rgba(15, 23, 42, .32)',
  },
  /** Viền sáng phía trên nút gradient */
  gloss: 'inset 0 1px 0 rgba(255, 255, 255, .2)',
  shadow: {
    light: '0 1px 2px rgba(15, 23, 42, .06), 0 4px 14px rgba(15, 23, 42, .06)',
    dark: '0 1px 2px rgba(0, 0, 0, .4), 0 6px 18px rgba(0, 0, 0, .35)',
  },
  shadowSm: {
    light: '0 1px 2px rgba(15, 23, 42, .08), 0 2px 6px rgba(15, 23, 42, .08)',
    dark: '0 1px 2px rgba(0, 0, 0, .4), 0 2px 6px rgba(0, 0, 0, .3)',
  },
  focus: '0 0 0 3px rgba(66, 188, 64, .2)',
  radius: { sm: 10, md: 12, lg: 16, btn: 11, input: 11 },
  /** Chiều cao nút: xs 28, sm 34, mặc định 42, lg 46 */
  btnHeight: { small: 34, medium: 42, large: 46 },
  ease: '.15s ease',
} as const;

export type AtTone = keyof typeof atKit.grad;
