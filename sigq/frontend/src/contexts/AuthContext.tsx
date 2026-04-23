import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface AuthContextType {
  token: string | null
  isAuthenticated: boolean
  setToken: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem('sigq_jwt_token')
  })

  const setToken = useCallback((newToken: string) => {
    setTokenState(newToken)
    localStorage.setItem('sigq_jwt_token', newToken)
  }, [])

  const logout = useCallback(() => {
    setTokenState(null)
    localStorage.removeItem('sigq_jwt_token')
  }, [])

  const value: AuthContextType = {
    token,
    isAuthenticated: !!token,
    setToken,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
