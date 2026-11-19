type AuthState = {
   auth: User | null
   authChecked: boolean
}

type AuthActions = {
    setAuth: (auth: AuthState['auth']) => void
    setAuthChecked: (authChecked: boolean) => void
}