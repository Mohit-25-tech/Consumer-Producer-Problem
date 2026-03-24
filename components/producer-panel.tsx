import { Badge } from '@/components/ui/badge'
import { ProcessStatus } from '@/app/page'

interface ProducerPanelProps {
  status: ProcessStatus
  step: number
  produced: number
}

const producerCode = [
  '1: while (true) {',
  '2:   item = produce()',
  '3:   wait(empty)',
  '4:   wait(mutex)',
  '5:   buffer[in] = item',
  '6:   in = (in + 1) % N',
  '7:   signal(mutex)',
  '8:   signal(full)',
  '9: }',
]

function getStatusColor(status: ProcessStatus): string {
  switch (status) {
    case 'running':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'waiting':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'blocked':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'idle':
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
}

export default function ProducerPanel({
  status,
  step,
  produced,
}: ProducerPanelProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Producer</h2>
        <Badge className={`${getStatusColor(status)} transition-all duration-500 animate-pulse`}>
          {status.toUpperCase()}
        </Badge>
      </div>

      {/* Code Display */}
      <div className="flex-1 overflow-y-auto rounded-md bg-muted p-3 font-mono text-sm">
        {producerCode.map((line, idx) => {
          const isActive = (idx + 1) === (step % producerCode.length) + 1
          return (
            <div
              key={idx}
              className={`py-1 px-2 ${
                isActive
                  ? 'bg-yellow-300 text-black dark:bg-yellow-500 dark:text-white'
                  : 'text-muted-foreground'
              }`}
            >
              {line}
            </div>
          )
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-md bg-muted p-2">
          <div className="text-xs text-muted-foreground">Items Produced</div>
          <div className="text-lg font-bold text-foreground">{produced}</div>
        </div>
        <div className="rounded-md bg-muted p-2">
          <div className="text-xs text-muted-foreground">Step</div>
          <div className="text-lg font-bold text-foreground">{step}</div>
        </div>
      </div>
    </div>
  )
}
