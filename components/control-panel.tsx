import { Button } from '@/components/ui/button'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
} from 'lucide-react'

interface ControlPanelProps {
  isRunning: boolean
  onStart: () => void
  onPause: () => void
  onNext: () => void
  onPrevious: () => void
  onReset: () => void
  canGoPrevious: boolean
}

export default function ControlPanel({
  isRunning,
  onStart,
  onPause,
  onNext,
  onPrevious,
  onReset,
  canGoPrevious,
}: ControlPanelProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-foreground">Simulation Controls</h2>
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Start/Pause Button */}
        {isRunning ? (
          <Button
            onClick={onPause}
            size="lg"
            variant="destructive"
            className="gap-2 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Pause className="h-5 w-5 animate-pulse" />
            Pause
          </Button>
        ) : (
          <Button
            onClick={onStart}
            size="lg"
            className="gap-2 bg-green-600 hover:bg-green-700 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Play className="h-5 w-5" />
            Start
          </Button>
        )}

        {/* Previous Button */}
        <Button
          onClick={onPrevious}
          size="lg"
          variant="outline"
          disabled={!canGoPrevious}
          className="gap-2 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <SkipBack className="h-5 w-5" />
          Previous
        </Button>

        {/* Next Button */}
        <Button
          onClick={onNext}
          size="lg"
          variant="outline"
          className="gap-2 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <SkipForward className="h-5 w-5" />
          Next
        </Button>

        {/* Reset Button */}
        <Button
          onClick={onReset}
          size="lg"
          variant="outline"
          className="gap-2 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <RotateCcw className="h-5 w-5" />
          Reset
        </Button>
      </div>

      {/* Info */}
      <div className="mt-4 rounded-lg bg-muted p-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Tip:</span> Use Start to
          run the simulation automatically, or use Next/Previous for step-by-step
          execution. Watch how the semaphore values and buffer state change
          during execution.
        </p>
      </div>
    </div>
  )
}
