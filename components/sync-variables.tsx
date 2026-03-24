import { SimulationMode } from '@/app/page'

interface SyncVariablesProps {
  mode: SimulationMode
  mutex: number
  empty: number
  full: number
  count: number
  inPointer: number
  outPointer: number
  bufferSize: number
}

export default function SyncVariables({
  mode,
  mutex,
  empty,
  full,
  count,
  inPointer,
  outPointer,
  bufferSize,
}: SyncVariablesProps) {
  const variables =
    mode === 'with-semaphore'
      ? [
          { label: 'mutex', value: mutex, color: 'blue' },
          { label: 'empty', value: empty, color: 'purple' },
          { label: 'full', value: full, color: 'pink' },
          { label: 'count', value: count, color: 'green' },
          { label: 'in', value: inPointer, color: 'orange' },
          { label: 'out', value: outPointer, color: 'red' },
        ]
      : [
          { label: 'count', value: count, color: 'green' },
          { label: 'in', value: inPointer, color: 'orange' },
          { label: 'out', value: outPointer, color: 'red' },
          { label: 'bufferSize', value: bufferSize, color: 'gray' },
        ]

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300 dark:border-blue-700',
    purple:
      'bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-300 border-purple-300 dark:border-purple-700',
    pink: 'bg-pink-100 text-pink-900 dark:bg-pink-900/30 dark:text-pink-300 border-pink-300 dark:border-pink-700',
    green:
      'bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300 border-green-300 dark:border-green-700',
    orange:
      'bg-orange-100 text-orange-900 dark:bg-orange-900/30 dark:text-orange-300 border-orange-300 dark:border-orange-700',
    red: 'bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-300 border-red-300 dark:border-red-700',
    gray: 'bg-gray-100 text-gray-900 dark:bg-gray-900/30 dark:text-gray-300 border-gray-300 dark:border-gray-700',
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-foreground">
          Synchronization Variables
        </h2>
        <p className="text-sm text-muted-foreground">
          {mode === 'with-semaphore'
            ? 'Semaphore-based synchronization'
            : 'Without synchronization - potential race conditions'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {variables.map((variable) => (
          <div
            key={variable.label}
            className={`rounded-lg border-2 p-3 text-center transition-all duration-500 transform hover:scale-105 ${
              colorMap[variable.color]
            }`}
          >
            <div className="text-xs font-semibold uppercase tracking-wider opacity-75">
              {variable.label}
            </div>
            <div className="mt-2 text-2xl font-bold transition-all duration-300 animate-pulse">
              {variable.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
