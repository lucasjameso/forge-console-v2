import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'sonner'
import { queryClient } from '@/lib/queryClient'
import { Sidebar } from '@/components/layout/Sidebar'
import { PageErrorFallback } from '@/components/ui/PageErrorFallback'
import { AccessGate } from '@/components/AccessGate'
import { FeedbackWidget } from '@/components/FeedbackWidget'
import { Dashboard } from '@/pages/Dashboard'
import { Projects } from '@/pages/Projects'
import { ProjectDetail } from '@/pages/ProjectDetail'
import { BrainDump } from '@/pages/BrainDump'
import { ContentPipeline } from '@/pages/ContentPipeline'
import { SocialMedia } from '@/pages/SocialMedia'
import { ActivityLog } from '@/pages/ActivityLog'
import { Settings } from '@/pages/Settings'

function AppRoutes() {
  const location = useLocation()

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'hsl(var(--bg-root))',
      }}
    >
      <Sidebar />
      <main
        style={{
          flex: 1,
          marginLeft: 'var(--sidebar-width)',
          minWidth: 0,
          position: 'relative',
        }}
      >
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/brain-dump" element={<BrainDump />} />
            <Route path="/pipeline" element={<ContentPipeline />} />
            <Route path="/social" element={<SocialMedia />} />
            <Route path="/activity" element={<ActivityLog />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary FallbackComponent={PageErrorFallback}>
          <AccessGate>
            <AppRoutes />
            <FeedbackWidget />
          </AccessGate>
        </ErrorBoundary>
        <Toaster
          position="bottom-right"
          duration={3000}
          richColors
          closeButton
        />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
