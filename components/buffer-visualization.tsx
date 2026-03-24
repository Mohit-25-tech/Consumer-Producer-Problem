import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'

interface BufferVisualizationProps {
  buffer: number[]
  inPointer: number
  outPointer: number
  count: number
  raceCondition: boolean
}

export default function BufferVisualization({
  buffer,
  inPointer,
  outPointer,
  count,
  raceCondition,
}: BufferVisualizationProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      {/* Header */}
      <h2 className="text-lg font-bold text-foreground">Buffer</h2>

      {/* Race Condition Warning */}
      {raceCondition && (
        <Alert className="border-red-500 bg-red-50 dark:bg-red-900/20">
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-600 dark:text-red-400">
            Race Condition Detected!
          </AlertDescription>
        </Alert>
      )}

      {/* Buffer Visualization */}
      <div className="flex-1 flex items-center justify-center gap-2">
        {buffer.map((item, idx) => {
          const isIn = idx === inPointer
          const isOut = idx === outPointer
          const hasItem = item !== 0

          return (
            <div
              key={idx}
              className="relative flex flex-col items-center gap-1"
            >
              {/* Pointer Indicators */}
              {isIn && (
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  IN
                </div>
              )}
              {isOut && (
                <div className="text-xs font-bold text-purple-600 dark:text-purple-400">
                  OUT
                </div>
              )}

              {/* Buffer Slot */}
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 font-bold text-lg transition-all duration-500 ${
                  hasItem
                    ? 'border-green-500 bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300 scale-105'
                    : 'border-gray-300 bg-gray-100 text-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-600'
                } ${
                  isIn || isOut
                    ? 'ring-4 ring-offset-2 ring-yellow-400 dark:ring-yellow-500 animate-pulse'
                    : ''
                }`}
              >
                <span className={`transition-all duration-500 ${hasItem ? 'animate-bounce' : ''}`}>
                  {hasItem ? item : '—'}
                </span>
              </div>

              {/* Index Label */}
              <div className="text-xs text-muted-foreground">[{idx}]</div>
            </div>
          )
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="rounded-md bg-muted p-2 text-center">
          <div className="text-xs text-muted-foreground">Count</div>
          <div className="text-lg font-bold text-foreground">{count}</div>
        </div>
        <div className="rounded-md bg-muted p-2 text-center">
          <div className="text-xs text-muted-foreground">In Ptr</div>
          <div className="text-lg font-bold text-foreground">{inPointer}</div>
        </div>
        <div className="rounded-md bg-muted p-2 text-center">
          <div className="text-xs text-muted-foreground">Out Ptr</div>
          <div className="text-lg font-bold text-foreground">{outPointer}</div>
        </div>
      </div>
    </div>
  )
}
