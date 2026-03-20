import { Moon, Sun } from 'lucide-react'
import { Button } from './button'
import { useTheme } from '../../theme/ThemeProvider'

type ThemeToggleProps = {
  variant?: 'ghost' | 'outline'
}

export function ThemeToggle({ variant = 'ghost' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      type="button"
      size="icon"
      variant={variant}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={toggleTheme}
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
