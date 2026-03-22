import { useState, useRef, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const ACCESS_CODE = import.meta.env.VITE_ACCESS_CODE as string | undefined

function isAuthenticated(): boolean {
  try {
    return sessionStorage.getItem('forge_authenticated') === 'true'
  } catch {
    return false
  }
}

export function AccessGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(() => isAuthenticated())
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!authed) inputRef.current?.focus()
  }, [authed])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (code === ACCESS_CODE) {
      try {
        sessionStorage.setItem('forge_authenticated', 'true')
      } catch { /* sessionStorage unavailable */ }
      setAuthed(true)
    } else {
      setError(true)
      setShaking(true)
      setCode('')
      setTimeout(() => {
        setError(false)
        setShaking(false)
      }, 600)
      inputRef.current?.focus()
    }
  }, [code])

  // No access code configured = skip gate (local dev)
  if (!ACCESS_CODE) return <>{children}</>

  // Authenticated = show app
  if (authed) return <>{children}</>

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'hsl(var(--bg-root))',
        padding: 24,
      }}
    >
      <div
        style={{
          animation: shaking ? 'shake 0.4s ease-in-out' : undefined,
          opacity: 1,
        }}
      >
        <Card className="p-8" style={{ width: 360, textAlign: 'center' }}>
          {/* Forge logo */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'hsl(var(--accent-navy))',
              color: 'hsl(var(--accent-coral))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 700,
              margin: '0 auto 24px',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            F
          </div>

          <h1
            className="text-section-header"
            style={{ marginBottom: 8, color: 'hsl(var(--text-primary))' }}
          >
            Forge Console
          </h1>
          <p
            className="text-caption"
            style={{ marginBottom: 24, color: 'hsl(var(--text-tertiary))' }}
          >
            Enter access code
          </p>

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              style={{
                width: '100%',
                fontSize: 32,
                fontWeight: 600,
                letterSpacing: '0.3em',
                textAlign: 'center',
                padding: '12px 16px',
                border: `1px solid hsl(var(${error ? '--status-error' : '--border-default'}))`,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'hsl(var(--bg-surface))',
                color: 'hsl(var(--text-primary))',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'Inter, system-ui, monospace',
              }}
              placeholder="------"
              autoComplete="off"
            />

            {error && (
              <p
                className="text-caption"
                style={{
                  color: 'hsl(var(--status-error))',
                  marginTop: 8,
                }}
              >
                Invalid code
              </p>
            )}

            <Button
              type="submit"
              style={{ width: '100%', marginTop: 16 }}
              disabled={code.length < 6}
            >
              Enter
            </Button>
          </form>
        </Card>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          12.5% { transform: translateX(-12px); }
          25% { transform: translateX(12px); }
          37.5% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          62.5% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  )
}
