import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'
type Density = 'compact' | 'comfortable'

interface ThemeContextType {
  theme: Theme
  density: Density
  toggleTheme: () => void
  setTheme: (t: Theme) => void
  setDensity: (d: Density) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_THEME = 'sigq-theme'
const STORAGE_DENSITY = 'sigq-density'

function applyAttrs(theme: Theme, density: Density) {
  const html = document.documentElement
  html.setAttribute('data-theme', theme)
  html.setAttribute('data-density', density)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_THEME) as Theme | null
    return saved === 'dark' ? 'dark' : 'light'
  })
  const [density, setDensityState] = useState<Density>(() => {
    const saved = localStorage.getItem(STORAGE_DENSITY) as Density | null
    return saved === 'comfortable' ? 'comfortable' : 'compact'
  })

  useEffect(() => { applyAttrs(theme, density) }, [theme, density])

  const setTheme = (t: Theme) => {
    setThemeState(t)
    localStorage.setItem(STORAGE_THEME, t)
  }
  const setDensity = (d: Density) => {
    setDensityState(d)
    localStorage.setItem(STORAGE_DENSITY, d)
  }
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  return (
    <ThemeContext.Provider value={{ theme, density, toggleTheme, setTheme, setDensity }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
