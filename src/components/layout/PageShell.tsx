import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface PageShellProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
}

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

const pageTransition = {
  duration: 0.22,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
}

export function PageShell({ title, subtitle, actions, children }: PageShellProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="page-shell"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'hsl(var(--bg-root))',
      }}
    >
      {/* Page header */}
      <div
        className="page-shell-header"
        style={{
          padding: '32px 40px 0',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div>
          <h1 className="text-page-title">{title}</h1>
          {subtitle && (
            <p
              className="text-body"
              style={{ marginTop: 4 }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 4, flexShrink: 0 }}>
            {actions}
          </div>
        )}
      </div>

      {/* Page content */}
      <div className="page-shell-content" style={{ padding: '24px 40px 48px', flex: 1 }}>
        {children}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .page-shell-header { padding: 20px 16px 0 !important; flex-direction: column !important; }
          .page-shell-content { padding: 16px 16px 32px !important; }
        }
      `}</style>
    </motion.div>
  )
}
