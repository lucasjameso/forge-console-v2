import { useState } from 'react'
import type { FallbackProps } from 'react-error-boundary'

export function PageErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--bg-root))] p-8">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 text-center shadow-elevated">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--status-error-bg))]">
          <svg className="h-6 w-6 text-[hsl(var(--status-error))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page encountered an unexpected error. Try refreshing or going back.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={resetErrorBoundary}
            className="inline-flex items-center rounded-md bg-[hsl(var(--accent-coral))] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[hsl(var(--accent-coral-dark))]"
          >
            Try again
          </button>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-[hsl(var(--bg-elevated))]"
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
    </div>
  )
}
