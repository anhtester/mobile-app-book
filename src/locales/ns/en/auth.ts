// Chép từ ../book.anhtester.com/frontend/src/locales/en/auth.ts (bản web), đổi {x} thành {{x}} cho i18next.
// Gộp bằng script 2026-11-21: chữ lấy theo web, giữ khoá chỉ mobile có (xem memory/notes/i18n.md).
export const auth = {
  signIn: {
    title: 'Sign in',
    noAccount: 'Don’t have an account?',
    getStarted: 'Get started',
    emailLabel: 'Email address',
    passwordLabel: 'Password',
    submit: 'Login account',
  },
  signUp: {
    title: 'Sign up',
    haveAccount: 'Already have an account?',
    signInLink: 'Sign in',
    submit: 'Register',
  },
  validation: {
    emailInvalid: 'Invalid email address',
    emailRequired: 'Email is required.',
    emailMaxLength: 'Email maximum length is 191 characters.',
    passwordRequired: 'Password is required.',
    passwordMaxLength: 'Password maximum length is 250 characters.',
  },
  toast: {
    networkError: 'Cannot connect to the server. Please try again.',
    loadAccountFailed: 'Signed in, but your account could not be loaded. Please try again.',
  },
  password: {
    show: 'Show password',
    hide: 'Hide password',
  },
};
