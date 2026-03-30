'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Home, ArrowLeftRight } from 'lucide-react'
import { useTheme } from 'next-themes'
import ProducerPanel from '@/components/producer-panel'
import ConsumerPanel from '@/components/consumer-panel'
import BufferVisualization from '@/components/buffer-visualization'
import SyncVariables from '@/components/sync-variables'
import ControlPanel from '@/components/control-panel'
import { SimulationMode, SimulationState, INITIAL_STATE, executeStep } from '@/lib/simulation'

interface SimulationPageProps {
  mode: SimulationMode
}

export default function SimulationPage({ mode }: SimulationPageProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [bufferSize, setBufferSize] = useState(3)
  const [state, setState] = useState<SimulationState>(INITIAL_STATE)
  const [isRunning, setIsRunning] = useState(false)
  const [history, setHistory] = useState<SimulationState[]>([INITIAL_STATE])
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNextStep = () => {
    const currentState = history[currentHistoryIndex]
    const newState = executeStep(currentState, mode)
    const newHistory = history.slice(0, currentHistoryIndex + 1)
    newHistory.push(newState)
    setHistory(newHistory)
    setCurrentHistoryIndex(newHistory.length - 1)
    setState(newState)
  }

  const handlePreviousStep = () => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1
      setCurrentHistoryIndex(newIndex)
      setState(history[newIndex])
    }
  }

  const handleReset = () => {
    const initialState = {
      ...INITIAL_STATE,
      buffer: Array(bufferSize).fill(0),
      empty: bufferSize,
    }
    setState(initialState)
    setHistory([initialState])
    setCurrentHistoryIndex(0)
    setIsRunning(false)
  }

  const handleBufferSizeChange = (size: number) => {
    setBufferSize(size)
    const initialState = {
      ...INITIAL_STATE,
      buffer: Array(size).fill(0),
      empty: size,
    }
    setState(initialState)
    setHistory([initialState])
    setCurrentHistoryIndex(0)
    setIsRunning(false)
  }

  useEffect(() => {
    if (!isRunning) return
    const timer = setTimeout(() => {
      handleNextStep()
    }, 1500)
    return () => clearTimeout(timer)
  }, [isRunning, state, history, currentHistoryIndex])

  const otherMode = mode === 'with-semaphore' ? 'without-semaphore' : 'with-semaphore'
  const otherModeLabel = mode === 'with-semaphore' ? 'Without Semaphore' : 'With Semaphore'
  const currentModeLabel = mode === 'with-semaphore' ? 'With Semaphore' : 'Without Semaphore'

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Title & Navigation */}
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="icon" title="Back to Home">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {currentModeLabel}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Producer-Consumer Simulation
                </p>
              </div>
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
                  onChange={(e) => handleBufferSizeChange(Number(e.target.value))}
                  className="rounded-md border border-border bg-background px-2 py-1 text-sm"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              {/* Switch Mode */}
              <Link href={`/${otherMode}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowLeftRight className="h-4 w-4" />
                  {otherModeLabel}
                </Button>
              </Link>

              {/* Theme Toggle */}
              <Button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                variant="outline"
                size="icon"
                suppressHydrationWarning
              >
                {mounted ? (
                  theme === 'dark' ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )
                ) : (
                  <span className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 gap-4 mb-4">
          {/* Main Simulation Area */}
          <div className="grid grid-cols-3 gap-4 h-96">
            <ProducerPanel 
              status={state.producerStatus}
              step={state.step}
              produced={state.produced}
            />
            <BufferVisualization 
              buffer={state.buffer}
              inPointer={state.inPointer}
              outPointer={state.outPointer}
              count={state.count}
              raceCondition={state.raceCondition}
            />
            <ConsumerPanel 
              status={state.consumerStatus}
              step={state.step}
              consumed={state.consumed}
            />
          </div>

          {/* Sync Variables */}
          <SyncVariables 
            mode={mode}
            mutex={state.mutex}
            empty={state.empty}
            full={state.full}
            count={state.count}
            inPointer={state.inPointer}
            outPointer={state.outPointer}
            bufferSize={bufferSize}
          />

          {/* Control Panel */}
          <ControlPanel 
            isRunning={isRunning}
            onStart={() => setIsRunning(true)}
            onPause={() => setIsRunning(false)}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
            onReset={handleReset}
            canGoPrevious={currentHistoryIndex > 0}
          />
        </div>
      </main>
    </div>
  )
}
