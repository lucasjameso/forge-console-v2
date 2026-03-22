import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Database,
  Workflow,
  Globe,
  MessageSquare,
  Cpu,
  ExternalLink,
  CheckCircle,
  XCircle,
  Info,
  MessageSquarePlus,
  Wrench,
  Lightbulb,
} from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { isSupabaseConfigured } from '@/lib/supabase'
import { usePageFeedback } from '@/hooks/usePageFeedback'
import { formatRelativeTime } from '@/lib/utils'

interface Integration {
  name: string
  description: string
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  connected: boolean
  envVars: { key: string; set: boolean }[]
  url?: string
}

const integrations: Integration[] = [
  {
    name: 'Supabase',
    description: 'Database, auth, and real-time subscriptions',
    icon: Database,
    connected: isSupabaseConfigured,
    envVars: [
      { key: 'VITE_SUPABASE_URL', set: Boolean(import.meta.env.VITE_SUPABASE_URL) },
      { key: 'VITE_SUPABASE_ANON_KEY', set: Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY) },
    ],
    url: 'https://supabase.com/dashboard',
  },
  {
    name: 'n8n',
    description: 'Workflow automation and task dispatching',
    icon: Workflow,
    connected: Boolean(import.meta.env.VITE_N8N_URL && import.meta.env.VITE_N8N_API_KEY),
    envVars: [
      { key: 'VITE_N8N_URL', set: Boolean(import.meta.env.VITE_N8N_URL) },
      { key: 'VITE_N8N_API_KEY', set: Boolean(import.meta.env.VITE_N8N_API_KEY) },
    ],
    url: 'https://n8n.iac-solutions.io',
  },
  {
    name: 'Cloudflare',
    description: 'Pages hosting and tunnel management',
    icon: Globe,
    connected: Boolean(import.meta.env.VITE_CF_ACCOUNT_ID),
    envVars: [
      { key: 'VITE_CF_ACCOUNT_ID', set: Boolean(import.meta.env.VITE_CF_ACCOUNT_ID) },
    ],
  },
  {
    name: 'Slack',
    description: 'Notifications and content approval flow',
    icon: MessageSquare,
    connected: Boolean(import.meta.env.VITE_SLACK_WEBHOOK_URL),
    envVars: [
      { key: 'VITE_SLACK_WEBHOOK_URL', set: Boolean(import.meta.env.VITE_SLACK_WEBHOOK_URL) },
    ],
  },
  {
    name: 'Claude API',
    description: 'AI-powered brain dump parsing and task generation',
    icon: Cpu,
    connected: Boolean(import.meta.env.VITE_ANTHROPIC_API_KEY),
    envVars: [
      { key: 'VITE_ANTHROPIC_API_KEY', set: Boolean(import.meta.env.VITE_ANTHROPIC_API_KEY) },
    ],
  },
]

function IntegrationCard({ integration, index }: { integration: Integration; index: number }) {
  const Icon = integration.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
    <Card className="p-6" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: integration.connected ? 'hsl(var(--status-success-bg))' : 'hsl(var(--bg-elevated))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={18} style={{ color: integration.connected ? 'hsl(var(--status-success))' : 'hsl(var(--text-tertiary))' }} />
          </div>
          <div>
            <h3 className="text-card-title" style={{ color: 'hsl(var(--text-primary))', margin: 0 }}>
              {integration.name}
            </h3>
            <span className="text-caption">{integration.description}</span>
          </div>
        </div>
        <Badge variant={integration.connected ? 'success' : 'neutral'}>
          {integration.connected ? 'Connected' : 'Not Connected'}
        </Badge>
      </div>

      {/* Env vars status */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {integration.envVars.map(env => (
          <div key={env.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {env.set ? (
              <CheckCircle size={13} style={{ color: 'hsl(var(--status-success))' }} />
            ) : (
              <XCircle size={13} style={{ color: 'hsl(var(--text-tertiary))' }} />
            )}
            <code className="text-[11px]" style={{ color: 'hsl(var(--text-secondary))', fontFamily: 'monospace' }}>
              {env.key}
            </code>
            <span className="text-caption">{env.set ? 'Set' : 'Missing'}</span>
          </div>
        ))}
      </div>

      {/* Link */}
      {integration.url && (
        <a
          href={integration.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-caption font-medium"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: 'hsl(var(--accent-coral))',
            textDecoration: 'none',
            marginTop: 'auto',
          }}
        >
          Open dashboard
          <ExternalLink size={11} />
        </a>
      )}
    </Card>
    </motion.div>
  )
}

type FeedbackFilter = 'all' | 'open' | 'done'

function FeedbackLog() {
  const [filter, setFilter] = useState<FeedbackFilter>('all')
  const queryFilter = filter === 'all' ? undefined : filter
  const { data: feedback, isLoading } = usePageFeedback(queryFilter)
  const items = feedback ?? []

  const filters: { key: FeedbackFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'open', label: 'Open' },
    { key: 'done', label: 'Done' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MessageSquarePlus size={15} style={{ color: 'hsl(var(--text-tertiary))' }} />
          <span className="text-section-header">Feedback Log</span>
          {items.length > 0 && <Badge variant="neutral">{items.length}</Badge>}
        </div>
        <div style={{ display: 'flex', gap: 4, backgroundColor: 'hsl(var(--bg-elevated))', borderRadius: 'var(--radius-pill)', padding: 3 }}>
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="text-caption"
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: filter === f.key ? 600 : 400,
                color: filter === f.key ? 'hsl(var(--text-primary))' : 'hsl(var(--text-tertiary))',
                backgroundColor: filter === f.key ? 'hsl(var(--bg-surface))' : 'transparent',
                boxShadow: filter === f.key ? 'var(--shadow-card)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <Card style={{ overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <span className="text-caption">Loading feedback...</span>
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: '32px 24px', textAlign: 'center' }}>
            <span className="text-body" style={{ color: 'hsl(var(--text-tertiary))' }}>
              {filter === 'all' ? 'No feedback yet. Use the coral button on any page to submit.' : `No ${filter} feedback.`}
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {items.map((item, idx) => {
              const isDone = item.status === 'done'
              return (
                <div
                  key={item.id}
                  style={{
                    padding: '10px 16px',
                    borderBottom: idx < items.length - 1 ? '1px solid hsl(var(--border-subtle))' : 'none',
                    opacity: isDone ? 0.6 : 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {item.feedback_type === 'fix' ? (
                      <Wrench size={12} style={{ color: 'hsl(var(--status-error))', flexShrink: 0 }} />
                    ) : (
                      <Lightbulb size={12} style={{ color: 'hsl(var(--status-info))', flexShrink: 0 }} />
                    )}
                    <Badge variant={item.feedback_type === 'fix' ? 'error' : 'info'}>
                      {item.feedback_type === 'fix' ? 'Fix' : 'Suggestion'}
                    </Badge>
                    <span className="text-caption" style={{ color: 'hsl(var(--accent-coral))' }}>{item.page}</span>
                    <span style={{ flex: 1 }} />
                    <Badge variant={item.status === 'done' ? 'success' : item.status === 'in_progress' ? 'warning' : 'neutral'}>
                      {item.status === 'in_progress' ? 'In Progress' : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Badge>
                    <span className="text-caption">{formatRelativeTime(item.created_at)}</span>
                  </div>
                  <p
                    className="text-body-sm"
                    style={{
                      color: 'hsl(var(--text-primary))',
                      margin: 0,
                      textDecoration: isDone ? 'line-through' : 'none',
                      paddingLeft: 20,
                    }}
                  >
                    {item.content}
                  </p>
                  {isDone && item.resolution && (
                    <p
                      className="text-caption"
                      style={{
                        margin: 0,
                        paddingLeft: 20,
                        color: 'hsl(var(--status-success))',
                        fontStyle: 'italic',
                      }}
                    >
                      Resolution: {item.resolution}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}

export function Settings() {
  return (
    <PageShell title="Settings" subtitle="Configure integrations and preferences.">
      <div className="flex flex-col gap-8">
        {/* Integrations */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span className="text-section-header">Integrations</span>
          </div>
          <div className="settings-grid" style={{ display: 'grid', gap: 16 }}>
            {integrations.map((integration, idx) => (
              <IntegrationCard key={integration.name} integration={integration} index={idx} />
            ))}
          </div>
        </div>

        {/* Feedback Log */}
        <FeedbackLog />

        {/* About */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Info size={15} style={{ color: 'hsl(var(--text-tertiary))' }} />
            <span className="text-section-header">About</span>
          </div>
          <Card className="p-6">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-body">Application</span>
                <span className="text-body font-medium" style={{ color: 'hsl(var(--text-primary))' }}>Forge Console v2</span>
              </div>
              <div style={{ borderTop: '1px solid hsl(var(--border-subtle))' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-body">Version</span>
                <span className="text-body font-medium" style={{ color: 'hsl(var(--text-primary))' }}>2.0.0</span>
              </div>
              <div style={{ borderTop: '1px solid hsl(var(--border-subtle))' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-body">Organization</span>
                <span className="text-body font-medium" style={{ color: 'hsl(var(--text-primary))' }}>IAC Solutions</span>
              </div>
              <div style={{ borderTop: '1px solid hsl(var(--border-subtle))' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-body">Stack</span>
                <span className="text-body font-medium" style={{ color: 'hsl(var(--text-primary))' }}>React + TypeScript + Supabase + Cloudflare Pages</span>
              </div>
              <div style={{ borderTop: '1px solid hsl(var(--border-subtle))' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-body">Data Mode</span>
                <Badge variant={isSupabaseConfigured ? 'success' : 'warning'}>
                  {isSupabaseConfigured ? 'Live (Supabase)' : 'Mock Data'}
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Instructions for .env */}
        {!isSupabaseConfigured && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6" style={{ borderLeft: '3px solid hsl(var(--status-warning))', backgroundColor: 'hsl(var(--status-warning-bg))' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Info size={16} style={{ color: 'hsl(var(--status-warning))', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p className="text-body font-medium" style={{ color: 'hsl(var(--text-primary))', margin: '0 0 6px' }}>
                    Running with mock data
                  </p>
                  <p className="text-body-sm" style={{ color: 'hsl(var(--text-secondary))', margin: 0, lineHeight: 1.5 }}>
                    To connect to a live database, add your Supabase credentials to the .env.local file and restart the dev server. Run the schema from supabase/schema.sql to create the required tables.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      <style>{`
        .settings-grid { grid-template-columns: repeat(2, 1fr); }
        @media (max-width: 768px) { .settings-grid { grid-template-columns: 1fr; } }
      `}</style>
    </PageShell>
  )
}
