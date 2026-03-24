'use client'

import { useState, useEffect } from 'react'
import TopNavigation from '@/components/top-navigation'
import ProducerPanel from '@/components/producer-panel'
import ConsumerPanel from '@/components/consumer-panel'
import BufferVisualization from '@/components/buffer-visualization'
import SyncVariables from '@/components/sync-variables'
import ControlPanel from '@/components/control-panel'

export type SimulationMode = 'with-semaphore' | 'without-semaphore'
export type ProcessStatus = 'running' | 'waiting' | 'blocked' | 'idle'

export interface SimulationState {
  step: number
  producerStatus: ProcessStatus
  consumerStatus: ProcessStatus
  buffer: number[]
  inPointer: number
  outPointer: number
  count: number
  mutex: number
  empty: number
  full: number
  produced: number
  consumed: number
  raceCondition: boolean
}

const INITIAL_STATE: SimulationState = {
  step: 0,
  producerStatus: 'idle',
  consumerStatus: 'idle',
  buffer: [0, 0, 0],
  inPointer: 0,
  outPointer: 0,
  count: 0,
  mutex: 1,
  empty: 3,
  full: 0,
  produced: 0,
  consumed: 0,
  raceCondition: false,
}

export default function Page() {
  const [mode, setMode] = useState<SimulationMode>('with-semaphore')
  const [bufferSize, setBufferSize] = useState(3)
  const [state, setState] = useState<SimulationState>(INITIAL_STATE)
  const [isRunning, setIsRunning] = useState(false)
  const [history, setHistory] = useState<SimulationState[]>([INITIAL_STATE])
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0)

  // Handle Next Step
  const handleNextStep = () => {
    const currentState = history[currentHistoryIndex]
    const newState = executeStep(currentState, mode)
    const newHistory = history.slice(0, currentHistoryIndex + 1)
    newHistory.push(newState)
    setHistory(newHistory)
    setCurrentHistoryIndex(newHistory.length - 1)
    setState(newState)
  }

  // Handle Previous Step
  const handlePreviousStep = () => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1
      setCurrentHistoryIndex(newIndex)
      setState(history[newIndex])
    }
  }

  // Handle Reset
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

  // Handle Mode Change
  const handleModeChange = (newMode: SimulationMode) => {
    setMode(newMode)
    handleReset()
  }

  // Handle Buffer Size Change
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

  // Auto-advance when running
  useEffect(() => {
    if (!isRunning) return
    const timer = setTimeout(() => {
      handleNextStep()
    }, 1500)
    return () => clearTimeout(timer)
  }, [isRunning, state, history, currentHistoryIndex])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNavigation 
        mode={mode}
        onModeChange={handleModeChange}
        bufferSize={bufferSize}
        onBufferSizeChange={handleBufferSizeChange}
      />
      
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 gap-4 mb-4">
          {/* Main Simulation Area */}
          <div className="grid grid-cols-3 gap-4 h-96">
            {/* Producer Panel */}
            <ProducerPanel 
              status={state.producerStatus}
              step={state.step}
              produced={state.produced}
            />

            {/* Buffer Visualization */}
            <BufferVisualization 
              buffer={state.buffer}
              inPointer={state.inPointer}
              outPointer={state.outPointer}
              count={state.count}
              raceCondition={state.raceCondition}
            />

            {/* Consumer Panel */}
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

// Simulation Logic
let simulationCounter = 0

function executeStep(currentState: SimulationState, mode: SimulationMode): SimulationState {
  const state = { ...currentState }
  state.step += 1
  state.raceCondition = false

  if (mode === 'with-semaphore') {
    return executeStepWithSemaphore(state)
  } else {
    return executeStepWithoutSemaphore(state)
  }
}

function executeStepWithSemaphore(state: SimulationState): SimulationState {
  // Deterministic producer-consumer cycle
  const cycle = state.step % 6

  if (cycle === 0) {
    // Producer: Produce item
    state.producerStatus = 'running'
  } else if (cycle === 1) {
    // Producer: Wait on empty semaphore
    if (state.empty <= 0) {
      state.producerStatus = 'blocked'
      return state
    }
    state.empty--
    state.producerStatus = 'waiting'
  } else if (cycle === 2) {
    // Producer: Wait on mutex
    if (state.mutex <= 0) {
      state.producerStatus = 'blocked'
      return state
    }
    state.mutex--
    state.producerStatus = 'running'
    // Insert into buffer
    const item = state.produced + 1
    state.buffer[state.inPointer] = item
    state.inPointer = (state.inPointer + 1) % state.buffer.length
    state.count++
    state.produced++
  } else if (cycle === 3) {
    // Producer: Signal mutex and full
    state.mutex++
    state.full++
    state.producerStatus = 'idle'
  } else if (cycle === 4) {
    // Consumer: Wait on full
    if (state.full <= 0) {
      state.consumerStatus = 'blocked'
      return state
    }
    state.full--
    state.consumerStatus = 'waiting'
  } else if (cycle === 5) {
    // Consumer: Wait on mutex and consume
    if (state.mutex <= 0) {
      state.consumerStatus = 'blocked'
      return state
    }
    state.mutex--
    state.consumerStatus = 'running'
    const item = state.buffer[state.outPointer]
    state.buffer[state.outPointer] = 0
    state.outPointer = (state.outPointer + 1) % state.buffer.length
    state.count--
    state.consumed++
    state.mutex++
    state.empty++
    state.consumerStatus = 'idle'
  }

  return state
}

function executeStepWithoutSemaphore(state: SimulationState): SimulationState {
  // Simulate race conditions without proper synchronization
  const phase = state.step % 8

  if (phase === 0 || phase === 1 || phase === 2) {
    // Producer trying to add
    state.producerStatus = 'running'
    if (state.count < state.buffer.length) {
      const item = state.produced + 1
      state.buffer[state.inPointer] = item
      state.inPointer = (state.inPointer + 1) % state.buffer.length
      state.count++
      state.produced++
      
      // Potential race condition: consumer reads at same time
      if (phase === 2 && Math.random() > 0.4) {
        state.raceCondition = true
      }
    }
  } else if (phase === 3 || phase === 4 || phase === 5) {
    // Consumer trying to remove
    state.consumerStatus = 'running'
    if (state.count > 0) {
      const item = state.buffer[state.outPointer]
      state.buffer[state.outPointer] = 0
      state.outPointer = (state.outPointer + 1) % state.buffer.length
      state.count--
      state.consumed++
      
      // Potential race condition: producer writes at same time
      if (phase === 5 && Math.random() > 0.4) {
        state.raceCondition = true
      }
    }
  } else {
    // Idle phase
    state.producerStatus = 'idle'
    state.consumerStatus = 'idle'
  }

  return state
}
