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

export const INITIAL_STATE: SimulationState = {
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

export function executeStep(currentState: SimulationState, mode: SimulationMode): SimulationState {
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
  const cycle = state.step % 6

  if (cycle === 0) {
    state.producerStatus = 'running'
  } else if (cycle === 1) {
    if (state.empty <= 0) {
      state.producerStatus = 'blocked'
      return state
    }
    state.empty--
    state.producerStatus = 'waiting'
  } else if (cycle === 2) {
    if (state.mutex <= 0) {
      state.producerStatus = 'blocked'
      return state
    }
    state.mutex--
    state.producerStatus = 'running'
    const item = state.produced + 1
    state.buffer[state.inPointer] = item
    state.inPointer = (state.inPointer + 1) % state.buffer.length
    state.count++
    state.produced++
  } else if (cycle === 3) {
    state.mutex++
    state.full++
    state.producerStatus = 'idle'
  } else if (cycle === 4) {
    if (state.full <= 0) {
      state.consumerStatus = 'blocked'
      return state
    }
    state.full--
    state.consumerStatus = 'waiting'
  } else if (cycle === 5) {
    if (state.mutex <= 0) {
      state.consumerStatus = 'blocked'
      return state
    }
    state.mutex--
    state.consumerStatus = 'running'
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
  const phase = state.step % 8

  if (phase === 0 || phase === 1 || phase === 2) {
    state.producerStatus = 'running'
    if (state.count < state.buffer.length) {
      const item = state.produced + 1
      state.buffer[state.inPointer] = item
      state.inPointer = (state.inPointer + 1) % state.buffer.length
      state.count++
      state.produced++
      
      if (phase === 2 && Math.random() > 0.4) {
        state.raceCondition = true
      }
    }
  } else if (phase === 3 || phase === 4 || phase === 5) {
    state.consumerStatus = 'running'
    if (state.count > 0) {
      state.buffer[state.outPointer] = 0
      state.outPointer = (state.outPointer + 1) % state.buffer.length
      state.count--
      state.consumed++
      
      if (phase === 5 && Math.random() > 0.4) {
        state.raceCondition = true
      }
    }
  } else {
    state.producerStatus = 'idle'
    state.consumerStatus = 'idle'
  }

  return state
}
