import { useState } from 'react'
import type { FallbackProps } from 'react-error-boundary'
import { cn } from '@/lib/utils'

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className={cn(
      'rounded-lg border border-[hsl(var(--status-error)/0.3)] bg-card p-6 text-center'
    )}>
      <p className="text-lg font-medium text-foreground">Something went wrong</p>
      <p className="mt-1 text-sm text-muted-foreground">
        This section encountered an error
      </p>
      <div className="mt-4 flex justify-center gap-2">
        <button
          onClick={resetErrorBoundary}
          className="inline-flex items-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm hover:bg-[hsl(var(--bg-elevated))]"
        >
          Try again
        </button>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-[hsl(var(--bg-elevated))] hover:text-foreground"
        >
          {showDetails ? 'Hide' : 'Show'} details
        </button>
      </div>
      {showDetails && (
        <pre className="mt-4 overflow-auto rounded-md bg-[hsl(var(--bg-elevated))] p-3 text-left text-xs text-muted-foreground">
          {error instanceof Error ? error.message : String(error)}
          {error instanceof Error && error.stack ? `\n\n${error.stack}` : ''}
        </pre>
      )}
    </div>
  )
}
