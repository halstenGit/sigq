import { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('sigq-theme') as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const initialTheme = prefersDark ? 'dark' : 'light'
      setTheme(initialTheme)
      applyTheme(initialTheme)
    }
  }, [])

  const applyTheme = (t: Theme) => {
    const html = document.documentElement
    if (t === 'dark') {
      html.style.setProperty('--bg', '#1A1A1A')
      html.style.setProperty('--bg-1', '#252525')
      html.style.setProperty('--bg-2', '#2F2F2F')
      html.style.setProperty('--muted-1', '#666666')
      html.style.setProperty('--muted-2', '#444444')
      html.style.setProperty('--ink', '#F5F5F2')
      html.style.setProperty('--ink-1', '#EFEFEB')
      html.style.setProperty('--ink-2', '#CCCCCC')
    } else {
      html.style.setProperty('--bg', '#FAFAF7')
      html.style.setProperty('--bg-1', '#F5F5F2')
      html.style.setProperty('--bg-2', '#EFEFEB')
      html.style.setProperty('--muted-1', '#999999')
      html.style.setProperty('--muted-2', '#CCCCCC')
      html.style.setProperty('--ink', '#0A0A0A')
      html.style.setProperty('--ink-1', '#1A1A1A')
      html.style.setProperty('--ink-2', '#52524E')
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    applyTheme(newTheme)
    localStorage.setItem('sigq-theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
