import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquarePlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSubmitFeedback } from '@/hooks/usePageFeedback'

const routeNames: Record<string, string> = {
  '/': 'Dashboard',
  '/projects': 'Projects',
  '/brain-dump': 'Brain Dump',
  '/pipeline': 'Content Pipeline',
  '/social': 'Social Media',
  '/activity': 'Activity Log',
  '/settings': 'Settings',
}

function getPageName(pathname: string): string {
  if (routeNames[pathname]) return routeNames[pathname]
  if (pathname.startsWith('/projects/')) return 'Project Detail'
  return pathname
}

export function FeedbackWidget() {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<'fix' | 'suggestion'>('fix')
  const [content, setContent] = useState('')
  const location = useLocation()
  const submitFeedback = useSubmitFeedback()
  const pageName = getPageName(location.pathname)

  function handleSubmit() {
    if (!content.trim()) return
    submitFeedback.mutate(
      { page: pageName, feedback_type: type, content: content.trim() },
      {
        onSuccess: () => {
          setContent('')
          setOpen(false)
        },
      },
    )
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 90,
          width: 48,
          height: 48,
          borderRadius: '50%',
          backgroundColor: 'hsl(var(--accent-coral))',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(120,90,60,0.18)',
          transition: 'transform 0.1s',
        }}
        onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.95)' }}
        onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        <MessageSquarePlus size={22} />
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, zIndex: 95, backgroundColor: 'rgba(0,0,0,0.3)' }}
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              style={{
                position: 'fixed',
                bottom: 0,
                right: 0,
                width: 400,
                maxWidth: '100vw',
                zIndex: 100,
                backgroundColor: 'hsl(var(--bg-surface))',
                borderTop: '1px solid hsl(var(--border-subtle))',
                borderLeft: '1px solid hsl(var(--border-subtle))',
                borderTopLeftRadius: 'var(--radius-lg)',
                boxShadow: '0 -8px 32px rgba(120,90,60,0.12)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Header */}
              <div style={{ padding: '16px 20px', borderBottom: '1px solid hsl(var(--border-subtle))', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 className="text-card-title" style={{ margin: 0, color: 'hsl(var(--text-primary))' }}>Page Feedback</h3>
                  <span className="text-caption" style={{ color: 'hsl(var(--accent-coral))' }}>{pageName}</span>
                </div>
                <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  <X size={18} style={{ color: 'hsl(var(--text-tertiary))' }} />
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Type toggle */}
                <div style={{ display: 'flex', gap: 8 }}>
                  {([
                    { key: 'fix' as const, label: 'Fix / Style Issue' },
                    { key: 'suggestion' as const, label: 'Feature Suggestion' },
                  ]).map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setType(opt.key)}
                      className="text-caption font-medium"
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-pill)',
                        border: type === opt.key ? 'none' : '1px solid hsl(var(--border-default))',
                        backgroundColor: type === opt.key ? 'hsl(var(--accent-coral))' : 'transparent',
                        color: type === opt.key ? '#fff' : 'hsl(var(--text-secondary))',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Content */}
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={type === 'fix' ? 'What needs to be fixed or changed?' : 'What feature or improvement would you like?'}
                  style={{
                    width: '100%',
                    minHeight: 100,
                    resize: 'vertical',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid hsl(var(--border-default))',
                    backgroundColor: 'hsl(var(--bg-surface))',
                    color: 'hsl(var(--text-primary))',
                    fontSize: 13,
                    fontFamily: 'inherit',
                    outline: 'none',
                  }}
                />

                {/* Submit */}
                <Button
                  onClick={handleSubmit}
                  disabled={!content.trim() || submitFeedback.isPending}
                  style={{ width: '100%' }}
                >
                  {submitFeedback.isPending ? 'Saving...' : 'Submit Feedback'}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
