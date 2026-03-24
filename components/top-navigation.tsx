import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { SimulationMode } from '@/app/page'

interface TopNavigationProps {
  mode: SimulationMode
  onModeChange: (mode: SimulationMode) => void
  bufferSize: number
  onBufferSizeChange: (size: number) => void
}

export default function TopNavigation({
  mode,
  onModeChange,
  bufferSize,
  onBufferSizeChange,
}: TopNavigationProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Producer-Consumer Simulator
            </h1>
            <p className="text-sm text-muted-foreground">
              Interactive visualization of synchronization problems
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Buffer Size */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-foreground">
                Buffer Size:
              </label>
              <select
                value={bufferSize}
                onChange={(e) => onBufferSizeChange(Number(e.target.value))}
                className="rounded-md border border-border bg-background px-2 py-1 text-sm"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2">
              <Button
                onClick={() => onModeChange('with-semaphore')}
                variant={mode === 'with-semaphore' ? 'default' : 'outline'}
                size="sm"
                className="transition-all duration-300 hover:scale-105"
              >
                With Semaphore
              </Button>
              <Button
                onClick={() => onModeChange('without-semaphore')}
                variant={mode === 'without-semaphore' ? 'default' : 'outline'}
                size="sm"
                className="transition-all duration-300 hover:scale-105"
              >
                Without Semaphore
              </Button>
            </div>

            {/* Theme Toggle */}
            <Button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              variant="outline"
              size="icon"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
