import { create } from 'zustand'

export const useAuth = create<AuthState & AuthActions>(set=>({
    auth: null,
    authChecked: false,
    setAuth: (auth) => set({ auth }),
    setAuthChecked: (authChecked) => set({ authChecked })
}))