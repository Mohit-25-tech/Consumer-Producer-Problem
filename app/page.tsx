'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Play, AlertTriangle, ShieldCheck } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

export default function HomePage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">OS Simulation</h1>
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
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent">
            Producer-Consumer Problem
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Interactive visualization of the classic synchronization problem in operating systems. 
            Learn how semaphores prevent race conditions between producer and consumer processes.
          </p>
        </div>

        {/* Option Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* With Semaphore Card */}
          <Link href="/with-semaphore" className="group">
            <div className="relative h-full p-8 rounded-2xl border-2 border-green-500/30 bg-gradient-to-br from-green-500/10 to-green-600/5 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-green-500/20">
                  <ShieldCheck className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-green-500">With Semaphore</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Experience the synchronized solution using mutex and counting semaphores. 
                See how proper synchronization prevents data corruption and ensures safe concurrent access.
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Mutex for mutual exclusion
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Empty & Full semaphores
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  No race conditions
                </li>
              </ul>
              <Button className="w-full bg-green-600 hover:bg-green-700 group-hover:scale-105 transition-transform">
                <Play className="h-4 w-4 mr-2" />
                Start Simulation
              </Button>
            </div>
          </Link>

          {/* Without Semaphore Card */}
          <Link href="/without-semaphore" className="group">
            <div className="relative h-full p-8 rounded-2xl border-2 border-red-500/30 bg-gradient-to-br from-red-500/10 to-red-600/5 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-red-500/20">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-red-500">Without Semaphore</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Observe what happens without proper synchronization. 
                Watch race conditions occur and understand why synchronization is critical.
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  No mutual exclusion
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Potential data corruption
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Race conditions visible
                </li>
              </ul>
              <Button className="w-full bg-red-600 hover:bg-red-700 group-hover:scale-105 transition-transform">
                <Play className="h-4 w-4 mr-2" />
                Start Simulation
              </Button>
            </div>
          </Link>
        </div>

        {/* Info Section */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Built for OS Assignment • Interactive Learning Tool
          </p>
        </div>
      </main>
    </div>
  )
}
